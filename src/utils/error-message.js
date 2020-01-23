import i18n from '../i18n';

const http = {
  400: i18n.t('http-error.400'),
  401: i18n.t('http-error.401'),
  404: i18n.t('http-error.404'),
  429: i18n.t('http-error.429'),
};

const code = {
  1000: i18n.t('api-code.1000'),
  1001: i18n.t('api-code.1001'),
  '-1000': i18n.t('api-code.-1000'),
  '-1001': i18n.t('api-code.-1001'),
  '-1002': i18n.t('api-code.-1002'),
  '-1003': i18n.t('api-code.-1003'),
  '-1004': i18n.t('api-code.-1004'),
  '-1005': i18n.t('api-code.-1005'),
  '-1006': i18n.t('api-code.-1006'),
  '-1007': i18n.t('api-code.-1007'),
  '-1008': i18n.t('api-code.-1008'),
  '-1009': i18n.t('api-code.-1009'),
  '-1010': i18n.t('api-code.-1010'),
  '-1011': i18n.t('api-code.-1011'),
  '-1012': i18n.t('api-code.-1012'),
  '-1013': i18n.t('api-code.-1013'),
  '-1014': i18n.t('api-code.-1014'),
};

export default {
  http,
  code,
};
