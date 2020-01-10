<template>
  <div class="file-list share-list">
    <el-table
        class="file-table share-table"
        v-loading="loading"
        :data="data"
        :height="tableHeight">
      <el-table-column
          prop="type"
          width="70">
        <template>
          <i class="iconfont icon-folder-add"></i>
        </template>
      </el-table-column>
      <el-table-column
          label="分享文件">
        <template
            slot-scope="scope">
          <a
              v-if="scope.row.dir"
              :href="`/?path=${scope.row.id}`">{{ scope.row.name }}</a>
          <span
              v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="分享时间"
          width="160">
        <template
            slot-scope="scope">
          <span>{{ scope.row.time | time('yyyy/MM/dd HH:mm') }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="查看次数"
          width="80">
        <template
            slot-scope="scope">
          <span>{{ scope.row.watch }}次</span>
        </template>
      </el-table-column>
      <el-table-column
          label="下载次数"
          width="80">
        <template
            slot-scope="scope">
          <span>{{ scope.row.download }}次</span>
        </template>
      </el-table-column>
      <el-table-column
          label="保存次数"
          width="80">
        <template
            slot-scope="scope">
          <span>{{ scope.row.fork }}次</span>
        </template>
      </el-table-column>
      <el-table-column
          label="失效时间"
          width="160">
        <template
            slot-scope="scope">
          <span
              v-if="scope.row.expires">{{ scope.row.expires | time('yyyy/MM/dd HH:mm') }}</span> <!-- eslint-disable-line -->
          <span
              v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
          label=""
          width="120">
        <template
            slot-scope="scope">
          <div class="actions">
            <i
                class="iconfont icon-copy"
                @click="copyLink(scope.row)"></i>
            <i
                class="iconfont icon-trash"
                @click="cancelShare(scope.row)"></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import ShareAPI from '../../api/share';

import Utils from '../../utils/index';

export default {
  name: 'ShareList',
  props: {
    loading: Boolean,
    data: Array,
  },
  data() {
    return {
      tableHeight: null,
    };
  },
  mounted() {
    window.addEventListener('resize', this.calcTableHeight);

    this.calcTableHeight();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calcTableHeight);
  },
  methods: {
    calcTableHeight() {
      this.tableHeight = window.innerHeight - 64;
    },
    refresh() {
      this.$emit('refresh');
    },
    cancelShare(item) {
      this.$confirm('你要确认取消分享吗？<br>取消分享后，该条分享记录将被删除，好友将无法再访问此分享链接', '确认取消分享', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          ShareAPI.cancelShare(item.rand)
            .then(() => {
              this.refresh();
            });
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
  },
};
</script>

<style
    src="../file-list/index.scss"
    lang="scss"
    scoped></style>
