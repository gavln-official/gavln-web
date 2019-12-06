<template>
  <div class="file-list">
    <div class="toolbar">
      <template
          v-if="type === 'home'">
        <el-dropdown
            placement="bottom"
            @command="uploadCommand">
          <el-button
              class="el-dropdown-link">
            <span>上传</span>
            <i class="iconfont icon-upload"></i>
          </el-button>
          <el-dropdown-menu
              slot="dropdown">
            <el-dropdown-item
                command="local">本地文件</el-dropdown-item>
            <el-dropdown-item
                command="url">链接</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button
            @click="toggleFolderNameDialog()">
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
        :data="data"
        @share="toggleShareDialog" />
    <file-grid
        v-else
        :data="data" />
    <url-dialog
        :visible="showUrlDialog" />
    <folder-dialog
        :visible="false" />
    <share-dialog
        :visible="showShareDialog"
        :data="shareData" />
    <!-- <ui-progress
        :percentage="50"
        message="正在删除...50%" /> -->
    <folder-name-dialog
        v-if="showFolderNameDialog"
        :visible="showFolderNameDialog"
        :folderData="folderData"
        @close="folderNameDialogClose"
        @success="folderNameDialogSuccess" />
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
import FolderDialog from '../dialog/folder/index.vue';
import UrlDialog from '../dialog/url/index.vue';
import ShareDialog from '../dialog/share/index.vue';
// import UiProgress from '../ui-progress/index.vue';
import FolderNameDialog from '../dialog/folder-name.vue';

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
    FolderDialog,
    UrlDialog,
    ShareDialog,
    // UiProgress,
    FolderNameDialog,
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
    // current path
    path: String,
    // content list
    data: Array,
  },
  data() {
    return {
      // view mode: list|grid
      viewMode: 'list',

      showFolderNameDialog: false,
      folderData: {
        path: this.path,
        name: '',
        action: 'create',
      },

      showUrlDialog: false,
      showShareDialog: false,
      shareData: {
        id: null,
        name: '',
        type: '',
      },
    };
  },
  methods: {
    toggleViewMode() {
      this.viewMode = (this.viewMode === 'list')
        ? 'grid'
        : 'list';
    },
    toggleUrlDialog() {
      this.showUrlDialog = !this.showUrlDialog;
    },
    uploadCommand(command) {
      if (command === 'url') {
        this.toggleUrlDialog();
      }
    },
    toggleShareDialog(data) {
      const {
        id,
        name,
        type,
      } = data;

      this.shareData = {
        id,
        name,
        type,
      };
      this.showShareDialog = true;
    },
    // folder name dialog
    toggleFolderNameDialog(item) {
      if (item) {
        const {
          path,
          name,
        } = item;
        this.folderData = {
          path,
          name,
          action: 'update',
        };
      } else {
        this.folderData = {
          path: this.path,
          name: '',
          action: 'create',
        };
      }

      this.showFolderNameDialog = !this.showFolderNameDialog;
    },
    folderNameDialogClose() {
      this.showFolderNameDialog = false;
    },
    folderNameDialogSuccess() {
      this.showFolderNameDialog = false;
    },
  },
};
</script>

<style
    src="./index.scss"
    lang="scss"
    scoped></style>
