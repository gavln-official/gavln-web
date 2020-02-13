import IPFS from 'ipfs';
import Crypto from 'crypto-js';
import ERASURE from 'worker-loader!./erasure-worker';
import Transmission from './transmission';

/* eslint-disable */
// https://gist.github.com/hanayashiki/8dac237671343e7f0b15de617b0051bd
(function () {
  File.prototype.arrayBuffer = File.prototype.arrayBuffer || myArrayBuffer;
  Blob.prototype.arrayBuffer = Blob.prototype.arrayBuffer || myArrayBuffer;

  function myArrayBuffer() {
    // this: File or Blob
    return new Promise((resolve) => {
      let fr = new FileReader();
      fr.onload = () => {
        resolve(fr.result);
      };
      fr.readAsArrayBuffer(this);
    })
  }
})();
/* eslint-enable */

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
  return new Promise(async (resolve) => {
    const buffer = new Uint8Array(await file.arrayBuffer());
    const blockSize = getBlockSize(file);
    const fragments = [];
    const erasure = new ERASURE();
    erasure.onmessage = (evt) => {
      const data = evt.data;
      const fragment = new Uint8Array(data.buffer);
      fragments.push(fragment);
      if (data.blockId === data.totalBlocks) {
        erasure.onmessage = null;
        erasure.terminate();
        resolve(fragments);
      }
    };
    erasure.postMessage({
      command: 'encode',
      buffer: buffer.buffer,
      blockSize,
    }, [buffer.buffer]);
  });
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

async function upload(fid, keys, fragments, finishedBlocks) {
  if (!rootNode) {
    rootNode = await init();
  }
  try {
    const list = finishedBlocks;
    for (let i = list.length; i < fragments.length; i++) { /* eslint-disable-line */
      const file = Transmission.getFile('upload', fid);
      const key = keys[i - list.length];
      if (file.paused) {
        await rootNode.stop();
        rootNode = null;
        return 'User paused upload';
      }
      const data = Crypto.AES.encrypt(
        Crypto.lib.WordArray.create(fragments[i]),
        key,
      );
      const res = await rootNode.add(data.toString()); /* eslint-disable-line */
      const block = {
        key,
        cid: res[0].hash,
      };
      list.push(block);
      Transmission.blockUploadCompleted(fid, block);
    }
    await rootNode.stop();
    rootNode = null;
    return list;
  } catch (error) {
    throw error;
  }
}

function decode(fragments, size) {
  return new Promise((resolve) => {
    const erasure = new ERASURE();
    erasure.onmessage = (evt) => {
      erasure.onmessage = null;
      erasure.terminate();
      resolve(evt.data.buffer);
    };
    let i = 0;
    const total = fragments.length;
    for (; i < total; i++) { /* eslint-disable-line */
      erasure.postMessage({
        command: 'decode',
        blockId: i + 1,
        totalBlocks: total,
        size,
        buffer: fragments[i].buffer,
      }, [fragments[i].buffer]);
    }
  });
}

async function download(file) {
  const list = file.blocks;
  if (!rootNode) {
    rootNode = await init();
  }
  try {
    const fragments = [];
    for (const item of list) { /* eslint-disable-line */
      const checkFileStatus = Transmission.getFile('download', file.fid);
      if (checkFileStatus.paused) {
        await rootNode.stop();
        rootNode = null;
        return 'User cancelled download';
      }
      const blocks = await rootNode.get(item.cid); /* eslint-disable-line */
      const data = blocks.map(block => block.content).join('');
      const raw = Crypto.AES.decrypt(data, item.key);
      fragments.push(wordArrayToU8Array(raw));
      Transmission.blockDownloadComplete(file.fid);
    }
    await rootNode.stop();
    rootNode = null;
    return fragments;
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
