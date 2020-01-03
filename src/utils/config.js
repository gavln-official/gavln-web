export default {
  // API host
  baseURL: process.env.NODE_ENV === 'development'
    ? '/api/1'
    : 'http://dev.gavln.com/api/1',
  // request timeout: 20s
  timeout: 20 * 1000,
};
