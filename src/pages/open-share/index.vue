<template>
  <page-frame>
    <div class="open-share">
      <share-verify
          v-if="!verified" />
      <template
          v-else>
        <share-folder
            v-if="type === 'folder'"
            :data="data" />
        <share-file
            v-else
            :data="data" />
      </template>
    </div>
  </page-frame>
</template>

<script>
import Mock from '../../api/mock';

import PageFrame from '../../components/page-frame/index.vue';
import ShareVerify from '../../components/share/verify.vue';
import ShareFolder from '../../components/share/folder.vue';
import ShareFile from '../../components/share/file.vue';

export default {
  name: 'PageShare',
  components: {
    PageFrame,
    ShareVerify,
    ShareFolder,
    ShareFile,
  },
  data() {
    return {
      verified: true,
      type: 'folder',
      data: {
        id: 123,
        name: '我的文档',
        type: 'folder',
        size: 7612344,
        content: Mock.files,
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
