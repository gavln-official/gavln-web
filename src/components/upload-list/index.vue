<!-- eslint-disable -->
<template>
  <div class="file-list upload-list">
    <div class="toolbar">
      <el-button @click="pauseAll">
        <i class="iconfont icon-upload"></i>
        <span>{{ type === 'upload' ? $t('upload-list.pause-all') : $t('upload-list.stop-all') }}</span>
      </el-button>
      <el-button @click="startAll" v-if="type === 'download'">
        <i class="iconfont icon-folder-add"></i>
        <span>{{ $t('upload-list.start-all') }}</span>
      </el-button>
      <el-button @click="deleteAll">
        <i class="iconfont icon-trash"></i>
        <span>{{ $t('upload-list.delete-all') }}</span>
      </el-button>
      <div class="right" v-if="status" v-show="status.percentage">
        <strong>{{ $t('upload-list.current-progress') }}</strong>
        <el-progress
            :percentage="status.percentage"
            :show-text="false" />
        <span>{{ $t('upload-list.done') }} {{ status.percentage }}%</span>
        <strong>，{{ status.speed | filesize }}/s</strong>
      </div>
    </div>
    <el-table
        class="file-table upload-table"
        :data="data">
      <el-table-column
          type="selection"
          width="64"></el-table-column>
      <el-table-column
          prop="type"
          :label="$t('check-all')"
          width="100">
        <template>
          <i class="iconfont icon-folder-add"></i>
        </template>
      </el-table-column>
      <el-table-column
          :label="$t('file-name')">
        <template
            slot-scope="scope">
          <a
              v-if="scope.row.type === 'folder'"
              :href="`/?path=${scope.row.id}`">{{ scope.row.name }}</a>
          <span
              v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
          :label="$t('file-size')"
          width="180">
        <template
            slot-scope="scope">
          <span>{{ scope.row.usize | filesize }}/{{ scope.row.size | filesize }}</span>
        </template>
      </el-table-column>
      <el-table-column
          :label="$t('status')"
          width="200">
        <template
            slot-scope="scope">
          <el-progress
              :percentage="scope.row.percentage"
              :show-text="false" />
          <span v-if="scope.row.status === 'STANDBY'">{{ $('upload-list.ready') }}</span>
          <span v-else-if="scope.row.status === 'NEED-RESUME'">{{ $('upload-list.paused') }}</span>
          <template v-else-if="scope.row.status === 'TRANSMITING'">
            <strong
                  v-if="scope.row.usize < scope.row.size">
                  {{ scope.row.speed | filesize }}/s </strong>
              <span>{{ pendingTime(scope.row) }}</span>
          </template>
          <span
              v-else-if="scope.row.status === 'PAUSED'">
              {{ type === 'upload' ? $t('upload-list.pause') : $t('upload-list.canceled') }}</span>
          <span v-else>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column
          width="100">
        <template
            slot-scope="scope">
          <div>
            <el-dropdown
                placement="bottom"
                @command="rowCommand($event, scope.row)">
              <i class="iconfont icon-menu-circle"></i>
              <el-dropdown-menu
                  slot="dropdown">
                <el-dropdown-item
                    v-if="type === 'upload'"
                    command="pause">{{ $t('upload-list.pause') }}</el-dropdown-item>
                <el-dropdown-item
                    v-if="type === 'download' && !scope.row.paused"
                    command="pause">{{ $t('upload-list.cancel-download') }}</el-dropdown-item>
                <el-dropdown-item
                    v-if="type === 'download' && scope.row.paused"
                    command="start">{{ $t('upload-list.start-download') }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <i class="iconfont icon-trash"
                @click="deleteRow(scope.row)"></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<!-- eslint-enable -->

<script>
import Utils from '../../utils/index';

export default {
  name: 'UploadList',
  props: {
    // 类型（upload: 全部文件, download: 我的收藏）
    type: {
      validator: (value) => {
        const values = [
          'upload',
          'download',
        ];
        return (values.indexOf(value) >= 0);
      },
    },
    data: Array,
    status: Object,
  },
  methods: {
    pendingTime(data) {
      const seconds = (data.size - data.usize) / data.speed;
      return `${this.$t('upload-list.remaing')} ${Utils.formatTime(seconds)}`;
    },
    deleteRow(row) {
      this.$emit('deleteRow', row);
    },
    pauseAll() {
      this.$emit('pauseAll');
    },
    startAll() {
      this.$emit('startAll');
    },
    deleteAll() {
      this.$emit('deleteAll');
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

<style
    src="../file-list/index.scss"
    lang="scss"
    scoped></style>
