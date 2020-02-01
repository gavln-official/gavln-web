<!-- eslint-disable -->
<template>
  <div class="file-list finished-list">
    <div class="toolbar">
      <el-button @click="deleteAll">
        <i class="iconfont icon-trash"></i>
        <span>{{ $t('finished-list.clear-records') }}</span>
      </el-button>
    </div>
    <el-table
        class="file-table finished-table"
        :data="data">
      <el-table-column
          type="selection"
          width="64"></el-table-column>
      <el-table-column
          prop="type"
          :label="$t('check-all')"
          width="100">
        <i class="iconfont icon-files"></i>
      </el-table-column>
      <el-table-column
          :label="$t('file-name')">
        <template
            slot-scope="scope">
          <span>{{ scope.row.name }}</span>
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
          :label="$t('status')"
          width="230">
        <template
            slot-scope="scope">
          <span>{{ scope.row.type === 'download' ? $t('download') : $t('upload') }}{{ $t('finished-list.finished-at') }}
            {{ scope.row.utime | time('yyyy/MM/dd HH:mm') }}</span>
        </template>
      </el-table-column>
      <el-table-column
          width="70">
        <template
            slot-scope="scope">
          <div @click="deleteRow(scope.row)">
            <i class="iconfont icon-trash"></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<!-- eslint-enable -->

<script>
export default {
  name: 'FinishedList',
  props: {
    data: Array,
  },
  data() {
    return {
    };
  },
  methods: {
    deleteRow(row) {
      this.$emit('deleteRow', row);
    },
    deleteAll() {
      this.$emit('deleteAll');
    },
  },
};
</script>

<style
    src="../file-list/index.scss"
    lang="scss"
    scoped></style>
