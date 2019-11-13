<template>
  <page-frame>
    <div class="ui-login">
      <div class="content">
        <div class="form">
          <form-content-login />
        </div>
        <login-anim />
      </div>
    </div>
  </page-frame>
</template>

<script>
import PageFrame from '../../components/page-frame/index.vue';
import FormContentLogin from '../../components/ui-login/index.vue';
import LoginAnim from '../../components/ui-login/anim.vue';

export default {
  name: 'PageLogin',
  components: {
    PageFrame,
    FormContentLogin,
    LoginAnim,
  },
};
</script>

<style
    src="./index.scss"
    lang="scss"
    scoped></style>
