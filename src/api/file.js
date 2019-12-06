import HTTP from './http';

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

export default {
  getPath,
  createPath,
  updatePath,
};
