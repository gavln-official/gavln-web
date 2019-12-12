// TODO: i18n
const http = {
  400: 'Bad Request',
  401: 'Unauthorized',
  404: 'Not Found',
  429: 'Too Many Requests',
};

const code = {
  1000: 'server  error',
  1001: 'server unavailable',
  '-1000': 'invalid account',
  '-1001': 'invalid access token',
  '-1002': 'account exists',
  '-1003': 'file exists',
  '-1004': 'file not exists',
  '-1005': 'target path is file',
  '-1006': 'missing parameter',
  '-1007': 'invalid format',
  '-1008': 'too many requests',
  '-1009': 'invalid code',
  '-1010': 'invalid path',
  '-1011': 'invalid share',
  '-1012': 'account not exists',
  '-1013': 'invalid expires',
  '-1014': 'only support file',
};

export default {
  http,
  code,
};
