<template>
  <main-frame>
    <div class="page-upload">
      <upload-list
          :data="data" />
    </div>
  </main-frame>
</template>

<script>
import Mock from '../../api/mock';

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
      data: Mock.uploads,
    };
  },
};
</script>

<style
    src="./index.scss"
    lang="scss"
    scoped></style>
