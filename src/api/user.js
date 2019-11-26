import HTTP from './http';

function checkUsername(username) {
  const data = new FormData();
  data.append('name', username);

  return HTTP({
    method: 'POST',
    url: '/user/exists',
    data,
  });
}

export default {
  checkUsername,
};
