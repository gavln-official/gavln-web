<template>
  <el-dialog
      class="folder-dialog"
      :visible="visible"
      width="640px"
      :title="title || defaultTitle"
      @close="close">
    <el-button-group class="nav">
      <el-button
          type="text">
        <i class="iconfont icon-arrow-l-left"></i>
      </el-button>
      <el-button
          type="text">
        <i class="iconfont icon-arrow-l-right"></i>
      </el-button>
    </el-button-group>
    <bread-crumb
        :path="path"
        @switch="switchPath" />
    <el-table
        class="file-table dialog-table"
        :data="list"
        :height="360"
        :highlight-current-row="true"
        @row-click="toggleSelected">
      <el-table-column
          prop="type"
          label="文件名"
          width="68">
        <template>
          <i class="iconfont icon-folder-add"></i>
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
          label="修改时间"
          width="160">
        <template
            slot-scope="scope">
          <span>{{ scope.row.time | time('yyyy/MM/dd HH:mm') }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div
        slot="footer">
      <el-button
          class="left">新建文件夹</el-button>
      <el-button
          :disabled="saving"
          @click="close">取消</el-button>
      <el-button
          :disabled="saving"
          @click="ok">{{ actionLabel }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import BreadCrumb from './bread-crumb.vue';

import FileAPI from '../../../api/file';
import ShareAPI from '../../../api/share';

export default {
  name: 'FolderDialog',
  components: {
    BreadCrumb,
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
    };
  },
  computed: {
    defaultTitle() {
      const titles = {
        move: '移动文件',
        copy: '复制文件',
        save: '保存到网盘',
      };

      return titles[this.type];
    },
    actionLabel() {
      const labels = {
        move: '移动',
        copy: '复制',
        save: '保存',
      };

      return labels[this.type];
    },
  },
  created() {
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
          this.$message.error('请选择目标文件夹');
          return;
        }

        target = this.selected.path;
      }
      const to = `${target === '/' ? '' : target}/${this.data.name}`;

      if ((this.type === 'copy'
          || this.type === 'move')
        && (from === to
          || to.indexOf(from) === 0)) {
        this.$message.error('请选择其他文件夹');
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
