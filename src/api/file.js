import FileDownload from 'js-file-download';
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

function addFile(path, name, size, blocks, blockSize) {
  const data = {
    path,
    name,
    size,
    blocks,
    data_shard: blockSize.originalBlocks,
    parity_shard: blockSize.extraBlocks,
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
  const progress = Transmission.getUploadProgress(file.fid);
  const keyRes = await getUploadKey(progress.remainingBlocks);
  const keys = keyRes.data.key;

  let list = null;
  try {
    list = await IPFS.upload(file.fid, keys, fragments, progress.finishedBlocks);
  } catch (error) {
    // console.error(`IPFS上传报错：${error}`);
    return false;
  }
  if (typeof list === 'string') {
    return false;
  }
  try {
    await addFile(path, name, file.size, list, blockSize);
  } catch (err) {
    // if (err.detail !== 'file exists') {
    //   console.log(`file/add报错：${err.detail}`);
    // }
  }
  Transmission.fileComplete('upload', file.fid);
  return true;
}

async function prepareUpload(file, path, name) {
  file.fid = `${path}//${name}//${file.size}`; /* eslint-disable-line */
  const blockSize = IPFS.getBlockSize(file);
  // encode file, this step can take a long time
  // so make sure to inform user it's in progress
  const fragments = await IPFS.encode(file);
  Transmission.addUploadTask(file, blockSize);
  // start upload
  // we don't wait for the upload procedure, return immediately
  upload(file, path, name, blockSize, fragments);
  return true;
}

async function download(file) {
  file.fid = `${file.path}//${file.name}//${file.size}`; /* eslint-disable-line */
  const blockSize = IPFS.getBlockSize(file);
  Transmission.addDownloadTask(file, blockSize);
  let r = null;
  try {
    r = await IPFS.download(file);
  } catch (error) {
    throw error;
  }
  if (typeof r === 'string') {
    throw new Error(r);
  }
  Transmission.fileComplete('download', file.fid);
  FileDownload(r, file.name);
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
  data.append('limit', config.limit);
  data.append('offset', config.offset);
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
  if (config.all) {
    data.append('all', config.all);
  }
  if (config.inbox) {
    data.append('inbox', config.inbox);
  }
  if (config.mark) {
    data.append('mark', config.mark);
  }
  if (config.other) {
    data.append('other', config.other);
  }
  if (config.trash) {
    data.append('trash', config.trash);
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
