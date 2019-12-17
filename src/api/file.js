import HTTP from './http';
import IPFS from '../utils/ipfs';

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

function getUploadKey() {
  return HTTP({
    method: 'GET',
    url: '/file/key',
  });
}

async function upload(file, path, name) {
  try {
    const keyRes = await getUploadKey();

    const {
      key,
    } = keyRes.data;

    const list = await IPFS.upload(key, file);
    const blocks = list.map(item => ({
      key,
      cid: item.hash,
    }));

    return await addFile(path, name, file.size, blocks);
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

export default {
  getPath,
  createPath,
  updatePath,
  upload,
  deletePath,
  move,
  copy,
};
