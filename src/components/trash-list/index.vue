<template>
  <div class="file-list trash-list">
    <div class="toolbar">
      <el-button :disabled="!data.length" @click="clear">
        <i class="iconfont icon-trash"></i>
        <span>{{ $t('trash-list.clear') }}</span>
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
          :label="$t('check-all')"
          width="100">
        <template
            slot-scope="scope">
          <i
              v-if="scope.row.file.dir"
              class="iconfont icon-folder"></i>
          <i
              v-else
              class="iconfont icon-files"></i>
        </template>
      </el-table-column>
      <el-table-column
          :label="$t('file')">
        <template
            slot-scope="scope">
          <span>{{ scope.row.file.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
          :label="$t('delete-time')"
          width="160">
        <template
            slot-scope="scope">
          <span>{{ scope.row.file.time | time('yyyy/MM/dd HH:mm') }}</span>
        </template>
      </el-table-column>
      <el-table-column
          :label="$t('file-size')"
          width="100">
        <template
            slot-scope="scope">
          <span>{{ scope.row.file.size | filesize }}</span>
        </template>
      </el-table-column>
      <el-table-column
          :label="$t('valid-time')"
          width="120">
        <template
            slot-scope="scope">
          <span>{{ scope.row.expires | timeDistance }}</span>
        </template>
      </el-table-column>
    </el-table>
    <vue-context
        ref="menu">
      <li @click="restore">{{ $t('restore') }}</li>
      <li @click="doRemove">{{ $t('delete-permanently') }}</li>
    </vue-context>
  </div>
</template>

<script>
import {
  VueContext,
} from 'vue-context';

import i18n from '../../i18n';

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
        return `${Math.floor(day)} ${i18n.t('days')}`;
      }
      const hours = distance / 3600;
      if (hours > 1) {
        return `${Math.floor(hours)} ${i18n.t('hours')}`;
      }
      const mins = distance / 60;
      if (mins > 0) {
        return `${Math.floor(mins)} ${i18n.t('minutes')}`;
      }
      return i18n.t('expired');
    },
  },
};
</script>

<style
    src="../file-list/index.scss"
    lang="scss"
    scoped></style>
