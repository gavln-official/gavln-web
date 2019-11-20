<template>
  <page-frame>
    <div class="ui-login">
      <div class="content">
        <div class="form">
          <form-content-reset />
        </div>
        <login-anim />
      </div>
    </div>
  </page-frame>
</template>

<script>
import PageFrame from '../components/page-frame/index.vue';
import FormContentReset from '../components/ui-login/reset.vue';
import LoginAnim from '../components/ui-login/anim.vue';

export default {
  name: 'PageReset',
  components: {
    PageFrame,
    FormContentReset,
    LoginAnim,
  },
};
</script>

<style
    src="./login/index.scss"
    lang="scss"
    scoped></style>
