<template>
  <main class="main-frame">
    <main-nav />
    <article>
      <frame-header />
      <div class="content">
        <slot>content</slot>
      </div>
    </article>
  </main>
</template>

<script>
import MainNav from '../main-nav/index.vue';
import FrameHeader from './header.vue';

export default {
  name: 'MainFrame',
  components: {
    MainNav,
    FrameHeader,
  },
};
</script>

<style
    src="./index.scss"
    lang="scss"
    scoped></style>
