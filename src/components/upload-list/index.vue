<template>
  <div class="file-list upload-list">
    <div class="toolbar">
      <el-button>
        <i class="iconfont icon-upload"></i>
        <span>全部暂停</span>
      </el-button>
      <el-button>
        <i class="iconfont icon-folder-add"></i>
        <span>全部开始</span>
      </el-button>
      <el-button>
        <i class="iconfont icon-trash"></i>
        <span>全部删除</span>
      </el-button>
      <div class="right">
        <strong>当前进度</strong>
        <el-progress
            :percentage="50"
            :show-text="false" />
        <span>已完成50%</span>
        <strong>，2.11MB/s</strong>
      </div>
    </div>
    <el-table
        class="file-table upload-table"
        :data="data"
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
          width="180">
        <template
            slot-scope="scope">
          <span>{{ scope.row.usize | filesize }}/{{ scope.row.size | filesize }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="状态"
          width="200">
        <template
            slot-scope="scope">
          <el-progress
              :percentage="50"
              :show-text="false" />
          <strong>{{ scope.row.speed | filesize }}/s</strong>
          <span> 剩余 {{ pendingTime(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column
          width="100">
        <template>
          <div>
            <i class="iconfont icon-menu-circle"></i>
            <i class="iconfont icon-trash"></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  Button,
  Progress,
  Table,
  TableColumn,
} from 'element-ui';

import Utils from '../../utils/index';

export default {
  name: 'UploadList',
  components: {
    'el-button': Button,
    'el-progress': Progress,
    'el-table': Table,
    'el-table-column': TableColumn,
  },
  props: {
    // 类型（upload: 全部文件, download: 我的收藏）
    type: {
      validator: (value) => {
        const values = [
          'upload',
          'download',
        ];

        return (values.indexOf(value) >= 0);
      },
    },
    data: Array,
  },
  data() {
    return {
      tableHeight: null,
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
      this.tableHeight = window.innerHeight - 124;
    },
    pendingTime(data) {
      const seconds = (data.size - data.usize) / data.speed;

      return Utils.formatTime(seconds);
    },
  },
};
</script>

<style
    src="../file-list/index.scss"
    lang="scss"
    scoped></style>
