<template>
  <main-frame>
    <div class="page-search">
      <el-form
          class="toolbar">
        <search-input
            :text="q"
            :source="filter.source" />
        <el-form-item
            :label="$t('page-search.position')">
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
            :label="$t('page-search.type')">
          <el-select
              v-model="filter.suffixs"
              multiple
              clearable
              :placeholder="$t('page-search.all')"
              @change="search">
            <el-option
                v-for="item in suffixOptions"
                :key="item"
                :label="item"
                :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item
            :label="$t('time')">
          <el-select
              v-model="filter.time"
              clearable
              :placeholder="$t('page-search.all')"
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
            :label="$t('file-name')">
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
            :label="$t('file-size')"
            width="100">
          <template
              slot-scope="scope">
            <span>{{ scope.row.file.size | filesize }}</span>
          </template>
        </el-table-column>
        <el-table-column
            :label="$t('modify-time')"
            width="160">
          <template
              slot-scope="scope">
            <span>{{ scope.row.file.time | time('yyyy/MM/dd HH:mm') }}</span>
          </template>
        </el-table-column>
        <el-table-column
            :label="$t('page-search.source')"
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
                      command="move">{{ $t('move-to') }}</el-dropdown-item>
                  <el-dropdown-item
                      command="copy">{{ $t('copy-to') }}</el-dropdown-item>
                  <el-dropdown-item
                      command="rename">{{ $t('rename') }}</el-dropdown-item>
                  <el-dropdown-item
                      command="favorite">{{ scope.row.file.mark
                        ? $t('remove-from-fav')
                        : $t('add-to-fav') }}</el-dropdown-item>
                  <el-dropdown-item
                      command="delete">{{ $t('delete') }}</el-dropdown-item>
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
          label: this.$t('all'),
          value: 'all',
        }, {
          label: this.$t('page-search.inbox'),
          value: 'inbox',
        }, {
          label: this.$t('page-search.mark'),
          value: 'mark',
        }, {
          label: this.$t('page-search.other'),
          value: 'other',
        }, {
          label: this.$t('trash'),
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
          label: this.$t('page-search.today'),
          value: 'today',
        }, {
          label: this.$t('page-search.yesterday'),
          value: 'yesterday',
        }, {
          label: this.$t('page-search.recent-7-days'),
          value: 'recent-7-days',
        }, {
          label: this.$t('page-search.recent-30-days'),
          value: 'recent-30-days',
        }, {
          label: this.$t('page-search.recent-90-days'),
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
    const source = this.s
        && this.s.split(',');
    if (source
        && source.length) {
      this.filter.source = source;
    }

    this.search();
  },
  methods: {
    sourceLabel(type) {
      const labels = [
        this.$t('page-search.inbox'),
        this.$t('trash'),
        this.$t('page-search.share'),
        this.$t('page-search.mark'),
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

      if (!this.q) {
        this.$message.error(this.$t('form-message.text-required'));
        return;
      }

      if (!this.s
          || !this.s.length) {
        this.$message.error(this.$t('form-message.source-required'));
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
      const url = `${this.$t('url')} ${window.location.origin}/s/${item.rand}`;

      const text = item.code
        ? `${url} \n${this.$t('verify-code')} ${item.code}`
        : url;

      try {
        Utils.copyToClipboard(text);

        this.$message.success(this.$t('copy-success'));
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
      const message = this.$t('file-list.delete-this', [this.$t(item.dir ? 'folder' : 'file')]);
      this.$confirm(message, this.$t('prompt'), {
        confirmButtonText: this.$t('delete'),
        cancelButtonText: this.$t('cancel'),
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
