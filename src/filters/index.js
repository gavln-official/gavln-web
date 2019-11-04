import filesize from './file-size';
import time from './time';

const filters = {
  install(Vue) {
    Vue.filter('filesize', filesize);
    Vue.filter('time', time);
  },
};

export default filters;
