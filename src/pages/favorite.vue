<template>
  <main-frame>
    <div class="page-favorite">
      <file-list
          type="favorite"
          :data="data"></file-list>
    </div>
  </main-frame>
</template>

<script>
import Mock from '../api/mock';

import MainFrame from '../components/main-frame/index.vue';
import FileList from '../components/file-list/index.vue';

export default {
  name: 'Favorite',
  components: {
    MainFrame,
    FileList,
  },
  data() {
    return {
      data: Mock.files,
    };
  },
};
</script>
