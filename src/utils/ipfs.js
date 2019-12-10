import IPFS from 'ipfs';
import Crypto from 'crypto-js';

let rootNode = null;

async function init() {
  if (!rootNode) {
    rootNode = await IPFS.create();
  }

  return rootNode;
}

async function encode(file) {
  const buffer = new Uint8Array(await file.arrayBuffer());

  return window.erasure.split(buffer, 40, 10);
}

async function test(key, file) {
  const node = await init();
  const fragments = await encode(file);

  const list = [];
  for (const i in fragments) { /* eslint-disable-line */
    const data = Crypto.AES.encrypt(
      Crypto.lib.WordArray.create(fragments[i]),
      key,
    );

    const res = await node.add(data.toString()); /* eslint-disable-line */
    list.push(res[0]);
  }

  return list;
}

export default {
  init,
  test,
};
