<template>
  <el-dialog
      class="folder-dialog"
      :visible.sync="visible"
      width="640">
    <div class="header">
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
      <h3>{{ title || defaultTitle }}</h3>
    </div>
    <el-table
        class="file-table dialog-table"
        :data="data"
        :height="400">
      <el-table-column
          prop="type"
          label="文件名"
          width="68">
        <template>
          <i class="iconfont icon-folder-add"></i>
        </template>
      </el-table-column>
      <el-table-column>
        <template
            slot-scope="scope">
          <a
              :href="`/?path=${scope.row.id}`">{{ scope.row.name }}</a>
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
    <div
        slot="footer">
      <el-button
          class="left">新建文件夹</el-button>
      <el-button>取消</el-button>
      <el-button>{{ type === 'move' ? '移动' : '复制' }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  Dialog,
  ButtonGroup,
  Table,
  TableColumn,
  Button,
} from 'element-ui';

import Mock from '../../../api/mock';

export default {
  name: 'FolderDialog',
  components: {
    'el-dialog': Dialog,
    'el-button-group': ButtonGroup,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-button': Button,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      default: 'move',
    },
    title: String,
  },
  data() {
    return {
      data: Mock.files,
    };
  },
  computed: {
    defaultTitle() {
      return this.type === 'move'
        ? '移动文件'
        : '复制文件';
    },
  },
};
</script>
