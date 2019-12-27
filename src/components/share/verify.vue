<template>
  <div class="share-verify">
    <div class="header">
      <img src="" />
      <h2>
        <strong>Gavln</strong>
        <span>知其白，守其黑</span>
      </h2>
    </div>
    <div class="content">
      <p class="message">{{ username }}给您分享了加密文件</p>
      <div class="form">
        <span class="label">请输入提取码：</span>
        <div class="form-item">
          <div class="input">
            <el-input
                v-model="code" />
          </div>
          <el-button
              type="primary"
              @click="submit">提取文件</el-button>
        </div>
        <span
            v-if="error"
            class="error">{{ error }}</span>
      </div>
    </div>
  </div>
</template>

<script>
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
