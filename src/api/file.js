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
    url: '/file/key/1',
  });
}

async function upload(file, path, name) {
  try {
    const keyRes = await getUploadKey();

    const key = keyRes.data.key[0];

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

function search(config) {
  const data = new FormData();
  data.append('search', config.text);
  if (config.path) {
    data.append('path', config.path);
  }
  if (config.suffixs
      && config.suffixs.length) {
    data.append('suffixs', config.suffixs);
  }
  if (config.startTime) {
    data.append('startTime', config.startTime);
  }
  if (config.endTime) {
    data.append('endTime', config.endTime);
  }

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
  download,
  deletePath,
  move,
  copy,
  search,
  share,
};
