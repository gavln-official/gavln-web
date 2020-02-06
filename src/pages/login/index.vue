<template>
  <page-frame>
    <div class="ui-login">
      <div class="content">
        <div class="form">
          <img
              class="stars"
              :src="images.stars">
          <img
              class="tree"
              :src="images.tree">
          <img
              class="fire"
              :src="images.fire">
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

import stars from '../../assets/login/stars.svg';
import tree from '../../assets/login/tree.svg';
import fire from '../../assets/login/fire.svg';

export default {
  name: 'PageLogin',
  components: {
    PageFrame,
    FormContentLogin,
    LoginAnim,
  },
  data() {
    return {
      images: {
        stars,
        tree,
        fire,
      },
    };
  },
};
</script>

<style
    src="./index.scss"
    lang="scss"
    scoped></style>
