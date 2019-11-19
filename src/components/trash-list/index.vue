<template>
  <div class="file-list trash-list">
    <div class="toolbar">
      <el-button>
        <i class="iconfont icon-trash"></i>
        <span>清空回收站</span>
      </el-button>
    </div>
    <el-table
        class="file-table trash-table"
        :data="data"
        :height="tableHeight"
        @row-contextmenu="showContextMenu">
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
          label="删除时间"
          width="160">
        <template
            slot-scope="scope">
          <span>{{ scope.row.utime | time('yyyy/MM/dd HH:mm') }}</span>
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
          label="有效时间"
          width="90">
        <template>
          <span>2 天</span>
        </template>
      </el-table-column>
    </el-table>
    <vue-context
        ref="menu">
      <li>还原</li>
      <li>彻底删除</li>
    </vue-context>
  </div>
</template>

<script>
import {
  Button,
  Table,
  TableColumn,
} from 'element-ui';
import {
  VueContext,
} from 'vue-context';

export default {
  name: 'UploadList',
  components: {
    'el-button': Button,
    'el-table': Table,
    'el-table-column': TableColumn,
    VueContext,
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
    showContextMenu(row, column, event) {
      if (event) {
        event.preventDefault();
      }

      this.$refs.menu.open(event);

      return [row, column];
    },
  },
};
</script>

<style
    src="../file-list/index.scss"
    lang="scss"
    scoped></style>
