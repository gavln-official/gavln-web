<template>
  <div class="form-content login">
    <h2>欢迎回来</h2>
    <el-form
        class="login-form"
        label-position="top"
        :model="form"
        :rules="formRules"
        ref="form"
        :disabled="saving">
      <el-form-item
          prop="username">
        <el-input
            placeholder="用户名"
            v-model="form.username" />
      </el-form-item>
      <el-form-item
          prop="password">
        <el-input
            :type="showPassword ? '' : 'password'"
            placeholder="密码"
            v-model="form.password">
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
      <a href="/reset">忘记密码？</a>
      <a href="/register" class="right">去注册</a>
    </div>
    <el-button
        type="text"
        :disabled="saving"
        @click="login">
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

import UserAPI from '../../api/user';

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
      form: {
        username: '',
        password: '',
      },
      formRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur',
          },
        ],
      },
      showPassword: false,
      saving: false,
    };
  },
  methods: {
    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    },
    login() {
      if (this.saving) {
        return;
      }

      this.$refs.form
        .validate((valid) => {
          if (!valid) {
            return;
          }

          this.saving = true;

          const {
            username,
            password,
          } = this.form;

          UserAPI.login(
            username,
            password,
          )
            .then(() => {
              this.redirect();
            })
            .catch(() => {})
            .finally(() => {
              this.saving = false;
            });
        });
    },
    redirect() {
      let {
        path,
      } = this.$route.query;

      if (!path) {
        path = '/';
      }

      this.$router.push({
        path,
      });
    },
  },
};
</script>

<style
    src="./index.scss"
    lang="scss"
    scoped></style>
