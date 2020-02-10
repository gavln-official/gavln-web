<template>
  <el-dialog
      class="folder-dialog"
      :visible="visible"
      width="640px"
      :title="title || defaultTitle"
      @close="close">
    <bread-crumb
        :path="path"
        @switch="switchPath" />
    <div
        v-loading="loading">
      <ui-empty
          v-if="!list
              || !list.length">
        <p>{{ $t('empty-message.file') }}</p>
      </ui-empty>
      <el-table
          v-else
          class="file-table dialog-table"
          :data="list"
          :height="360"
          :highlight-current-row="true"
          @row-click="toggleSelected"
          @row-dblclick="openRow">
        <el-table-column
            prop="type"
            :label="$t('file-name')"
            width="68">
          <template
              slot-scope="scope">
            <i
                v-if="scope.row.dir"
                class="iconfont icon-folder"></i>
            <i
                v-else
                class="iconfont icon-files"></i>
          </template>
        </el-table-column>
        <el-table-column>
          <template
              slot-scope="scope">
            <span
                class="link"
                @click="switchPath(scope.row.path)">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
            :label="$t('modify-time')"
            width="160">
          <template
              slot-scope="scope">
            <span>{{ scope.row.time | time('yyyy/MM/dd HH:mm') }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div
        slot="footer">
      <el-button
          class="left"
          @click="toggleNameDialog()">{{ $t('create-folder') }}</el-button>
      <el-button
          :disabled="saving"
          @click="close">{{ $t('cancel') }}</el-button>
      <el-button
          :disabled="saving"
          @click="ok">{{ actionLabel }}</el-button>
    </div>
    <name-dialog
        v-if="showNameDialog"
        :visible="showNameDialog"
        :data="nameData"
        @close="nameDialogClose"
        @success="nameDialogSuccess" />
  </el-dialog>
</template>

<script>
import FileAPI from '../../../api/file';
import ShareAPI from '../../../api/share';

import BreadCrumb from './bread-crumb.vue';
import UiEmpty from '../../ui-empty/index.vue';
import NameDialog from '../name.vue';

export default {
  name: 'FolderDialog',
  components: {
    BreadCrumb,
    UiEmpty,
    NameDialog,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    type: { // move | copy | save
      type: String,
      default: 'move',
    },
    title: String,
    data: Object,
  },
  data() {
    return {
      loading: false,
      path: '/',
      list: [],
      selected: null,
      saving: false,

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
    };
  },
  computed: {
    defaultTitle() {
      const titles = {
        move: this.$t('folder-dialog.move-file'),
        copy: this.$t('folder-dialog.copy-file'),
        save: this.$t('folder-dialog.save-file'),
      };

      return titles[this.type];
    },
    actionLabel() {
      const labels = {
        move: this.$t('move'),
        copy: this.$t('copy'),
        save: this.$t('save'),
      };

      return labels[this.type];
    },
  },
  watch: {
    visible(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.getPath();
      }
    },
  },
  mounted() {
    this.getPath();
  },
  methods: {
    close() {
      if (this.saving) {
        return;
      }

      this.$emit('close');
    },
    toggleSelected(row) {
      this.selected = row;
    },
    switchPath(path) {
      this.path = path;
      this.selected = null;
      this.getPath();
    },
    openRow(row) {
      if (row.dir) {
        this.switchPath(row.path);
      }
    },

    // folder name dialog
    toggleNameDialog() {
      this.nameData = {
        path: this.path,
        name: '',
        action: 'create',
        dir: true,
      };

      this.showNameDialog = true;
    },
    nameDialogClose() {
      this.showNameDialog = false;
    },
    nameDialogSuccess() {
      this.showNameDialog = false;
      this.getPath();
    },
    getPath() {
      if (this.loading) {
        return;
      }

      this.loading = true;

      FileAPI.getPath(this.path)
        .then((res) => {
          this.list = res.data;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    ok() {
      if (this.saving) {
        return;
      }

      const from = this.data.path;

      let target = this.path;
      if (this.selected) {
        if (!this.selected.dir) {
          this.$message.error(this.$t('form-message.target-folder-required'));
          return;
        }

        target = this.selected.path;
      }
      const to = `${target === '/' ? '' : target}/${this.data.name}`;

      if ((this.type === 'copy'
          || this.type === 'move')
        && (from === to
          || to.indexOf(from) === 0)) {
        this.$message.error(this.$t('form-message.select-another-folder'));
        return;
      }

      switch (this.type) {
        case 'move':
          this.move(from, to);
          break;
        case 'copy':
          this.copy(from, to);
          break;
        case 'save':
          this.save(from, to);
          break;
        default:
      }
    },
    move(from, to) {
      FileAPI.move(from, to)
        .then(() => {
          this.success();
        })
        .finally(() => {
          this.saving = false;
        });
    },
    copy(from, to) {
      FileAPI.copy(from, to)
        .then(() => {
          this.success();
        })
        .finally(() => {
          this.saving = false;
        });
    },
    save(from, to) {
      ShareAPI.save(from, to, this.data.rand, this.data.code)
        .then(() => {
          this.success();
        })
        .finally(() => {
          this.saving = false;
        });
    },
    success() {
      this.$emit('success');
    },
  },
};
</script>

<style
    src="./index.scss"
    lang="scss"
    scoped></style>
