<template>
  <div class="page-login">
    <login-header />
    <ui-login
        :type="page"></ui-login>
    <login-footer />
  </div>
</template>

<script>
import LoginHeader from '../../components/ui-login/header.vue';
import UiLogin from '../../components/ui-login/index.vue';
import LoginFooter from '../../components/ui-login/footer.vue';

export default {
  name: 'PageLogin',
  components: {
    'login-header': LoginHeader,
    'ui-login': UiLogin,
    'login-footer': LoginFooter,
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
