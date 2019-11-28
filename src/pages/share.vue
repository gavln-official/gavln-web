<template>
  <main-frame>
    <div class="page-upload page-share">
      <share-list
          :data="data" />
    </div>
  </main-frame>
</template>

<script>
import Mock from '../api/mock';

import MainFrame from '../components/main-frame/index.vue';
import ShareList from '../components/share-list/index.vue';

export default {
  name: 'share',
  components: {
    MainFrame,
    ShareList,
  },
  data() {
    return {
      data: Mock.files,
    };
  },
};
</script>
