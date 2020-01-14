import storage from './local-storage';

function getListKey(type) {
  return `transmission-${type}-list`;
}

export default {
  addFile(type, file, blockSize) {
    const list = this.readList(type);
    const fid = file.fid;
    const existed = list.find(f => f.fid === fid);
    if (existed) {
      existed.paused = false;
      this.updateList('upload', list);
      return false;
    }
    list.push({
      fid,
      name: file.name,
      usize: 0,
      size: file.size,
      blockSize,
      blockList: [],
    });
    this.updateList(type, list);
    const evt = new CustomEvent(`${type}-start`, {
      detail: {
        file,
      },
    });
    document.dispatchEvent(evt);
    return true;
  },

  getFile(type, fid) {
    const list = this.readList(type);
    const file = list.find(f => f.fid === fid);
    return file;
  },

  getFileProgress(type, fid) {
    const file = this.getFile(type, fid);
    return {
      finishedBlocks: file.blockList,
      totalBlocks: file.blockSize.totalBlocks,
    };
  },

  pasueFile(type, fid) {
    const list = this.readList(type);
    const file = list.find(f => f.fid === fid);
    file.paused = true;
    this.updateList('upload', list);
  },

  fileComplete(type, fid, delay = 0) {
    const evt = new CustomEvent(`${type}-complete`, {
      detail: {
        fid,
      },
    });
    document.dispatchEvent(evt);
    setTimeout(() => {
      this.removeFile('upload', fid);
    }, delay);
  },

  removeFile(type, fid) {
    const list = this.readList(type);
    const index = list.findIndex(f => f.fid === fid);
    list.splice(index, 1);
    this.updateList(type, list);
  },

  addBlock(type, fid, block) {
    const list = this.readList(type);
    const data = list.find(f => f.fid === fid);
    data.usize += data.blockSize.blockSize;
    data.blockList.push(block);
    this.updateList(type, list);
    const progress = {
      finishedBlocks: data.blockList.length,
      totalBlocks: data.blockSize.totalBlocks,
      percentage: Number((data.blockList.length / data.blockSize.totalBlocks).toFixed(2)) * 100,
      blockSize: data.blockSize.blockSize,
    };
    const evt = new CustomEvent(`block-${type}-complete`, {
      detail: {
        fid,
        block,
        progress,
      },
    });
    document.dispatchEvent(evt);
    return progress;
  },

  readList(type) {
    const LIST_KEY = getListKey(type);
    return storage.get(LIST_KEY) || [];
  },

  updateList(type, list) {
    const LIST_KEY = getListKey(type);
    storage.set(LIST_KEY, list);
  },
};
