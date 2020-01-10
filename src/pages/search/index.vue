<template>
  <main-frame>
    <div class="page-search">
      <el-form
          class="toolbar">
        <search-input
            :text="q"
            :source="filter.source" />
        <el-form-item
            label="位置">
          <el-select
              v-model="filter.source"
              multiple
              @change="sourceChanged">
            <el-option
                v-for="item in sourceOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item
            label="类型">
          <el-select
              v-model="filter.suffixs"
              multiple
              clearable
              placeholder="不限"
              @change="search">
            <el-option
                v-for="item in suffixOptions"
                :key="item"
                :label="item"
                :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item
            label="时间">
          <el-select
              v-model="filter.time"
              clearable
              placeholder="不限"
              @change="search">
            <el-option
                v-for="item in timeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <el-table
          class="file-table"
          v-loading="loading"
          :data="data">
        <el-table-column
            prop="type"
            width="70">
          <template>
            <i class="iconfont icon-folder-add"></i>
          </template>
        </el-table-column>
        <el-table-column
            label="文件名称">
          <template
              slot-scope="scope">
            <i
                v-if="scope.row.file.mark"
                class="iconfont icon-star-o"></i>
            <a
                v-if="scope.row.file.dir"
                :href="`/?path=${scope.row.file.path}`">{{ scope.row.file.name }}</a>
            <span
                v-else>{{ scope.row.file.name }}</span>
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
            label="修改时间"
            width="160">
          <template
              slot-scope="scope">
            <span>{{ scope.row.file.time | time('yyyy/MM/dd HH:mm') }}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="来源"
            width="140">
          <template
              slot-scope="scope">
            <span>{{ sourceLabel(scope.row.type) }}</span>
          </template>
        </el-table-column>
        <el-table-column
            width="140">
          <template
              slot-scope="scope">
            <div class="actions">
              <i
                  v-if="scope.row.type === 2"
                  class="iconfont icon-copy"
                  @click="copyLink(scope.row)"></i>
              <i
                  v-if="scope.row.type !== 2"
                  class="iconfont icon-share"
                  @click="rowCommand('share', scope.row.file)"></i>
              <i
                  v-if="scope.row.type !== 2 && !scope.row.file.dir"
                  class="iconfont icon-download"
                  @click="rowCommand('download', scope.row.file)"></i>
              <el-dropdown
                  v-if="scope.row.type !== 2"
                  placement="bottom"
                  @command="rowCommand($event, scope.row.file)">
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
                      command="favorite">{{ scope.row.file.mark
                        ? '取消收藏'
                        : '收藏' }}</el-dropdown-item>
                  <el-dropdown-item
                      command="delete">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          layout="prev, pager, next"
          background
          :page-size="size"
          :current-page="page"
          :total="total"
          :pager-count="5"
          :disabled="loading"
          @current-change="search" />
    </div>
    <url-dialog
        :visible="showUrlDialog" />
    <folder-dialog
        :visible="showFolderDialog"
        :data="folderData"
        :type="folderDialogType"
        @close="folderDialogClose"
        @success="folderDialogSuccess" />
    <share-dialog
        v-if="showShareDialog"
        :visible="showShareDialog"
        :data="shareData"
        @close="hideShareDialog"
        @success="hideShareDialog" />
    <!-- <ui-progress
        :percentage="50"
        message="正在删除...50%" /> -->
    <name-dialog
        v-if="showNameDialog"
        :visible="showNameDialog"
        :data="nameData"
        @close="nameDialogClose"
        @success="nameDialogSuccess" />
  </main-frame>
</template>

<script>
import FileDownload from 'js-file-download';

import MainFrame from '../../components/main-frame/index.vue';
import SearchInput from '../../components/search-input/index.vue';
import FolderDialog from '../../components/dialog/folder/index.vue';
import UrlDialog from '../../components/dialog/url/index.vue';
import ShareDialog from '../../components/dialog/share/index.vue';
import NameDialog from '../../components/dialog/name.vue';

import FileAPI from '../../api/file';
import FavoriteAPI from '../../api/favorite';

import Utils from '../../utils/index';

export default {
  name: 'Home',
  components: {
    MainFrame,
    SearchInput,
    FolderDialog,
    UrlDialog,
    ShareDialog,
    NameDialog,
  },
  data() {
    return {
      loading: false,
      page: 1,
      size: 10,
      total: 0,
      data: [],

      filter: {
        source: [
          'all',
        ],
        suffixs: [],
        time: '',
      },
      sourceOptions: [
        {
          label: '全部',
          value: 'all',
        }, {
          label: '个人文件',
          value: 'inbox',
        }, {
          label: '书签',
          value: 'mark',
        }, {
          label: '他人分享',
          value: 'other',
        }, {
          label: '回收站',
          value: 'trash',
        },
      ],
      suffixOptions: [
        'jpg',
        'png',
        'gif',
        'mp3',
        'flac',
        'mp4',
        'mkv',
        'rar',
        'zip',
        'psd',
        'doc',
        'xls',
        'ppt',
        'pdf',
      ],
      timeOptions: [
        {
          label: '今天',
          value: 'today',
        }, {
          label: '昨天',
          value: 'yesterday',
        }, {
          label: '过去 7 天',
          value: 'recent-7-days',
        }, {
          label: '最近 30 天',
          value: 'recent-30-days',
        }, {
          label: '最近 90 天',
          value: 'recent-90-days',
        },
      ],

      showNameDialog: false,
      nameData: {
        // full path
        path: '',
        // folder/file name
        name: '',
        // form action
        action: 'create',
        // is dir
        dir: true,
      },

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
  computed: {
    // search text
    q() {
      return this.$route.query.q
        || '';
    },
    // search source
    s() {
      return this.$route.query.s
        || '';
    },
  },
  watch: {
    q(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.search();
      }
    },
    s(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.search();
      }
    },
  },
  mounted() {
    this.search();
  },
  methods: {
    sourceLabel(type) {
      const labels = [
        '个人文件',
        '回收站',
        '他人分享',
        '书签',
      ];

      if (labels[type]) {
        return labels[type];
      }

      return '';
    },
    daysBefore(days) {
      let time = new Date();
      time.setHours(0, 0, 0, 0);
      time = time.getTime();

      time -= 1000 * 60 * 60 * 24 * days;

      return Math.round(time / 1000);
    },
    sourceChecked(type) {
      const source = this.s
          && this.s.split(',');
      return source
          && source.length
        ? source.indexOf(type) >= 0
        : false;
    },
    getStartTime() {
      let time = null;

      switch (this.filter.time) {
        case 'today':
          time = this.daysBefore(0);
          break;
        case 'yesterday':
          time = this.daysBefore(1);
          break;
        case 'recent-7-days':
          time = this.daysBefore(7);
          break;
        case 'recent-30-days':
          time = this.daysBefore(30);
          break;
        case 'recent-90-days':
          time = this.daysBefore(90);
          break;
        default:
      }

      return time;
    },
    getEndTime() {
      let time = null;

      switch (this.filter.time) {
        case 'yesterday':
          time = this.daysBefore(0);
          break;
        case 'today':
        case 'recent-7-days':
        case 'recent-30-days':
        case 'recent-90-days':
          time = Math.round(Date.now() / 1000);
          break;
        default:
      }

      return time;
    },
    getConfig() {
      const startTime = this.getStartTime();

      const config = {
        suffixs: this.filter.suffixs,
        startTime,
        endTime: this.getEndTime(),
        all: this.sourceChecked('all'),
        inbox: this.sourceChecked('inbox'),
        mark: this.sourceChecked('mark'),
        other: this.sourceChecked('other'),
        trash: this.sourceChecked('trash'),
      };

      return config;
    },

    sourceChanged() {
      const data = {
        name: 'search',
        query: {
          q: this.q,
          s: this.filter.source
            ? this.filter.source.join(',')
            : '',
        },
      };

      this.$router.replace(data);
    },
    search() {
      if (this.loading) {
        return;
      }

      if (!this.s
          || !this.s.length) {
        this.$message.error('请选择搜索位置');
        return;
      }

      this.loading = true;

      const data = {
        text: this.q,
        ...this.getConfig(),
        limit: this.size,
        offset: this.size * (this.page - 1),
      };

      FileAPI.search(data)
        .then((res) => {
          this.data = res.data.list;
          this.total = res.data.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    copyLink(item) {
      const url = `链接 ${window.location.origin}/s/${item.rand}`;

      const text = item.code
        ? `${url} \n提取码 ${item.code}`
        : url;

      try {
        Utils.copyToClipboard(text);

        this.$message.success('复制成功');
      } catch (error) {
        //
      }
    },
    rowCommand(command, data) {
      switch (command) {
        case 'share':
          this.toggleShareDialog(data);
          break;
        case 'download':
          this.download(data);
          break;
        case 'move':
          this.toggleFolderDialog(command, data);
          break;
        case 'copy':
          this.toggleFolderDialog(command, data);
          break;
        case 'rename':
          this.toggleNameDialog(data);
          break;
        case 'favorite':
          this.toggleFavorite(data);
          break;
        case 'delete':
          this.deletePath(data);
          break;
        default:
      }
    },

    // share dialog
    toggleShareDialog(data) {
      const {
        path,
        name,
        dir,
      } = data;

      this.shareData = {
        path,
        name,
        dir,
      };
      this.showShareDialog = true;
    },
    hideShareDialog() {
      this.showShareDialog = false;
    },

    // download file
    download(item) {
      FileAPI.download(item)
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
      this.search();
    },

    // folder name dialog
    toggleNameDialog(item) {
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

      this.showNameDialog = true;
    },
    nameDialogClose() {
      this.showNameDialog = false;
    },
    nameDialogSuccess() {
      this.showNameDialog = false;
      this.search();
    },

    // delete folder/file
    deletePath(item) {
      const message = `删除该${item.dir ? '文件夹' : '文件'}？`;
      this.$confirm(message, '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
      })
        .then(() => {
          FileAPI.deletePath(item.path)
            .then(() => {
              this.search();
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
          this.search();
        });
    },
  },
};
</script>

<style
    src="./index.scss"
    lang="scss"
    scoped></style>
