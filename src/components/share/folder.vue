<template>
  <div
      class="share-folder"
      ref="container">
    <div class="header">
      <el-button
          @click="save()">
        <i class="iconfont icon-save"></i>
        <span>{{ $t('open-share.save') }}</span>
      </el-button>
    </div>
    <div class="content">
      <bread-crumb
          :path="path"
          :rootPath="data && data.path"
          @switch="switchPath" />
      <el-table
          class="file-table"
          :data="list">
        <el-table-column
            prop="type"
            width="64">
          <template
              slot-scope="scope">
            <i
                v-if="scope.row.dir"
                class="iconfont icon-folder"></i>
            <i
                v-else
                class="iconfont icon-files"></i>
          </template>
        </el-table-column>
        <el-table-column
            :label="$t('file-name')">
          <template
              slot-scope="scope">
            <span
                v-if="scope.row.dir"
                class="link"
                @click="switchPath(scope.row.path)">{{ scope.row.name }}</span>
            <span
                v-else>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
            :label="$t('file-size')"
            width="100">
          <template
              slot-scope="scope">
            <span>{{ scope.row.size | filesize }}</span>
          </template>
        </el-table-column>
        <el-table-column
            :label="$t('modify-time')"
            width="160">
          <template
              slot-scope="scope">
            <span>{{ scope.row.time | time('yyyy/MM/dd HH:mm') }}</span>
          </template>
        </el-table-column>
        <el-table-column
            width="110">
          <template
              slot-scope="scope">
            <div class="actions">
              <i
                  class="iconfont icon-file-copy"
                  @click="save(scope.row)"></i>
              <i
                  v-if="!scope.row.dir"
                  class="iconfont icon-download"
                  @click="download(scope.row)"></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <folder-dialog
        v-if="showFolderDialog"
        :visible="showFolderDialog"
        :data="folderData"
        type="save"
        @close="folderDialogClose"
        @success="folderDialogSuccess" />
  </div>
</template>

<script>
import FileAPI from '../../api/file';

import Storage from '../../utils/storage';

import BreadCrumb from '../dialog/folder/bread-crumb.vue';
import FolderDialog from '../dialog/folder/index.vue';

export default {
  name: 'ShareFolder',
  components: {
    BreadCrumb,
    FolderDialog,
  },
  props: {
    data: Object,
  },
  data() {
    return {
      path: '',
      list: [],
      folderData: null,
      showFolderDialog: false,
    };
  },
  watch: {
    data(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.path = newValue.path;
        this.getPath();
      }
    },
  },
  mounted() {
    if (this.data
        && this.data.path) {
      this.path = this.data.path;
      this.getPath();
    }
  },
  methods: {
    switchPath(path) {
      this.path = path.endsWith('/')
        ? path.substring(0, path.length - 1)
        : path;

      this.getPath();
    },
    getPath() {
      this.list = this.getChild(this.path, [this.data]);
    },
    getChild(path, list) {
      for (const item of list) { /* eslint-disable-line */
        if (item.path === path) {
          return item.child;
        }

        if (item.dir
            && item.child) {
          return this.getChild(path, item.child);
        }
      }

      return [];
    },
    getTarget(path, list) {
      for (const item of list) { /* eslint-disable-line */
        if (item.path === path) {
          return item;
        }

        if (item.dir
            && item.child) {
          return this.getTarget(path, item.child);
        }
      }

      return null;
    },
    save(target) {
      const data = target
        || this.getTarget(this.path, [this.data]);

      const {
        rand,
        code,
      } = this.data;

      this.folderData = {
        rand,
        code,
        ...data,
      };

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
    download(target) {
      FileAPI.download(target);
      this.$message.info('开始下载');
      this.$router.push('/download');
    },
  },
};
</script>

<style
    src="./folder.scss"
    lang="scss"
    scoped></style>
