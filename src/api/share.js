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

function check(rand) {
  return HTTP({
    method: 'GET',
    url: `/share/check/${rand}`,
  });
}

function getShare(rand, code) {
  const data = new FormData();
  data.append('rand', rand);
  if (code) {
    data.append('code', code);
  }

  return HTTP({
    method: 'POST',
    url: '/share/verify',
    data,
  });
}

export default {
  getList,
  cancelShare,
  check,
  getShare,
};
