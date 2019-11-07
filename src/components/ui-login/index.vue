<template>
  <div class="form-content login">
    <h2>欢迎回来</h2>
    <el-form
        class="login-form"
        label-position="top">
      <el-form-item>
        <el-input
            placeholder="用户名/邮箱"
            v-model="username" />
      </el-form-item>
      <el-form-item>
        <el-input
            :type="showPassword ? '' : 'password'"
            placeholder="密码"
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
      </el-form-item>
    </el-form>
    <div class="links">
      <a href="/">忘记密码？</a>
      <a href="/register" class="right">去注册</a>
    </div>
    <el-button
        type="text">
      <span>登录账户</span>
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
  name: 'FormContentLogin',
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-input': Input,
    'el-button': Button,
  },
  data() {
    return {
      username: '',
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
