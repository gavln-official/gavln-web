<template>
  <page-frame>
    <div
        class="open-share"
        v-loading="checking">
      <div
          class="error"
          v-if="expired || invalid">
        <span
            v-if="expired">分享已过期</span>
        <span
            v-if="invalid">无效的分享链接</span>
      </div>
      <template
          v-else>
        <share-verify
            v-if="encrypted && !verified"
            :username="username"
            :error="verifyError"
            :disabled="verifing"
            @submit="getShare" />
        <template
            v-else>
          <share-folder
              v-if="type === 'folder'"
              :data="data" />
          <share-file
              v-else
              :data="data" />
        </template>
      </template>
    </div>
  </page-frame>
</template>

<script>
import PageFrame from '../../components/page-frame/index.vue';
import ShareVerify from '../../components/share/verify.vue';
import ShareFolder from '../../components/share/folder.vue';
import ShareFile from '../../components/share/file.vue';

import ShareAPI from '../../api/share';

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
      checking: false,
      loading: false,
      encrypted: false,
      verified: false,
      expired: false,
      invalid: false,

      username: '',
      verifing: false,
      verifyError: '',

      type: 'folder',
      data: null,
    };
  },
  computed: {
    rand() {
      return this.$route.params.rand;
    },
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      if (this.checking) {
        return;
      }

      this.checking = true;

      ShareAPI.check(this.rand)
        .then((res) => {
          switch (res.data.status) {
            case 0: // open
              this.encrypted = false;
              this.verified = false;
              this.expired = false;
              break;
            case 1: // encrypted
              this.encrypted = true;
              this.verified = false;
              this.expired = false;
              break;
            case 2: // expired
              this.encrypted = false;
              this.verified = false;
              this.expired = true;
              break;
            default:
          }

          if (res.data.account
              && res.data.account.name) {
            this.username = res.data.account.name;
          }

          if (!this.expired
              && !this.encrypted) {
            this.getShare();
          }
        })
        .catch((error) => {
          if (error.response
              && error.response.status === 404) {
            this.invalid = true;
          }
        })
        .finally(() => {
          this.checking = false;
        });
    },
    getShare(code) {
      if (this.verifing) {
        return;
      }

      if (this.encrypted
          && !code) {
        this.verifyError = '请输入提取码';
        return;
      }

      this.verifing = true;
      this.verifyError = '';

      ShareAPI.getShare(this.rand, code)
        .then((res) => {
          if (res.data.file) {
            if (res.data.file.dir) {
              this.type = 'folder';
              this.data = res.data.file;
              this.verified = true;
            } else {
              this.type = 'file';
              this.data = res.data.file;
              this.verified = true;
            }
          }

          this.data.rand = this.rand;
          this.data.code = code;
        })
        .catch((error) => {
          if (error.response
              && error.response.data
              && error.response.data.code
              && error.response.data.code === -1009) {
            this.verifyError = '无效的提取码';
          }
        })
        .finally(() => {
          this.verifing = false;
        });
    },
  },
};
</script>

<style
    src="./index.scss"
    lang="scss"
    scoped></style>
