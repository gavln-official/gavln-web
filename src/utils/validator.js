function checkUsername(username) {
  const reg = /^\w{3,32}$/;

  return reg.test(username);
}

function checkPassword(password) {
  const reg = /^\S{6,64}$/;

  return reg.test(password);
}

export default {
  checkUsername,
  checkPassword,
};
