<template>
  <div class="file-list">
    <bread-crumb
        :path="path" />
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
            @click="toggleNameDialog()">
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
        <search-input
            @search="search" />
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
        v-loading="loading"
        :data="data"
        @command="onCommand" />
    <file-grid
        v-else
        v-loading="loading"
        :data="data" />
    <upload-dialog
        v-if="showUploadDialog"
        :visible="showUploadDialog"
        :path="path"
        @close="uploadDialogClose"
        @success="uploadDialogSuccess" />
    <url-dialog
        :visible="showUrlDialog" />
    <folder-dialog
        :visible="showFolderDialog"
        :data="folderData"
        :type="folderDialogType"
        @close="folderDialogClose"
        @success="folderDialogSuccess" />
    <share-dialog
        :visible="showShareDialog"
        :data="shareData" />
    <!-- <ui-progress
        :percentage="50"
        message="正在删除...50%" /> -->
    <name-dialog
        v-if="showNameDialog"
        :visible="showNameDialog"
        :data="nameData"
        @close="nameDialogClose"
        @success="nameDialogSuccess" />
  </div>
</template>

<script>
import FileDownload from 'js-file-download';

import BreadCrumb from './bread-crumb.vue';
import SearchInput from '../search-input/index.vue';
import FileTable from './table.vue';
import FileGrid from './grid.vue';
import FolderDialog from '../dialog/folder/index.vue';
import UploadDialog from '../dialog/upload/index.vue';
import UrlDialog from '../dialog/url/index.vue';
import ShareDialog from '../dialog/share/index.vue';
// import UiProgress from '../ui-progress/index.vue';
import NameDialog from '../dialog/name.vue';

import FileAPI from '../../api/file';
import FavoriteAPI from '../../api/favorite';

import Storage from '../../utils/storage';

export default {
  name: 'FileList',
  components: {
    BreadCrumb,
    SearchInput,
    FileTable,
    FileGrid,
    FolderDialog,
    UploadDialog,
    UrlDialog,
    ShareDialog,
    // UiProgress,
    NameDialog,
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
    loading: Boolean,
    // content list
    data: Array,
  },
  data() {
    return {
      // view mode: list|grid
      viewMode: 'list',

      showNameDialog: false,
      nameData: {
        // full path
        path: this.path,
        // folder/file name
        name: '',
        // form action
        action: 'create',
        // is dir
        dir: true,
      },

      showUploadDialog: false,
      showUrlDialog: false,
      showShareDialog: false,
      shareData: {
        id: null,
        name: '',
        type: '',
      },
      showFolderDialog: false,
      folderDialogType: '',
      folderData: null,
    };
  },
  created() {
    const viewMode = Storage.get('view-mode');
    this.viewMode = viewMode || 'list';
  },
  methods: {
    search(text) {
      if (this.searching) {
        return;
      }

      if (!text) {
        this.refresh();
      } else {
        this.$emit('search', text);
      }
    },
    toggleViewMode() {
      this.viewMode = (this.viewMode === 'list')
        ? 'grid'
        : 'list';

      Storage.set('view-mode', this.viewMode);
    },
    refresh() {
      this.$emit('refresh');
    },

    // upload
    uploadCommand(command) {
      if (command === 'local') {
        // this.$refs.fileInput.click();
        this.toggleUploadDialog();
      } else if (command === 'url') {
        this.toggleUrlDialog();
      }
    },

    // upload local file
    toggleUploadDialog() {
      this.showUploadDialog = !this.showUploadDialog;
    },
    uploadDialogClose() {
      this.showUploadDialog = false;
    },
    uploadDialogSuccess() {
      this.showUploadDialog = false;
      this.refresh();
    },

    // upload from url
    toggleUrlDialog() {
      this.showUrlDialog = !this.showUrlDialog;
    },

    // child command
    onCommand(data) {
      switch (data.command) {
        case 'share':
          this.toggleShareDialog();
          break;
        case 'download':
          this.download(data.row);
          break;
        case 'move':
          this.toggleFolderDialog(data.command, data.row);
          break;
        case 'copy':
          this.toggleFolderDialog(data.command, data.row);
          break;
        case 'rename':
          this.toggleNameDialog(data.row);
          break;
        case 'favorite':
          this.toggleFavorite(data.row);
          break;
        case 'delete':
          this.deletePath(data.row);
          break;
        default:
      }
    },

    // share dialog
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

    // download file
    download(item) {
      FileAPI.download(item, item.size)
        .then((res) => {
          FileDownload(res, item.name);
        });
    },

    // folder dialog
    toggleFolderDialog(type, item) {
      this.folderDialogType = type;
      this.folderData = item;

      this.showFolderDialog = true;
    },
    folderDialogClose() {
      this.showFolderDialog = false;
    },
    folderDialogSuccess() {
      this.showFolderDialog = false;
      this.refresh();
    },

    // folder name dialog
    toggleNameDialog(item) {
      if (item) {
        const {
          path,
          name,
        } = item;
        this.nameData = {
          path,
          name,
          action: 'update',
          dir: item.dir
              || false,
        };
      } else {
        this.nameData = {
          path: this.path,
          name: '',
          action: 'create',
          dir: true,
        };
      }

      this.showNameDialog = true;
    },
    nameDialogClose() {
      this.showNameDialog = false;
    },
    nameDialogSuccess() {
      this.showNameDialog = false;
      this.refresh();
    },

    // delete folder/file
    deletePath(item) {
      const message = `删除该${item.dir ? '目录' : '文件'}？`;
      this.$confirm(message, '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
      })
        .then(() => {
          FileAPI.deletePath(item.path)
            .then(() => {
              this.refresh();
            });
        });
    },

    // toggle favorite
    toggleFavorite(item) {
      const request = item.mark
        ? FavoriteAPI.remove
        : FavoriteAPI.add;

      request(item.path)
        .then(() => {
          this.refresh();
        });
    },
  },
};
</script>

<style
    src="./index.scss"
    lang="scss"
    scoped></style>
