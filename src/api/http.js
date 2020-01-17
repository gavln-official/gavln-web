import Axios from 'axios';

import {
  Message,
} from 'element-ui';

import Config from '../utils/config';
import ErrorMessage from '../utils/error-message';
import Storage from '../utils/storage';

const HTTP = Axios.create({
  baseURL: Config.baseURL,
  timeout: Config.timeout,
});

let refreshing = false;

function autoRefreshToken() {
  if (refreshing) {
    return;
  }

  refreshing = true;

  HTTP({
    method: 'POST',
    url: '/user/refreshToken',
  })
    .then((res) => {
      Storage.set('access_token', res.data.access_token);
      Storage.set('refresh_token', res.data.refresh_token);
      Storage.set('token_expires_at', res.data.expires * 1000);
    })
    .finally(() => {
      refreshing = false;
    });
}

// request
HTTP.interceptors.request
  .use((req) => {
    // auth headers
    const token = Storage.getToken();
    if (token) {
      req.headers.access_token = token; /* eslint-disable-line */
    }

    // refresh token
    const tokenExpiresAt = Storage.get('token_expires_at');
    const now = new Date().getTime();

    if (tokenExpiresAt
        && parseInt(tokenExpiresAt, 10) - now <= 1000 * 60 * 5) {
      const refreshToken = Storage.get('refresh_token');
      req.headers.refresh_token = refreshToken; /* eslint-disable-line */

      autoRefreshToken();
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
      let errorMsg = ErrorMessage.http[error.response.status]
          || '';

      if (code === 401) {
        Storage.clearAuthInfo();

        window.location.href = `/login?redirect=${window.location.pathname}`;

        return;
      }

      if (error
          && error.response
          && error.response.data
          && error.response.data.code) {
        const detail = ErrorMessage.code[error.response.data.code]
            || '';

        if (detail) {
          errorMsg = `${errorMsg}: ${detail}`;
        }
        error.detail = detail; /* eslint-disable-line */
      }

      Message.error(errorMsg);

      return Promise.reject(error); /* eslint-disable-line */
    });

export default HTTP;
