<template>
  <div class="file-list finished-list">
    <div class="toolbar">
      <el-button>
        <i class="iconfont icon-trash"></i>
        <span>清空全部记录</span>
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
          label="状态"
          width="200">
        <template
            slot-scope="scope">
          <span>下载完成 {{ scope.row.utime | time('yyyy/MM/dd HH:mm') }}</span>
        </template>
      </el-table-column>
      <el-table-column
          width="70">
        <template>
          <div>
            <i class="iconfont icon-trash"></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

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
};
</script>

<style
    src="../file-list/index.scss"
    lang="scss"
    scoped></style>
