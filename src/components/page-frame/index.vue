<template>
  <div class="page-frame">
    <page-header />
    <div class="page-content">
      <slot></slot>
    </div>
    <page-footer />
  </div>
</template>

<script>
import PageHeader from './header.vue';
import PageFooter from './footer.vue';

export default {
  name: 'PageFrame',
  components: {
    PageHeader,
    PageFooter,
  },
};
</script>

<style
    src="./index.scss"
    lang="scss"
    scoped></style>
