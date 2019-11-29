<template>
  <header class="frame-header">
    <el-button-group>
      <el-button
          type="text">
        <i class="iconfont icon-arrow-l-left"></i>
      </el-button>
      <el-button
          type="text">
        <i class="iconfont icon-arrow-l-right"></i>
      </el-button>
    </el-button-group>
    <div class="right"
        v-if="!loading">
      <img src="">
      <span>{{ profile.name }}</span>
      <el-button
          type="text"
          :disabled="sending"
          @click="logout">
        <i class="iconfont icon-power"></i>
      </el-button>
    </div>
  </header>
</template>

<script>
import {
  ButtonGroup,
  Button,
  Message,
} from 'element-ui';

import UserAPI from '../../api/user';

import Storage from '../../utils/storage';

export default {
  name: 'FrameHeader',
  components: {
    'el-button-group': ButtonGroup,
    'el-button': Button,
  },
  data() {
    return {
      loading: false,
      profile: {
        name: '',
        mail: '',
      },
      sending: false,
    };
  },
  mounted() {
    const hasLogin = Storage.getToken();
    if (hasLogin) {
      this.getProfile();
    }
  },
  methods: {
    getProfile() {
      if (this.loading) {
        return;
      }

      this.loading = true;

      this.$store.dispatch('getProfile')
        .then((data) => {
          this.profile = data;
        })
        .catch(() => {
          Message.error('用户信息加载失败');
        })
        .finally(() => {
          this.loading = false;
        });
    },
    logout() {
      if (this.sending) {
        return;
      }

      this.sending = true;

      UserAPI.logOut()
        .then(() => {
          Storage.clearAuthInfo();

          this.$router.push({
            name: 'login',
          });
        })
        .catch(() => {
          Message.error('用户信息加载失败');
        })
        .finally(() => {
          this.sending = false;
        });
    },
  },
};
</script>

<style
    src="./header.scss"
    lang="scss"
    scoped></style>
