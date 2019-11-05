<template>
  <main-frame>
    <div class="page-upload page-download">
      <upload-list
          :data="data" />
    </div>
  </main-frame>
</template>

<script>
import Mock from '../api/mock';

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
      data: Mock.uploads,
    };
  },
};
</script>

<style
    src="./upload/index.scss"
    lang="scss"
    scoped></style>
