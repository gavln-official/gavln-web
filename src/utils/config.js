export default {
  // API host
  baseURL: process.env.NODE_ENV === 'development'
    ? '/api/1'
    : 'http://dev.gavln.com/api/1',
  // request timeout: 10s
  timeout: 10 * 1000,
};
