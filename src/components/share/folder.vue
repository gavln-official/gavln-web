<template>
  <div
      class="share-folder"
      ref="container">
    <div class="header">
      <el-button
          @click="toggleFolderDialog">
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
            <span>{{ scope.row.time * 1000 | time('yyyy/MM/dd HH:mm') }}</span>
          </template>
        </el-table-column>
        <el-table-column
            width="110">
          <template
              slot-scope="scope">
            <div class="actions">
              <i
                  class="iconfont icon-file-copy"
                  @click="rowCommand('save', scope.row)"></i>
              <i
                  v-if="!scope.row.dir"
                  class="iconfont icon-download"
                  @click="rowCommand('download', scope.row)"></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <folder-dialog
        :visible="showFolderDialog"
        type="save" />
  </div>
</template>

<script>
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
      showFolderDialog: false,
    };
  },
  watch: {
    data(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.path = this.data.path;
        this.getPath();
      }
    },
  },
  mounted() {
    window.addEventListener('resize', this.calcTableHeight);

    this.calcTableHeight();
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
    toggleFolderDialog() {
      this.showFolderDialog = !this.showFolderDialog;
    },
  },
};
</script>

<style
    src="./folder.scss"
    lang="scss"
    scoped></style>
