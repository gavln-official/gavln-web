<template>
  <div
      class="share-folder"
      ref="container">
    <div class="header">
      <el-button
          @click="toggleFolderDialog">
        <i class="iconfont icon-download"></i>
        <span>保存到网盘</span>
      </el-button>
      <el-button>
        <i class="iconfont icon-download"></i>
        <span>下载</span>
      </el-button>
    </div>
    <div class="content">
      <el-button-group>
        <el-button
            type="text">
          <i class="iconfont icon-arrow-l-left"></i>
        </el-button>
        <el-button
            type="text">
          <i class="iconfont icon-arrow-l-right"></i>
        </el-button>
      </el-button-group>
      <div class="name">
        <i class="iconfont icon-folder-add"></i>
        <span>{{ data.name }}</span>
      </div>
      <el-table
          class="file-table"
          :data="data.content"
          :height="tableHeight">
        <el-table-column
            type="selection"
            width="64"></el-table-column>
        <el-table-column
            prop="type"
            label="全选"
            width="48">
          <template>
            <i class="iconfont icon-folder-add"></i>
          </template>
        </el-table-column>
        <el-table-column
            label="文件名称">
          <template
              slot-scope="scope">
            <a
                v-if="scope.row.type === 'folder'"
                :href="`/?path=${scope.row.id}`">{{ scope.row.name }}</a>
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
            <span>{{ scope.row.utime | time('yyyy/MM/dd HH:mm') }}</span>
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
import {
  Button,
  ButtonGroup,
  Table,
  TableColumn,
} from 'element-ui';

import FolderDialog from '../dialog/folder/index.vue';

export default {
  name: 'ShareFolder',
  components: {
    'el-button': Button,
    'el-button-group': ButtonGroup,
    'el-table': Table,
    'el-table-column': TableColumn,
    FolderDialog,
  },
  props: {
    data: Object,
  },
  data() {
    return {
      tableHeight: null,
      showFolderDialog: false,
    };
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
