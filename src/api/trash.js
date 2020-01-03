import HTTP from './http';

export default {
  getList() {
    return HTTP({
      method: 'GET',
      url: '/file/trash',
    });
  },

  restore(id, path) {
    const data = new FormData();
    data.append('path', path);
    data.append('trashId', id);

    return HTTP({
      method: 'POST',
      url: '/file/reStore',
      data,
    });
  },

  delete(id, path) {
    const data = new FormData();
    data.append('path', path);
    data.append('trashId', id);

    return HTTP({
      method: 'POST',
      url: '/file/empty',
      data,
    });
  },

  clear() {
    return HTTP({
      method: 'POST',
      url: '/file/emptyAll',
    });
  },
};
