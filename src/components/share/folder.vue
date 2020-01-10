<template>
  <div
      class="share-folder"
      ref="container">
    <div class="header">
      <el-button
          @click="save()">
        <i class="iconfont icon-file-copy"></i>
        <span>保存到网盘</span>
      </el-button>
    </div>
    <div class="content">
      <bread-crumb
          :path="path"
          :rootPath="data && data.path"
          @switch="switchPath" />
      <el-table
          class="file-table"
          :data="list"
          :height="tableHeight">
        <el-table-column
            prop="type"
            width="64">
          <template>
            <i class="iconfont icon-folder-add"></i>
          </template>
        </el-table-column>
        <el-table-column
            label="文件名称">
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
            label="文件大小"
            width="100">
          <template
              slot-scope="scope">
            <span>{{ scope.row.size | filesize }}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="修改时间"
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
import FileDownload from 'js-file-download';

import FileAPI from '../../api/file';

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
      tableHeight: null,
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
    window.addEventListener('resize', this.calcTableHeight);

    this.calcTableHeight();

    if (this.data
        && this.data.path) {
      this.path = this.data.path;
      this.getPath();
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calcTableHeight);
  },
  methods: {
    calcTableHeight() {
      const {
        height,
      } = this.$refs.container.getBoundingClientRect();

      this.tableHeight = height - 143;
    },
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

      this.showFolderDialog = true;
    },
    folderDialogClose() {
      this.showFolderDialog = false;
    },
    folderDialogSuccess() {
      this.showFolderDialog = false;

      this.$message.success('已保存至我的网盘');
    },
    download(target) {
      FileAPI.download(target)
        .then((res) => {
          FileDownload(res, target.name);
        });
    },
  },
};
</script>

<style
    src="./folder.scss"
    lang="scss"
    scoped></style>
