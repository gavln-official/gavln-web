<template>
  <main-frame>
    <div class="page-upload page-trash">
      <trash-list
          :data="data" />
    </div>
  </main-frame>
</template>

<script>
import Mock from '../api/mock';

import MainFrame from '../components/main-frame/index.vue';
import TrashList from '../components/trash-list/index.vue';

export default {
  name: 'Trash',
  components: {
    MainFrame,
    TrashList,
  },
  data() {
    return {
      data: Mock.files,
    };
  },
};
</script>

<style
    src="./upload/index.scss"
    lang="scss"
    scoped></style>
