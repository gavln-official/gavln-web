<template>
  <div class="file-list trash-list">
    <div class="toolbar">
      <el-button :disabled="!data.length" @click="clear">
        <i class="iconfont icon-trash"></i>
        <span>清空回收站</span>
      </el-button>
      <div class="right">
        <search-input
            :source="['trash']" />
      </div>
    </div>
    <el-table
        class="file-table trash-table"
        :data="data"
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
          label="分享文件">
        <template
            slot-scope="scope">
          <span>{{ scope.row.file.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="删除时间"
          width="160">
        <template
            slot-scope="scope">
          <span>{{ scope.row.file.time | time('yyyy/MM/dd HH:mm') }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="文件大小"
          width="100">
        <template
            slot-scope="scope">
          <span>{{ scope.row.file.size | filesize }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="有效时间"
          width="90">
        <template
            slot-scope="scope">
          <span>{{ scope.row.expires | timeDistance }}</span>
        </template>
      </el-table-column>
    </el-table>
    <vue-context
        ref="menu">
      <li @click="restore">还原</li>
      <li @click="doRemove">彻底删除</li>
    </vue-context>
  </div>
</template>

<script>
import {
  VueContext,
} from 'vue-context';

import SearchInput from '../search-input/index.vue';

export default {
  name: 'TrashList',
  components: {
    VueContext,
    SearchInput,
  },
  props: {
    data: Array,
  },
  data() {
    return {
      contextRow: null,
    };
  },
  methods: {
    showContextMenu(row, column, event) {
      if (event) {
        event.preventDefault();
      }
      this.$refs.menu.open(event);
      this.contextRow = row;
      return [row, column];
    },
    restore() {
      this.$emit('restore', this.contextRow);
    },
    doRemove() {
      this.$emit('delete', this.contextRow);
    },
    clear() {
      this.$emit('clear');
    },
  },
  filters: {
    timeDistance(expireDate) {
      const expire = new Date(expireDate * 1000);
      const now = new Date();
      const distance = (expire - now) / 1000;
      const day = distance / 3600 / 24;
      if (day > 1) {
        return `${Math.floor(day)}天`;
      }
      const hours = distance / 3600;
      if (hours > 1) {
        return `${Math.floor(hours)}小时`;
      }
      const mins = distance / 60;
      if (mins > 0) {
        return `${Math.floor(mins)}分钟`;
      }
      return '已失效';
    },
  },
};
</script>

<style
    src="../file-list/index.scss"
    lang="scss"
    scoped></style>
