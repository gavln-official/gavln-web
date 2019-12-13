<template>
  <div>
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
          <i
              v-if="scope.row.mark"
              class="iconfont icon-star-o"></i>
          <a
              v-if="scope.row.dir"
              :href="`/?path=${scope.row.path}`">{{ scope.row.name }}</a>
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
          <span>{{ (scope.row.time * 1000) | time('yyyy/MM/dd HH:mm') }}</span>
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
            <i class="iconfont icon-download"></i>
            <el-dropdown
                placement="bottom"
                @command="rowCommand($event, scope.row)">
              <i class="iconfont icon-menu-circle el-dropdown-link"></i>
              <el-dropdown-menu
                  slot="dropdown">
                <el-dropdown-item
                    command="move">移动到</el-dropdown-item>
                <el-dropdown-item
                    command="copy">复制到</el-dropdown-item>
                <el-dropdown-item
                    command="rename">重命名</el-dropdown-item>
                <el-dropdown-item
                    command="favorite">{{ scope.row.mark ? '取消收藏' : '收藏' }}</el-dropdown-item>
                <el-dropdown-item
                    command="delete">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  Table,
  TableColumn,
  Dropdown,
  DropdownMenu,
  DropdownItem,
} from 'element-ui';

export default {
  name: 'FileTable',
  components: {
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-dropdown': Dropdown,
    'el-dropdown-menu': DropdownMenu,
    'el-dropdown-item': DropdownItem,
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
    rowCommand(command, row) {
      this.$emit('command', {
        command,
        row,
      });
    },
  },
};
</script>
