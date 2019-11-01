<template>
  <div class="file-list">
    <div class="toolbar">
      <el-button>
        <i class="iconfont icon-upload"></i>
        <span>上传</span>
      </el-button>
      <el-button>
        <i class="iconfont icon-folder-add"></i>
        <span>新建文件夹</span>
      </el-button>
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
        <el-button>
          <i class="iconfont icon-app"></i>
        </el-button>
       </div>
    </div>
    <file-table
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

export default {
  name: 'FileList',
  components: {
    'el-button': Button,
    'el-input': Input,
    'el-dropdown': Dropdown,
    'el-dropdown-menu': DropdownMenu,
    'el-dropdown-item': DropdownItem,
    FileTable,
  },
  props: {
    data: Array,
  },
};
</script>

<style
    src="./index.scss"
    lang="scss"
    scoped></style>
