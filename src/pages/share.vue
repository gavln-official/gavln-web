<template>
  <main-frame>
    <div class="page-upload page-share">
      <share-list
          :loading="loading"
          :data="data"
          @refresh="getList" />
    </div>
  </main-frame>
</template>

<script>
import MainFrame from '../components/main-frame/index.vue';
import ShareList from '../components/share-list/index.vue';

import ShareAPI from '../api/share';

export default {
  name: 'share',
  components: {
    MainFrame,
    ShareList,
  },
  data() {
    return {
      loading: false,
      data: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      if (this.loading) {
        return;
      }

      this.loading = true;

      ShareAPI.getList()
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
