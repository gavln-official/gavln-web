import HTTP from './http';

export default {
  getList() {
    return HTTP({
      method: 'GET',
      url: '/mark/get',
    });
  },
};
