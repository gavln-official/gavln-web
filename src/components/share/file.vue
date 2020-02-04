<template>
  <div class="share-file">
    <div class="header">
      <el-button
          @click="save">
        <i class="iconfont icon-save"></i>
        <span>{{ $t('open-share.save') }}</span>
      </el-button>
      <el-button
          @click="download">
        <i class="iconfont icon-download"></i>
        <span>{{ $t('download') }}({{ data.size | filesize }})</span>
      </el-button>
    </div>
    <div class="content">
      <div class="file">
        <i class="iconfont icon-files"></i>
        <span>{{ data.name }}</span>
      </div>
      <div class="info">{{ $t('file-size') }}: {{ data.size | filesize }}</div>
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

import Storage from '../../utils/storage';

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
      const hasLogin = Storage.getToken();

      if (hasLogin) {
        this.showFolderDialog = true;
      } else {
        this.$message.error('请先登录');

        this.$router.replace({
          name: 'login',
          query: {
            redirect: window.location.pathname,
          },
        });
      }
    },
    folderDialogClose() {
      this.showFolderDialog = false;
    },
    folderDialogSuccess() {
      this.showFolderDialog = false;

      this.$message.success(this.$t('open-share.save-success'));
    },
    download() {
      FileAPI.download(this.data);
      this.$message.info('开始下载');
      this.$router.push('/download');
    },
  },
};
</script>

<style
    src="./file.scss"
    lang="scss"
    scoped></style>
