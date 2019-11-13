<template>
  <page-frame>
    <div class="ui-login">
      <div class="content">
        <div class="form">
          <form-content-register />
        </div>
        <login-anim />
      </div>
    </div>
  </page-frame>
</template>

<script>
import PageFrame from '../components/page-frame/index.vue';
import FormContentRegister from '../components/ui-login/register.vue';
import LoginAnim from '../components/ui-login/anim.vue';

export default {
  name: 'PageRegister',
  components: {
    PageFrame,
    FormContentRegister,
    LoginAnim,
  },
};
</script>

<style
    src="./login/index.scss"
    lang="scss"
    scoped></style>
