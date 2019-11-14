<template>
  <main-frame>
    <div class="page-home">
      <file-list
          type="home"
          :data="data"></file-list>
    </div>
    <!-- <folder-dialog
        :visible="true"
        title="复制文件"
        type="copy" /> -->
  </main-frame>
</template>

<script>
import Mock from '../../api/mock';

import MainFrame from '../../components/main-frame/index.vue';
import FileList from '../../components/file-list/index.vue';
// import FolderDialog from '../../components/dialog/folder/index.vue';

export default {
  name: 'Home',
  components: {
    MainFrame,
    FileList,
    // FolderDialog,
  },
  data() {
    return {
      data: Mock.files,
    };
  },
};
</script>

<style
    src="./index.scss"
    lang="scss"
    scoped></style>
