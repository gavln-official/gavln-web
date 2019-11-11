<template>
  <div class="file-list share-list">
    <div class="toolbar">
      <el-button>
        <i class="iconfont icon-trash"></i>
        <span>清空全部记录</span>
      </el-button>
      <el-button>
        <i class="iconfont icon-share"></i>
        <span>取消分享</span>
      </el-button>
    </div>
    <el-table
        class="file-table share-table"
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
          label="分享文件">
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
          label="分享时间"
          width="160">
        <template
            slot-scope="scope">
          <span>{{ scope.row.utime | time('yyyy/MM/dd HH:mm') }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="查看次数"
          width="80">
        <template>
          <span>1次</span>
        </template>
      </el-table-column>
      <el-table-column
          label="下载次数"
          width="80">
        <template>
          <span>1次</span>
        </template>
      </el-table-column>
      <el-table-column
          label="保存次数"
          width="80">
        <template>
          <span>1次</span>
        </template>
      </el-table-column>
      <el-table-column
          label="失效时间"
          width="160">
        <template
            slot-scope="scope">
          <span>{{ scope.row.utime | time('yyyy/MM/dd HH:mm') }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  Button,
  Table,
  TableColumn,
} from 'element-ui';

export default {
  name: 'ShareList',
  components: {
    'el-button': Button,
    'el-table': Table,
    'el-table-column': TableColumn,
  },
  props: {
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
  },
};
</script>

<style
    src="../file-list/index.scss"
    lang="scss"
    scoped></style>
