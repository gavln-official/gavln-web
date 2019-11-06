<template>
  <page-frame>
    <ui-login
        :type="page"></ui-login>
  </page-frame>
</template>

<script>
import PageFrame from '../../components/page-frame/index.vue';
import UiLogin from '../../components/ui-login/index.vue';

export default {
  name: 'PageLogin',
  components: {
    PageFrame,
    UiLogin,
  },
  data() {
    return {
      page: 'login',
    };
  },
  mounted() {
    this.page = this.$route.name;
  },
};
</script>

<style
    src="./index.scss"
    lang="scss"
    scoped></style>
