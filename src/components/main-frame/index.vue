<template>
  <main class="main-frame">
    <main-nav />
    <article>
      <header>header</header>
      <div class="content">
        <slot>content</slot>
      </div>
    </article>
  </main>
</template>

<script>
import MainNav from '../main-nav/index.vue';

export default {
  name: 'MainFrame',
  components: {
    MainNav,
  },
};
</script>

<style
    src="./index.scss"
    lang="scss"
    scoped></style>
