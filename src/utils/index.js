import sha512 from 'crypto-js/sha512';

function formatTime(seconds) {
  let value = seconds;

  const values = [];
  if (value >= 3600) {
    values.push((value / 3600).toFixed(0).padStart(2, '0'));
    value %= 3600;
  } else {
    values.push('00');
  }

  if (value >= 60) {
    values.push((value / 60).toFixed(0).padStart(2, '0'));
    value %= 60;
  } else {
    values.push('00');
  }

  values.push(value.toFixed(0).padStart(2, '0'));

  return values.join(':');
}

function copyToClipboard(text) {
  const element = document.createElement('textarea');

  element.value = text;
  document.body.appendChild(element);

  element.select();
  document.execCommand('copy');

  document.body.removeChild(element);
}

function encodePassword(password) {
  return sha512(`${sha512(password)}gavln.com`);
}

function parseFileName(name) {
  const data = {
    name: '',
    ext: '',
  };
  const index = name.lastIndexOf('.');
  if (index >= 0) {
    data.name = name.substring(0, index).trim();
    data.ext = name.substring(index + 1).trim();
  } else {
    data.name = name;
  }

  return data;
}

function randomCode(length = 4) {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

function getLocale() {
  const lang = window.navigator.language;

  if (/^zh-/.test(lang)) {
    return 'cn';
  }

  return 'en';
}

export default {
  formatTime,
  copyToClipboard,
  encodePassword,
  parseFileName,
  randomCode,
  getLocale,
};
