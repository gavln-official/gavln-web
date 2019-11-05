<template>
  <el-table
      class="file-table"
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
        label="文件名称"
        sortable
        :sort-method="sortByName">
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
        sortable
        width="100"
        :sort-method="sortBySize">
      <template
          slot-scope="scope">
        <span>{{ scope.row.size | filesize }}</span>
      </template>
    </el-table-column>
    <el-table-column
        label="修改时间"
        sortable
        width="160"
        :sort-method="sortByUtime">
      <template
          slot-scope="scope">
        <span>{{ scope.row.utime | time('yyyy/MM/dd HH:mm') }}</span>
      </template>
    </el-table-column>
    <el-table-column
        width="140">
      <template>
        <div>
          <i class="iconfont icon-share"></i>
          <i class="iconfont icon-download"></i>
          <i class="iconfont icon-menu-circle"></i>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import {
  Table,
  TableColumn,
} from 'element-ui';

export default {
  name: 'FileTable',
  components: {
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
    sortByName(a, b) {
      return a.name
        .localeCompare(b.name);
    },
    sortBySize(a, b) {
      return a.size - b.size;
    },
    sortByUtime(a, b) {
      return new Date(a.utime) - new Date(b.utime);
    },
  },
};
</script>
