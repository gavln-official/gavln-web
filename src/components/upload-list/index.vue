<template>
  <div class="file-list upload-list">
    <div class="toolbar">
      <el-button>
        <i class="iconfont icon-upload"></i>
        <span>全部暂停</span>
      </el-button>
      <el-button>
        <i class="iconfont icon-folder-add"></i>
        <span>全部开始</span>
      </el-button>
      <el-button>
        <i class="iconfont icon-trash"></i>
        <span>全部删除</span>
      </el-button>
      <div class="right" v-show="status.percentage">
        <strong>当前进度</strong>
        <el-progress
            :percentage="status.percentage"
            :show-text="false" />
        <span>已完成 {{ status.percentage }}%</span>
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
          label="全选"
          width="48">
        <template>
          <i class="iconfont icon-folder-add"></i>
        </template>
      </el-table-column>
      <el-table-column
          label="文件名称">
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
          label="文件大小"
          width="180">
        <template
            slot-scope="scope">
          <span>{{ scope.row.usize | filesize }}/{{ scope.row.size | filesize }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="状态"
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
            <span v-else>准备传输</span>
          </template>
          <span v-else>传输完成</span>
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
  data() {
    return {
    };
  },
  methods: {
    pendingTime(data) {
      const seconds = (data.size - data.usize) / data.speed;
      return `剩余 ${Utils.formatTime(seconds)}`;
    },
    deleteRow(row) {
      this.$emit('deleteRow', row);
    },
  },
};
</script>

<style
    src="../file-list/index.scss"
    lang="scss"
    scoped></style>
