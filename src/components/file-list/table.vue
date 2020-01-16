<!-- eslint-disable -->
<template>
  <div>
    <el-table
        class="file-table"
        :data="data"
        :height="tableHeight"
        @row-contextmenu="showContextMenu">
      <el-table-column
          prop="type"
          width="70">
        <template>
          <i class="iconfont icon-folder-add"></i>
        </template>
      </el-table-column>
      <el-table-column
          :label="$t('file-name')"
          sortable
          :sort-method="sortByName">
        <template
            slot-scope="scope">
          <i
              v-if="scope.row.mark"
              class="iconfont icon-star-o"></i>
          <a
              v-if="type !== 'favorite' && scope.row.dir"
              :href="`/?path=${scope.row.path}`">{{ scope.row.name }}</a>
          <span
              v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
          :label="$t('file-size')"
          sortable
          width="100"
          :sort-method="sortBySize">
        <template
            slot-scope="scope">
          <span>{{ scope.row.size | filesize }}</span>
        </template>
      </el-table-column>
      <el-table-column
          :label="$t('modify-time')"
          sortable
          width="160"
          :sort-method="sortByTime">
        <template
            slot-scope="scope">
          <span>{{ scope.row.time | time('yyyy/MM/dd HH:mm') }}</span>
        </template>
      </el-table-column>
      <el-table-column
          width="140">
        <template
            slot-scope="scope">
          <div class="actions">
            <i
                class="iconfont icon-share"
                @click="rowCommand('share', scope.row)"></i>
            <i
                v-if="!scope.row.dir"
                class="iconfont icon-download"
                @click="rowCommand('download', scope.row)"></i>
            <el-dropdown
                placement="bottom"
                @command="rowCommand($event, scope.row)">
              <i class="iconfont icon-menu-circle el-dropdown-link"></i>
              <el-dropdown-menu
                  slot="dropdown">
                <el-dropdown-item
                    command="move">{{ $t('move-to') }}</el-dropdown-item>
                <el-dropdown-item
                    command="copy">{{ $t('copy-to') }}</el-dropdown-item>
                <el-dropdown-item
                    command="rename">{{ $t('rename') }}</el-dropdown-item>
                <el-dropdown-item
                    command="favorite">{{ scope.row.mark ? $t('remove-from-fav') : $t('add-to-fav') }}</el-dropdown-item>
                <el-dropdown-item
                    v-if="type === 'home'"
                    command="delete">{{ $t('delete') }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <vue-context
        ref="menu">
      <template v-if="type === 'home'">
        <li
            v-if="contextRow.dir"
            @click="goPath">{{ $t('open') }}</li>
        <li
            v-else
            @click="rowCommand('download')">{{ $t('download') }}</li>
        <li
            @click="rowCommand('share')">{{ $t('share') }}</li>
      </template>
      <li
          @click="rowCommand('move')">{{ $t('move-to') }}</li>
      <li
          @click="rowCommand('copy')">{{ $t('copy-to') }}</li>
      <li
          @click="rowCommand('rename')">{{ $t('rename') }}</li>
      <li
          @click="rowCommand('favorite')">{{ contextRow.mark ? $t('remove-from-fav') : $t('add-to-fav') }}</li>
      <li
          v-if="type === 'home'"
          @click="rowCommand('delete')">{{ $t('delete') }}</li>
    </vue-context>
  </div>
</template>
<!-- eslint-enable -->

<script>
import {
  VueContext,
} from 'vue-context';

export default {
  name: 'FileTable',
  components: {
    VueContext,
  },
  props: {
    data: Array,
    type: {
      type: String,
      default: 'home',
    },
  },
  data() {
    return {
      contextRow: {},
      tableHeight: null,
    };
  },
  methods: {
    sortByName(a, b) {
      return a.name
        .localeCompare(b.name);
    },
    sortBySize(a, b) {
      return a.size - b.size;
    },
    sortByTime(a, b) {
      return new Date(a.time) - new Date(b.time);
    },
    showContextMenu(row, col, event) {
      if (event) {
        event.preventDefault();
      }
      this.$refs.menu.open(event);
      this.contextRow = row;
    },
    goPath() {
      const { path } = this.contextRow;
      this.$router.push(`/?path=${path}`);
    },
    rowCommand(command, _row) {
      const row = _row || this.contextRow;
      this.$emit('command', {
        command,
        row,
      });
    },
  },
};
</script>
