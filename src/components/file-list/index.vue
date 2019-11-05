<template>
  <div class="file-list">
    <div class="toolbar">
      <template
          v-if="type === 'home'">
        <el-button>
          <i class="iconfont icon-upload"></i>
          <span>上传</span>
        </el-button>
        <el-button>
          <i class="iconfont icon-folder-add"></i>
          <span>新建文件夹</span>
        </el-button>
      </template>
      <template
          v-if="type === 'favorite'">
        <el-button>
          <i class="iconfont icon-star-o"></i>
          <span>我的收藏</span>
        </el-button>
      </template>
      <div class="right">
        <el-input
          type="text"
          placeholder="搜索相关文件">
        <i
            class="iconfont icon-search"
            slot="prefix"></i>
      </el-input>
      <el-dropdown
          placement="bottom">
        <el-button
            class="el-dropdown-link">
          <span>排序方式</span>
          <i class="iconfont icon-sort"></i>
        </el-button>
        <el-dropdown-menu
            slot="dropdown">
          <el-dropdown-item>AAA</el-dropdown-item>
          <el-dropdown-item>BBB</el-dropdown-item>
          <el-dropdown-item>CCC</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button
          @click="toggleViewMode">
        <i class="iconfont icon-app"></i>
      </el-button>
      </div>
    </div>
    <file-table
        v-if="viewMode === 'list'"
        :data="data" />
    <file-grid
        v-else
        :data="data" />
  </div>
</template>

<script>
import {
  Button,
  Input,
  Dropdown,
  DropdownMenu,
  DropdownItem,
} from 'element-ui';

import FileTable from './table.vue';
import FileGrid from './grid.vue';

export default {
  name: 'FileList',
  components: {
    'el-button': Button,
    'el-input': Input,
    'el-dropdown': Dropdown,
    'el-dropdown-menu': DropdownMenu,
    'el-dropdown-item': DropdownItem,
    FileTable,
    FileGrid,
  },
  props: {
    // 类型（home: 全部文件, favorite: 我的收藏）
    type: {
      validator: (value) => {
        const values = [
          'home',
          'favorite',
        ];

        return (values.indexOf(value) >= 0);
      },
    },
    data: Array,
  },
  data() {
    return {
      // view mode: list|grid
      viewMode: 'list',
    };
  },
  methods: {
    toggleViewMode() {
      this.viewMode = (this.viewMode === 'list')
        ? 'grid'
        : 'list';
    },
  },
};
</script>

<style
    src="./index.scss"
    lang="scss"
    scoped></style>
