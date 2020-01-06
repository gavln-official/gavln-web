<template>
  <main-frame>
    <div class="page-home">
      <file-list
          type="home"
          :path="path"
          :data="data"
          :loading="loading"
          @refresh="getPath"
          @search="search"></file-list>
    </div>
  </main-frame>
</template>

<script>
import FileAPI from '../../api/file';

import MainFrame from '../../components/main-frame/index.vue';
import FileList from '../../components/file-list/index.vue';

export default {
  name: 'Home',
  components: {
    MainFrame,
    FileList,
  },
  data() {
    return {
      loading: false,
      data: [],
    };
  },
  computed: {
    path() {
      if (this.$route.query.path) {
        return this.$route.query.path;
      }

      return '/';
    },
  },
  watch: {
    path() {
      this.getPath();
    },
  },
  created() {
    this.getPath();
  },
  methods: {
    getPath() {
      if (this.loading) {
        return;
      }

      this.loading = true;

      FileAPI.getPath(this.path)
        .then((res) => {
          this.data = res.data;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    search(text, config) {
      if (this.loading) {
        return;
      }

      this.loading = true;

      const data = {
        text,
        path: config.path === 'all'
          ? '/'
          : this.path,
        suffixs: config.suffixs.trim()
          ? config.suffixs.trim().split(' ')
          : null,
        startTime: config.start
          ? Math.round(config.start.getTime() / 1000)
          : null,
        endTime: config.end
          ? Math.round(config.end.getTime() / 1000)
          : null,
      };

      FileAPI.search(data)
        .then((res) => {
          this.data = res.data;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style
    src="./index.scss"
    lang="scss"
    scoped></style>
