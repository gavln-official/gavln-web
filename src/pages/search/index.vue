<template>
  <main-frame>
    <div class="page-search">
      search
    </div>
  </main-frame>
</template>

<script>
import FileAPI from '../../api/file';

import MainFrame from '../../components/main-frame/index.vue';

export default {
  name: 'Home',
  components: {
    MainFrame,
  },
  data() {
    return {
      loading: false,
      page: 1,
      size: 10,
      total: 0,
      data: [],
    };
  },
  methods: {
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
