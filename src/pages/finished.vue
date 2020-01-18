<template>
  <main-frame>
    <div class="page-upload page-finished">
      <finished-list
          :data="data" />
    </div>
  </main-frame>
</template>

<script>
import Transmission from '../utils/transmission';
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
      data: null,
    };
  },
  methods: {
    getList() {
      this.data = Transmission.readList('completed');
      console.log(this.data);
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
