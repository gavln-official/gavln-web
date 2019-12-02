<template>
  <div class="form-content register">
    <h2>欢迎加入</h2>
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
          prop="email">
        <el-input
            type="email"
            placeholder="邮箱"
            v-model="form.email" />
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
      <a href="/login" class="right">去登录</a>
    </div>
    <el-button
        type="text"
        :disabled="saving"
        @click="register">
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
  Message,
} from 'element-ui';

import UserAPI from '../../api/user';
import Validator from '../../utils/validator';

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
      form: {
        username: '',
        email: '',
        password: '',
      },
      formRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
          },
          {
            validator: this.checkUsername,
            trigger: 'blur',
          },
        ],
        email: [
          {
            type: 'email',
            message: '邮箱格式错误',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur',
          },
          {
            validator: this.checkPassword,
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
    checkUsername(rule, value, callback) {
      if (!Validator.checkUsername(value)) {
        callback(new Error('用户名格式错误'));
      }

      UserAPI.checkUsername(value)
        .then((res) => {
          if (res.data.exists) {
            callback(new Error('用户名已存在'));
          }

          callback();
        })
        .catch(() => {
          callback();
        });
    },
    checkPassword(rule, value, callback) {
      if (!Validator.checkPassword(value)) {
        callback(new Error('密码格式错误'));
      }

      callback();
    },
    register() {
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
            email,
            password,
          } = this.form;

          UserAPI.register(
            username,
            password,
            email,
          )
            .then(() => {
              Message.success('账户注册成功，请登录');

              this.$router.push({
                name: 'login',
              });
            })
            .catch((error) => {
              let message = '注册失败';

              if (error
                  && error.response
                  && error.response.data
                  && error.response.data.code) {
                if (error.response.data.code === -1002) {
                  message = '账户已存在';
                }
              }

              Message.error(message);
            })
            .finally(() => {
              this.saving = false;
            });
        });
    },
  },
};
</script>

<style
    src="./index.scss"
    lang="scss"
    scoped></style>
