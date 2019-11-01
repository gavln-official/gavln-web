<template>
  <el-table
      class="file-table"
      :data="data">
    <el-table-column
        type="selection"></el-table-column>
    <el-table-column
        fixed
        prop="type"
        label="全选"></el-table-column>
    <el-table-column
        fixed
        prop="name"
        label="文件名称"></el-table-column>
    <el-table-column
        fixed
        prop="size"
        label="文件大小"></el-table-column>
    <el-table-column
        fixed
        prop="utime"
        label="修改时间"></el-table-column>
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
};
</script>
