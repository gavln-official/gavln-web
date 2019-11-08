<template>
  <page-frame>
    <div class="open-share">
      <share-verify
          v-if="!verified" />
      <template
          v-else>
        <share-single
            v-if="isSingle"
            :data="data" />
      </template>
    </div>
  </page-frame>
</template>

<script>
import PageFrame from '../../components/page-frame/index.vue';
import ShareVerify from '../../components/share/verify.vue';
import ShareSingle from '../../components/share/single.vue';

export default {
  name: 'PageShare',
  components: {
    PageFrame,
    ShareVerify,
    ShareSingle,
  },
  data() {
    return {
      verified: true,
      isSingle: true,
      data: {
        id: 123,
        name: '使用文档.pdf',
        type: 'pdf',
        size: 7612344,
      },
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
