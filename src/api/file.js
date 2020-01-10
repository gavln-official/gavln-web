import HTTP from './http';
import IPFS from '../utils/ipfs';
import Transmission from '../utils/transmission';

function getPath(path) {
  const data = new FormData();
  data.append('path', path);

  return HTTP({
    method: 'POST',
    url: '/file/list',
    data,
  });
}

function createPath(path) {
  const data = new FormData();
  data.append('path', path);

  return HTTP({
    method: 'POST',
    url: '/file/mkdir',
    data,
  });
}

function updatePath(path, name) {
  const data = new FormData();
  data.append('path', path);
  data.append('name', name);

  return HTTP({
    method: 'POST',
    url: '/file/reName',
    data,
  });
}

function addFile(path, name, size, blocks) {
  const data = {
    path,
    name,
    size,
    blocks,
  };

  return HTTP({
    method: 'POST',
    url: '/file/add',
    data,
  });
}

function getUploadKey(number = 1) {
  return HTTP({
    method: 'GET',
    url: `/file/key/${number}`,
  });
}

async function upload(file, path, name, blockSize, fragments) {
  const keyRes = await getUploadKey(blockSize.totalBlocks);
  const keys = keyRes.data.key;

  let list = null;
  try {
    list = await IPFS.upload(file.fid, keys, fragments);
  } catch (error) {
    console.error(`IPFS上传报错：${error}`);
    return false;
  }
  try {
    const r = await addFile(path, name, file.size, list);
    Transmission.fileComplete('upload', file.fid);
  } catch (err) {
    console.log(err.detail);
  }
  return true;
}

async function prepareUpload(file, path, name) {
  file.fid = `${path}//${name}//${file.size}`; /* eslint-disable-line */
  const blockSize = IPFS.getBlockSize(file);
  // encode file, this step can take a long time
  // so make sure to inform user it's in progress
  const fragments = await IPFS.encode(file);
  Transmission.addFile('upload', file, blockSize);
  // start upload
  // we don't wait for the upload procedure, return immediately
  upload(file, path, name, blockSize, fragments);
  return true;
}

async function download(file) {
  try {
    const list = await IPFS.download(file.blocks, file.size);

    return list;
  } catch (error) {
    throw error;
  }
}

function deletePath(path) {
  const data = new FormData();
  data.append('path', path);

  return HTTP({
    method: 'POST',
    url: '/file/delete',
    data,
  });
}

function move(from, to) {
  const data = new FormData();
  data.append('path', from);
  data.append('tagPath', to);

  return HTTP({
    method: 'POST',
    url: '/file/mv',
    data,
  });
}

function copy(from, to) {
  const data = new FormData();
  data.append('path', from);
  data.append('tagPath', to);

  return HTTP({
    method: 'POST',
    url: '/file/cp',
    data,
  });
}

function search(text) {
  const data = new FormData();
  data.append('search', text);

  return HTTP({
    method: 'POST',
    url: '/search/search',
    data,
  });
}

function timestamp() {
  return HTTP({
    method: 'GET',
    url: '/timestamp',
  });
}

async function share(path, duration, code) {
  try {
    let time = 0;
    if (duration) {
      const timeRes = await timestamp();

      time = timeRes.data.unix + duration * 60 * 60 * 24;
    }

    const data = new FormData();
    data.append('path', path);
    data.append('expires', time);
    if (code) {
      data.append('code', code);
    }

    const shareRes = await HTTP({
      method: 'POST',
      url: '/share/share',
      data,
    });

    return shareRes;
  } catch (error) {
    throw error;
  }
}

export default {
  getPath,
  createPath,
  updatePath,
  upload,
  prepareUpload,
  download,
  deletePath,
  move,
  copy,
  search,
  share,
  getBlockSize: IPFS.getBlockSize,
  decode: IPFS.decode,
};
