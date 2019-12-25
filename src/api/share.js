import HTTP from './http';

function getList() {
  return HTTP({
    method: 'GET',
    url: '/share/myShare',
  });
}

function cancelShare(rand) {
  const data = new FormData();
  data.append('rand', rand);

  return HTTP({
    method: 'POST',
    url: '/share/unShare',
    data,
  });
}

export default {
  getList,
  cancelShare,
};
