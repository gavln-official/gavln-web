<template>
  <main-frame>
    <div class="page-upload page-download">
      <upload-list
          :data="data"
          type="download"
          @command="onRowCommand"
          @pauseAll="pauseAll"
          @startAll="startAll"
          @deleteRow="deleteRow"
          @deleteAll="deleteAll" />
    </div>
  </main-frame>
</template>

<script>
import Transmission from '../utils/transmission';
import FileAPI from '../api/file';
import MainFrame from '../components/main-frame/index.vue';
import UploadList from '../components/upload-list/index.vue';

export default {
  name: 'Download',
  components: {
    MainFrame,
    UploadList,
  },
  data() {
    return {
      data: null,
    };
  },
  methods: {
    onTransmissionProgress(evt) {
      const d = evt.detail;
      const item = this.data.find(i => i.fid === d.fid);
      if (item.startTime) {
        item.finishedBlocks += 1;
        const now = new Date();
        item.speed = item.blockSize.blockSize * item.finishedBlocks * 1000 / (now - item.startTime);
        item.percentage = d.progress.percentage;
        if (item.percentage >= 100) {
          item.usize = item.size;
        } else {
          item.usize += item.blockSize.blockSize;
        }
      } else {
        item.startTime = new Date();
        item.paused = false;
        item.usize = d.progress.finishedBlocks * item.blockSize.blockSize;
        item.percentage = d.progress.percentage;
        item.finishedBlocks = 0;
        item.status = 'TRANSMITING';
      }
      if (item.paused) {
        item.speed = 0;
        item.usize = 0;
        item.percentage = 0;
        item.status = 'PAUSED';
      }
    },
    initTransmissionListeners() {
      document.addEventListener('download-start', this.getList);
      document.addEventListener('download-complete', this.getList);
      document.addEventListener('block-download-complete', this.onTransmissionProgress);
    },
    removeTransmissionListeners() {
      document.removeEventListener('download-start', this.getList);
      document.removeEventListener('download-complete', this.getList);
      document.removeEventListener('block-download-complete', this.onTransmissionProgress);
    },
    getList() {
      const list = Transmission.readList('download');
      this.data = list.map((item) => {  /* eslint-disable-line */
        return {
          ...item,
          paused: true,
          speed: 0,
          usize: 0,
          percentage: 0,
          status: 'STANDBY',
        };
      });
    },
    onRowCommand(_command) {
      const command = _command.command;
      const row = _command.row;
      const fid = row.fid;
      switch (command) {
        case 'start':
          const data = Transmission.getFile('download', fid); /* eslint-disable-line */
          FileAPI.download(data.originalFile);
          break;
        case 'pause':
          this.pauseFile(row);
          break;
        default:
      }
    },
    deleteRow(row) {
      Transmission.deleteFile('download', row.fid);
      this.getList();
    },
    pauseFile(file) {
      Transmission.pauseFile('download', file.fid);
      /* eslint-disable */
      file.paused = true;
      file.speed = 0;
      file.percentage = 0;
      /* eslint-enable */
    },
    pauseAll() {
      this.data.forEach(this.pauseFile);
    },
    startAll() {
      this.data.forEach((file) => {
        const data = Transmission.getFile('download', file.fid);
        FileAPI.download(data.originalFile);
      });
      this.getList();
    },
    deleteAll() {
      this.data.forEach(this.deleteRow);
    },
  },
  mounted() {
    this.initTransmissionListeners();
    this.getList();
  },
  beforeDestroy() {
    this.removeTransmissionListeners();
  },
};
</script>

<style
    src="./upload/index.scss"
    lang="scss"
    scoped></style>
