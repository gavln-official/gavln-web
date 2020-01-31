<template>
  <main-frame>
    <div
        class="page-upload page-trash"
        v-loading="loading">
      <ui-empty
          v-if="!data
              || !data.length"
          icon="trash">
        <p>“回收站”中没有任何文件或者文件夹。</p>
        <span>将不再需要的文件移动到回收站，只需清空回收站，即可永久删除内容并释放存储空间。</span>
      </ui-empty>
      <trash-list
          v-else
          :data="data"
          @restore="restore"
          @delete="doDelete"
          @clear="clear" />
    </div>
  </main-frame>
</template>

<script>
import TrashAPI from '../api/trash';

import MainFrame from '../components/main-frame/index.vue';
import UiEmpty from '../components/ui-empty/index.vue';
import TrashList from '../components/trash-list/index.vue';

export default {
  name: 'Trash',
  components: {
    MainFrame,
    UiEmpty,
    TrashList,
  },
  data() {
    return {
      data: [],
      loading: false,
    };
  },
  methods: {
    async getList() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      const r = await TrashAPI.getList();
      if (r.code !== 0) {
        this.$message(r.msg);
      } else {
        this.data = r.data;
      }
      this.loading = false;
    },
    async restore(file) {
      this.loading = true;
      const r = await TrashAPI.restore(file.id, file.file.path);
      this.loading = false;
      if (r.code !== 0) {
        this.$message.error(r.msg);
      } else {
        this.getList();
      }
    },
    async doDelete(file) {
      this.loading = true;
      const r = await TrashAPI.delete(file.id, file.file.path);
      this.loading = false;
      if (r.code !== 0) {
        this.$message.error(r.msg);
      } else {
        this.getList();
      }
    },
    async clear() {
      try {
        await this.$confirm(
          this.$t('trash-list.message'),
          this.$t('prompt'),
          {
            confirmButtonText: this.$t('clear'),
            cancelButtonText: this.$t('cancel'),
          },
        );
        this.loading = true;
        const r = await TrashAPI.clear();
        this.loading = false;
        if (r.code !== 0) {
          this.$message.error(r.msg);
        } else {
          this.getList();
        }
      } catch (err) {
        // cancel
      }
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style
    src="./upload/index.scss"
    lang="scss"
    scoped></style>
