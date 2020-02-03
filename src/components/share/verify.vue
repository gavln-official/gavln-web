<template>
  <div class="share-verify">
    <div class="header">
      <img
          alt="Gavln"
          :src="images.logo">
      <h2>
        <strong>Gavln</strong>
        <span>{{ $t('open-share.slogan') }}</span>
      </h2>
    </div>
    <div class="content">
      <p class="message">{{ username }} {{ $t('open-share.shared-encrypted-file') }}</p>
      <div class="form">
        <span class="label">{{ $t('open-share.enter-code') }}</span>
        <div class="form-item">
          <div class="input">
            <el-input
                v-model="code" />
          </div>
          <el-button
              type="primary"
              @click="submit">{{ $t('open-share.get-file') }}</el-button>
        </div>
        <span
            v-if="error"
            class="error">{{ error }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import logo from '../../assets/logo-g-white.svg';

export default {
  name: 'ShareVerify',
  props: {
    username: String,
    error: String,
    disabled: Boolean,
  },
  data() {
    return {
      code: '',
      images: {
        logo,
      },
    };
  },
  methods: {
    submit() {
      this.$emit('submit', this.code);
    },
  },
};
</script>

<style
    src="./verify.scss"
    lang="scss"
    scoped></style>
