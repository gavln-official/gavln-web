<template>
  <main-frame>
    <div class="page-upload">
      <ui-empty
          v-if="!data
              || !data.length">
        <p>暂无正在上传的文件或文件夹。</p>
      </ui-empty>
      <upload-list
          v-else
          :data="data"
          :status="status"
          type="upload"
          @command="onRowCommand"
          @pauseAll="pauseAll"
          @deleteRow="deleteRow"
          @deleteAll="deleteAll" />
    </div>
  </main-frame>
</template>

<script>
import Transmission from '../../utils/transmission';
import MainFrame from '../../components/main-frame/index.vue';
import UiEmpty from '../../components/ui-empty/index.vue';
import UploadList from '../../components/upload-list/index.vue';

export default {
  name: 'Upload',
  components: {
    MainFrame,
    UiEmpty,
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
        const percentage = Math.min((item.usize / item.size), 1) * 100;
        return {
          speed: 0,
          percentage,
          status: percentage > 0 ? 'NEED-RESUME' : 'STANDBY',
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
        item.status = 'TRANSMITING';
      }
      if (item.paused) {
        item.speed = 0;
        item.status = 'PAUSED';
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
      Transmission.deleteFile('upload', row.fid);
      this.getUploadList();
    },
    deleteAll() {
      this.data.forEach(this.deleteRow);
    },
    onRowCommand(_command) {
      const command = _command.command;
      const row = _command.row;
      switch (command) {
        case 'pause':
          this.pauseFile(row);
          break;
        default:
      }
    },
    pauseFile(file) {
      file.paused = true; /* eslint-disable-line */
      Transmission.pauseFile('upload', file.fid);
    },
    pauseAll() {
      this.data.forEach(this.pauseFile);
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
