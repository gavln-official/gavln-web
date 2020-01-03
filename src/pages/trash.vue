<template>
  <main-frame>
    <div class="page-upload page-trash" v-loading="loading">
      <trash-list
          :data="data"
          @restore="restore"
          @delete="doDelete"
          @reload="getList" />
    </div>
  </main-frame>
</template>

<script>
import Mock from '../api/mock';

import MainFrame from '../components/main-frame/index.vue';
import TrashList from '../components/trash-list/index.vue';
import TrashAPI from '../api/trash';

export default {
  name: 'Trash',
  components: {
    MainFrame,
    TrashList,
  },
  data() {
    return {
      data: null,
      loading: false,
    };
  },
  methods: {
    async getList() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.data = Mock.data;
      // const r = await TrashAPI.getList();
      // if (r.code !== 0) {
      //   this.$message(r.msg);
      // } else {
      //   this.data = r.data;
      // }
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
