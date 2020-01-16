<template>
  <div class="file-list upload-list">
    <div class="toolbar">
      <el-button @click="pauseAll">
        <i class="iconfont icon-upload"></i>
        <span>{{ $t('upload-list.pause-all') }}</span>
      </el-button>
      <el-button>
        <i class="iconfont icon-folder-add"></i>
        <span>{{ $t('upload-list.start-all') }}</span>
      </el-button>
      <el-button>
        <i class="iconfont icon-trash"></i>
        <span>{{ $t('upload-list.delete-all') }}</span>
      </el-button>
      <div class="right" v-show="status.percentage">
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
          width="48">
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
          <template v-if="scope.row.usize < scope.row.size">
            <template v-if="scope.row.speed">
              <strong
                  v-if="scope.row.usize < scope.row.size">
                  {{ scope.row.speed | filesize }}/s </strong>
              <span>{{ pendingTime(scope.row) }}</span>
            </template>
            <span
                v-else>{{ $t('upload-list.ready') }}</span>
          </template>
          <span
              v-else>{{ $t('upload-list.finished') }}</span>
        </template>
      </el-table-column>
      <el-table-column
          width="100">
        <template
            slot-scope="scope">
          <div>
            <i class="iconfont icon-menu-circle"></i>
            <i class="iconfont icon-trash"
                @click="deleteRow(scope.row)"></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

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
  },
};
</script>

<style
    src="../file-list/index.scss"
    lang="scss"
    scoped></style>
