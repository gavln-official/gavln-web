<template>
  <main-frame>
    <div class="page-upload page-finished">
      <ui-empty
          v-if="!data
              || !data.length">
        <p>暂无传输完成的文件或文件夹。</p>
      </ui-empty>
      <finished-list
          v-else
          :data="data"
          @deleteRow="deleteRow"
          @deleteAll="deleteAll" />
    </div>
  </main-frame>
</template>

<script>
import Transmission from '../utils/transmission';
import MainFrame from '../components/main-frame/index.vue';
import UiEmpty from '../components/ui-empty/index.vue';
import FinishedList from '../components/finished-list/index.vue';

export default {
  name: 'Finished',
  components: {
    MainFrame,
    UiEmpty,
    FinishedList,
  },
  data() {
    return {
      data: null,
    };
  },
  methods: {
    getList() {
      this.data = Transmission.readList('completed');
    },
    deleteRow(row) {
      Transmission.deleteFile('completed', row.fid);
      this.getList();
    },
    deleteAll() {
      Transmission.updateList('completed', []);
      this.data = null;
    },
    initTransmissionListeners() {
      document.addEventListener('upload-complete', this.getList);
      document.addEventListener('download-complete', this.getList);
    },
    removeTransmissionListeners() {
      document.removeEventListener('upload-complete', this.getList);
      document.removeEventListener('download-complete', this.getList);
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
