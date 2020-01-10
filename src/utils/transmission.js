import storage from './local-storage';

function getListKey(type) {
  return `transmission-${type}-list`;
}

export default {
  addFile(type, file, blockSize) {
    const list = this.readList(type);
    const fid = file.fid;
    if (list.some(i => i.fid === fid)) {
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

  fileComplete(type, fid) {
    const evt = new CustomEvent(`${type}-complete`, {
      detail: {
        fid,
      },
    });
    document.dispatchEvent(evt);
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
