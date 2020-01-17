<template>
  <main-frame>
    <div class="page-upload">
      <upload-list
          :data="data"
          :status="status"
          @deleteRow="deleteRow"
          @pauseAll="pauseAll" />
    </div>
  </main-frame>
</template>

<script>
import Transmission from '../../utils/transmission';
import MainFrame from '../../components/main-frame/index.vue';
import UploadList from '../../components/upload-list/index.vue';

export default {
  name: 'Upload',
  components: {
    MainFrame,
    UploadList,
  },
  data() {
    return {
      data: null,
      status: {
        speed: 0,
        percentage: 0,
        usize: 0,
        size: 0,
      },
      transmissionStartTime: null,
    };
  },
  methods: {
    getUploadList() {
      const list = Transmission.readList('upload');
      this.data = list.map((item) => {  /* eslint-disable-line */
        return {
          speed: 0,
          percentage: Math.min((item.usize / item.size), 1) * 100,
          ...item,
        };
      });
    },
    overallProgress(deltaSize) {
      const s = this.status;
      s.usize += deltaSize;
      if (s.usize > s.size) {
        s.usize = s.size;
      }
      s.percentage = Number((s.usize / s.size * 100).toFixed(1));
      s.speed = this.data.reduce((accumulateSpeed, file) => { /* eslint-disable-line */
        return accumulateSpeed + file.speed;
      }, 0);
    },
    onTransmissionProgress(evt) {
      const d = evt.detail;
      const item = this.data.find(i => i.fid === d.fid);
      if (item.startTime) {
        item.finishedBlocks += 1;
        const now = new Date();
        item.speed = item.blockSize * item.finishedBlocks * 1000 / (now - item.startTime);
        item.percentage = d.progress.percentage;
        if (d.progress.percentage >= 100) {
          item.usize = item.size;
        } else {
          item.usize += item.blockSize;
        }
      } else {
        item.startTime = new Date();
        item.finishedBlocks = 0;
        item.blockSize = d.progress.blockSize;
        this.status.usize += item.usize;
        this.status.size += item.size;
      }
      if (item.paused) {
        item.speed = 0;
      }
      this.overallProgress(item.blockSize);
    },
    initTransmissionListeners() {
      document.addEventListener('upload-start', this.getUploadList);
      document.addEventListener('upload-complete', this.getUploadList);
      document.addEventListener('block-upload-complete', this.onTransmissionProgress);
    },
    removeTransmissionListeners() {
      document.removeEventListener('upload-start', this.getUploadList);
      document.removeEventListener('upload-complete', this.getUploadList);
      document.removeEventListener('block-upload-complete', this.onTransmissionProgress);
    },
    deleteRow(row) {
      Transmission.removeFile('upload', row.fid);
      this.getUploadList();
    },
    pauseAll() {
      this.data.forEach((file) => {
        file.paused = true; /* eslint-disable-line */
        Transmission.pasueFile('upload', file.fid);
      });
    },
  },
  mounted() {
    this.initTransmissionListeners();
    this.getUploadList();
  },
  beforeDestroy() {
    this.removeTransmissionListeners();
  },
};
</script>

<style
    src="./index.scss"
    lang="scss"
    scoped></style>
