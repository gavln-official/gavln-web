import IPFS from 'ipfs';
import Crypto from 'crypto-js';
import Erasure from './erasure';
import Transmission from './transmission';

let rootNode = null;

async function init() {
  if (!rootNode) {
    rootNode = await IPFS.create();
  }

  return rootNode;
}

function getBlockSize(file) {
  let blockSize = 1e6;
  let originalBlocks = Math.ceil(file.size / blockSize);
  let extraBlocks = Math.ceil(originalBlocks / 3);
  if (originalBlocks + 2 * extraBlocks > 255) {
    originalBlocks = 171;
    extraBlocks = 42;
  }
  const totalBlocks = originalBlocks + 2 * extraBlocks;
  blockSize = Number((file.size / totalBlocks).toFixed(2));
  return {
    blockSize,
    originalBlocks,
    extraBlocks,
    totalBlocks,
  };
}

async function encode(file) {
  const buffer = new Uint8Array(await file.arrayBuffer());
  const blockSize = getBlockSize(file);
  return Erasure.split(buffer, blockSize.originalBlocks, blockSize.extraBlocks);
}

/* eslint-disable */
// https://gist.github.com/getify/7325764#file-gistfile1-js-L7
function wordArrayToU8Array(wordArray) {
  const length = wordArray.words.length;
  const u8Array = new Uint8Array(wordArray.sigBytes + 1);

  let offset = 0;
  for (let i = 0; i < length; i += 1) {
    const word = wordArray.words[i];

    u8Array[offset + 1] = word >> 24;
    u8Array[offset + 2] = (word >> 16) & 0xff;
    u8Array[offset + 3] = (word >> 8) & 0xff;
    u8Array[offset + 4] = word & 0xff;

    offset += 4;
  }

  return u8Array.subarray(1);
}
/* eslint-enable */

let node = null;
async function upload(fid, keys, fragments) {
  if (!node) {
    node = await init();
  }
  try {
    const list = [];
    for (let i = 0; i < fragments.length; i++) { /* eslint-disable-line */
      const data = Crypto.AES.encrypt(
        Crypto.lib.WordArray.create(fragments[i]),
        keys[i],
      );

      const res = await node.add(data.toString()); /* eslint-disable-line */
      const block = {
        key: keys[i],
        cid: res.hash,
      };
      list.push(block);
      Transmission.addBlock('upload', fid, block);
    }
    await node.stop();
    node = null;
    return list;
  } catch (error) {
    throw error;
  }
}

function decode(fragments, size) {
  const fileData = Erasure.recombine(fragments, size, 5, 2);

  return fileData.buffer.slice(0, size);
}

async function download(list, size) {
  if (!node) {
    node = await init();
  }
  try {
    const fragments = [];
    for (const item of list) { /* eslint-disable-line */
      const blocks = await node.get(item.cid); /* eslint-disable-line */

      const data = blocks.map(block => block.content).join('');
      const raw = Crypto.AES.decrypt(data, item.key);
      fragments.push(wordArrayToU8Array(raw));
    }
    await node.stop();
    node = null;
    return decode(fragments, size);
  } catch (error) {
    throw error;
  }
}

export default {
  init,
  encode,
  decode,
  upload,
  download,
  getBlockSize,
};
