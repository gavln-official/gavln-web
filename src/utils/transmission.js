import storage from './local-storage';

function getListKey(type) {
  return `transmission-${type}-list`;
}

export default {
  readList(type) {
    const LIST_KEY = getListKey(type);
    return storage.get(LIST_KEY) || [];
  },

  updateList(type, list) {
    const LIST_KEY = getListKey(type);
    storage.set(LIST_KEY, list);
  },

  getFile(type, fid) {
    const list = this.readList(type);
    const file = list.find(f => f.fid === fid);
    return file;
  },

  addUploadTask(file, blockSize) {
    const list = this.readList('upload');
    const fid = file.fid;
    const existed = list.find(f => f.fid === fid);
    if (existed) {
      existed.paused = false;
      this.updateList('upload', list);
      return false;
    }
    list.push({
      type: 'upload',
      fid,
      name: file.name,
      usize: 0,
      size: file.size,
      blockSize,
      blockList: [],
    });
    this.updateList('upload', list);
    const evt = new CustomEvent('upload-start', {
      detail: {
        file,
      },
    });
    document.dispatchEvent(evt);
    return true;
  },

  blockUploadCompleted(fid, block) {
    const list = this.readList('upload');
    const data = list.find(f => f.fid === fid);
    data.usize += data.blockSize.blockSize;
    data.blockList.push(block);
    this.updateList('upload', list);
    const progress = {
      finishedBlocks: data.blockList.length,
      totalBlocks: data.blockSize.totalBlocks,
      percentage: Number((data.blockList.length / data.blockSize.totalBlocks).toFixed(2)) * 100,
      blockSize: data.blockSize.blockSize,
    };
    const evt = new CustomEvent('block-upload-complete', {
      detail: {
        fid,
        block,
        progress,
      },
    });
    document.dispatchEvent(evt);
    return progress;
  },

  getUploadProgress(fid) {
    const file = this.getFile('upload', fid);
    return {
      finishedBlocks: file.blockList,
      totalBlocks: file.blockSize.totalBlocks,
      remainingBlocks: file.blockSize.totalBlocks - file.blockList.length,
    };
  },

  addDownloadTask(file, blockSize) {
    const list = this.readList('download');
    const fid = file.fid;
    const existed = list.find(f => f.fid === fid);
    if (existed) {
      existed.finishedBlocks = 0;
      existed.paused = false;
      this.updateList('download', list);
      return false;
    }
    list.push({
      type: 'download',
      fid,
      name: file.name,
      size: file.size,
      blockSize,
      blockList: file.blocks,
      finishedBlocks: 0,
      originalFile: file,
    });
    this.updateList('download', list);
    const evt = new CustomEvent('download-start', {
      detail: {
        file,
      },
    });
    document.dispatchEvent(evt);
    return true;
  },

  blockDownloadComplete(fid) {
    const list = this.readList('download');
    const data = list.find(f => f.fid === fid);
    data.finishedBlocks += 1;
    this.updateList('download', list);
    const progress = this.getDownloadProgress(fid);
    const evt = new CustomEvent('block-download-complete', {
      detail: {
        fid,
        progress,
      },
    });
    document.dispatchEvent(evt);
  },

  getDownloadProgress(fid) {
    const data = this.getFile('download', fid);
    return {
      finishedBlocks: data.finishedBlocks,
      totalBlocks: data.blockSize.totalBlocks,
      percentage: Number((data.finishedBlocks / data.blockSize.totalBlocks).toFixed(2)) * 100,
      blockSize: data.blockSize.blockSize,
    };
  },

  pauseFile(type, fid) {
    const list = this.readList(type);
    const file = list.find(f => f.fid === fid);
    file.paused = true;
    this.updateList(type, list);
  },

  fileComplete(type, fid) {
    const finishedFile = this.deleteFile(type, fid)[0];
    finishedFile.utime = (new Date()).getTime();
    const completedList = this.readList('completed');
    completedList.push(finishedFile);
    this.updateList('completed', completedList);
    const evt = new CustomEvent(`${type}-complete`, {
      detail: {
        fid,
      },
    });
    document.dispatchEvent(evt);
  },

  deleteFile(type, fid) {
    this.pauseFile(type, fid);
    const list = this.readList(type);
    const index = list.findIndex(f => f.fid === fid);
    const deletedFile = list.splice(index, 1);
    this.updateList(type, list);
    return deletedFile;
  },
};
