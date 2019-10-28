<template>
  <div class="page-login">
    <ui-login
        type="login"></ui-login>
  </div>
</template>

<script>
import UiLogin from '../../components/ui-login/index.vue';

export default {
  name: 'PageLogin',
  components: {
    'ui-login': UiLogin,
  },
};
</script>
