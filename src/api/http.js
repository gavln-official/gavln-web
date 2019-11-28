import Axios from 'axios';

import {
  Message,
} from 'element-ui';

import Config from '../utils/config';
import Storage from '../utils/storage';

const HTTP = Axios.create({
  baseURL: Config.baseURL,
  timeout: Config.timeout,
});

// request
HTTP.interceptors.request
  .use((req) => {
    // auth headers
    const token = Storage.getToken();
    if (token) {
      req.headers.Authorization = token; /* eslint-disable-line */
    }

    return req;
  },
  error => Promise.reject(error));

// response
HTTP.interceptors.response
  .use(res => res.data,
    (error) => {
      const code = error
          && error.response
          && error.response.status;
      let errorMsg = '';
      switch (code) {
        case 401:
          Storage.remove('userId');
          Storage.remove('token');

          window.location.href = `/login?redirect=${window.location.pathname}`;

          return;
        case 404:
          errorMsg = '请求的地址不存在';
          break;
        case 500:
          errorMsg = '服务器出错了';
          break;
        default:
          errorMsg = '出错了';
      }

      Message.error(errorMsg);

      return Promise.reject(error); /* eslint-disable-line */
    });

export default HTTP;
