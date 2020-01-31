<template>
  <div class="login-anim">
    <div class="img">
      <img
          alt="G"
          :src="images.g">
    </div>
  </div>
</template>

<script>
import g from '../../assets/logo-g.svg';

export default {
  name: 'LoginAnim',
  data() {
    return {
      images: {
        g,
      },
    };
  },
};
</script>

<style
    src="./anim.scss"
    lang="scss"
    scoped></style>
