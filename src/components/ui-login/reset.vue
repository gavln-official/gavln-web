<template>
  <div class="form-content register">
    <h2>忘记密码</h2>
    <el-form
        class="login-form"
        label-position="top">
      <el-form-item>
        <el-input
            placeholder="邮箱"
            v-model="email" />
      </el-form-item>
      <el-form-item
          class="code">
        <el-input
            placeholder="验证码"
            v-model="code">
        </el-input>
        <el-button
            type="text">发送验证码</el-button>
      </el-form-item>
      <el-form-item>
        <el-input
            :type="showPassword ? '' : 'password'"
            placeholder="设置密码"
            v-model="password">
          <i
              class="iconfont"
              :class="{
                'icon-view-off': !showPassword,
                'icon-view-on': showPassword,
              }"
              slot="suffix"
              @click="toggleShowPassword"></i>
        </el-input>
        <span class="tips">8～18位字符，包含数字及字母</span>
      </el-form-item>
    </el-form>
    <el-button
        type="text">
      <span>完成</span>
      <i class="iconfont icon-arrow-right"></i>
    </el-button>
  </div>
</template>

<script>
import {
  Form,
  FormItem,
  Input,
  Button,
} from 'element-ui';

export default {
  name: 'FormContentReset',
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-input': Input,
    'el-button': Button,
  },
  data() {
    return {
      email: '',
      code: '',
      password: '',
      showPassword: false,
    };
  },
  methods: {
    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    },
  },
};
</script>

<style
    src="./index.scss"
    lang="scss"
    scoped></style>
