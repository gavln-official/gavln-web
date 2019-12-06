<template>
  <main-frame>
    <div class="page-home">
      <file-list
          type="home"
          :path="path"
          :data="data"></file-list>
    </div>
  </main-frame>
</template>

<script>
import {
  Message,
} from 'element-ui';

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
  mounted() {
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
        .catch((error) => {
          console.log(error);
          Message.error('数据加载失败');
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
