<template>
  <div class="form-content register">
    <h2>欢迎加入</h2>
    <el-form
        class="login-form"
        label-position="top">
      <el-form-item>
        <el-input
            placeholder="用户名"
            v-model="username" />
      </el-form-item>
      <el-form-item>
        <el-input
            placeholder="邮箱"
            v-model="email" />
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
        <span class="tips">8～18位字符，包含数字及字母</span>
      </el-form-item>
    </el-form>
    <div class="links">
      <a href="/login" class="right">去注册</a>
    </div>
    <el-button
        type="text">
      <span>创建账户</span>
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
  name: 'FormContentRegister',
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-input': Input,
    'el-button': Button,
  },
  data() {
    return {
      username: '',
      email: '',
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
    src="./login.scss"
    lang="scss"
    scoped></style>
