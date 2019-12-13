import HTTP from './http';

function add(path) {
  const data = new FormData();
  data.append('path', path);

  return HTTP({
    method: 'POST',
    url: '/mark/add',
    data,
  });
}

function remove(path) {
  const data = new FormData();
  data.append('path', path);

  return HTTP({
    method: 'POST',
    url: '/mark/del',
    data,
  });
}

export default {
  add,
  remove,
};
