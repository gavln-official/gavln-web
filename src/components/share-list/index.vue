<template>
  <div class="file-list share-list">
    <el-table
        class="file-table share-table"
        :data="data">
      <el-table-column
          prop="type"
          width="70">
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
      <el-table-column
          :label="$t('share-list.share-file')">
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
          :label="$t('share-list.share-time')"
          width="160">
        <template
            slot-scope="scope">
          <span>{{ scope.row.time | time('yyyy/MM/dd HH:mm') }}</span>
        </template>
      </el-table-column>
      <el-table-column
          :label="$t('share-list.visit-count')"
          width="100">
        <template
            slot-scope="scope">
          <span>{{ scope.row.watch }} {{ $t('share-list.times') }}</span>
        </template>
      </el-table-column>
      <el-table-column
          :label="$t('share-list.download-count')"
          width="140">
        <template
            slot-scope="scope">
          <span>{{ scope.row.download }} {{ $t('share-list.times') }}</span>
        </template>
      </el-table-column>
      <el-table-column
          :label="$t('share-list.save-count')"
          width="100">
        <template
            slot-scope="scope">
          <span>{{ scope.row.fork }} {{ $t('share-list.times') }}</span>
        </template>
      </el-table-column>
      <el-table-column
          :label="$t('share-list.expired-time')"
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
    data: Array,
  },
  data() {
    return {
    };
  },
  methods: {
    refresh() {
      this.$emit('refresh');
    },
    cancelShare(item) {
      this.$confirm(`${this.$t('share-list.confirm-cancel')}<br>${this.$t('share-list.confirm-info')}`, `${this.$t('share-list.cancel-share')}`, {
        dangerouslyUseHTMLString: true,
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
      })
        .then(() => {
          ShareAPI.cancelShare(item.rand)
            .then(() => {
              this.refresh();
            });
        });
    },
    copyLink(item) {
      const url = `${this.$t('link')} ${window.location.origin}/s/${item.rand}`;

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
  },
};
</script>

<style
    src="../file-list/index.scss"
    lang="scss"
    scoped></style>
