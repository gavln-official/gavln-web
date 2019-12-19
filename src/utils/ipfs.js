import IPFS from 'ipfs';
import Crypto from 'crypto-js';
import Erasure from './erasure';

let rootNode = null;

async function init() {
  if (!rootNode) {
    rootNode = await IPFS.create();
  }

  return rootNode;
}

async function encode(file) {
  const buffer = new Uint8Array(await file.arrayBuffer());

  return Erasure.split(buffer, 5, 2);
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

async function upload(key, file) {
  try {
    const node = await init();
    const fragments = await encode(file);

    const list = [];
    for (const i in fragments) { /* eslint-disable-line */
      const data = Crypto.AES.encrypt(
        Crypto.lib.WordArray.create(fragments[i]),
        key,
      );

      const res = await node.add(data.toString()); /* eslint-disable-line */
      list.push(...res);
    }

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
  try {
    const node = await init();

    const fragments = [];
    for (const item of list) { /* eslint-disable-line */
      const blocks = await node.get(item.cid); /* eslint-disable-line */

      const data = blocks.map(block => block.content).join('');
      const raw = Crypto.AES.decrypt(data, item.key);
      fragments.push(wordArrayToU8Array(raw));
    }

    return decode(fragments, size);
  } catch (error) {
    throw error;
  }
}

export default {
  init,
  upload,
  download,
};
