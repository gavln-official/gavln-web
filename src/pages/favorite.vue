<template>
  <main-frame>
    <div
        class="page-favorite"
        v-loading="loading">
      <file-list
          type="favorite"
          path="favorite"
          @reload="getList"
          :data="data"></file-list>
    </div>
  </main-frame>
</template>

<script>
import MainFrame from '../components/main-frame/index.vue';
import FileList from '../components/file-list/index.vue';
import FavAPI from '../api/fav';

export default {
  name: 'Favorite',
  components: {
    MainFrame,
    FileList,
  },
  data() {
    return {
      loading: false,
      data: null,
    };
  },
  methods: {
    async getList() {
      if (this.loading) {
        return false;
      }
      this.loading = true;
      const r = await FavAPI.getList();
      this.loading = false;
      if (r.code !== 0) {
        this.$message.error(r.msg);
      } else {
        this.data = r.data;
      }
      return true;
    },
  },
  mounted() {
    this.getList();
  },
};
</script>
