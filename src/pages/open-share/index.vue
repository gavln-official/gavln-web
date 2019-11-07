<template>
  <page-frame>
    <div class="open-share">
      <share-verify />
    </div>
  </page-frame>
</template>

<script>
import PageFrame from '../../components/page-frame/index.vue';
import ShareVerify from '../../components/share/verify.vue';

export default {
  name: 'PageShare',
  components: {
    PageFrame,
    ShareVerify,
  },
  data() {
    return {
      verified: false,
    };
  },
  computed: {
    shareId() {
      return this.$route.params.routeId;
    },
  },
};
</script>

<style
    src="./index.scss"
    lang="scss"
    scoped></style>
