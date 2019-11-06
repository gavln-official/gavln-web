<template>
  <main-frame>
    <div class="page-upload page-finished">
      <finished-list
          :data="data" />
    </div>
  </main-frame>
</template>

<script>
import Mock from '../api/mock';

import MainFrame from '../components/main-frame/index.vue';
import FinishedList from '../components/finished-list/index.vue';

export default {
  name: 'Finished',
  components: {
    MainFrame,
    FinishedList,
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
