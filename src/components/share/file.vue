<template>
  <div class="share-file">
    <div class="header">
      <el-button
          @click="save">
        <i class="iconfont icon-download"></i>
        <span>保存到网盘</span>
      </el-button>
      <el-button
          @click="download">
        <i class="iconfont icon-download"></i>
        <span>下载({{ data.size | filesize }})</span>
      </el-button>
    </div>
    <div class="content">
      <div class="file">
        <i class="iconfont icon-folder-add"></i>
        <span>{{ data.name }}</span>
      </div>
      <div class="info">文件大小: {{ data.size | filesize }}</div>
    </div>
    <folder-dialog
        v-if="showFolderDialog"
        :visible="showFolderDialog"
        :data="data"
        type="save"
        @close="folderDialogClose"
        @success="folderDialogSuccess" />
  </div>
</template>

<script>
import FolderDialog from '../dialog/folder/index.vue';

import FileAPI from '../../api/file';

export default {
  name: 'ShareFile',
  components: {
    FolderDialog,
  },
  props: {
    data: Object,
  },
  data() {
    return {
      showFolderDialog: false,
    };
  },
  methods: {
    save() {
      // TODO: check login
      this.showFolderDialog = true;
    },
    folderDialogClose() {
      this.showFolderDialog = false;
    },
    folderDialogSuccess() {
      this.showFolderDialog = false;

      this.$message.success('已保存至我的网盘');
    },
    download() {
      FileAPI.download(this.data);
    },
  },
};
</script>

<style
    src="./file.scss"
    lang="scss"
    scoped></style>
