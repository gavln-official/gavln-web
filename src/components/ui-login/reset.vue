<template>
  <div class="form-content register">
    <h2>忘记密码</h2>
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
            placeholder="邮箱"
            v-model="form.email" />
      </el-form-item>
      <el-form-item
          class="code"
          prop="code">
        <el-input
            placeholder="验证码"
            v-model="form.code">
        </el-input>
        <el-button
            type="text"
            :disabled="waiting > 0"
            @click="send">{{ sendBtnLabel }}</el-button>
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
    <el-button
        type="text"
        @click="save">
      <span>完成</span>
      <i class="iconfont icon-arrow-right"></i>
    </el-button>
  </div>
</template>

<script>
import UserAPI from '../../api/user';

let timer = null;

export default {
  name: 'FormContentReset',
  data() {
    return {
      form: {
        username: '',
        email: '',
        code: '',
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
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur',
          },
          {
            type: 'email',
            message: '邮箱格式错误',
            trigger: 'blur',
          },
        ],
        code: [
          {
            required: true,
            message: '请输入验证码',
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
      waiting: 0,
      saving: false,
    };
  },
  computed: {
    sendBtnLabel() {
      return this.waiting > 0
        ? `${this.waiting}s`
        : '发送验证码';
    },
  },
  methods: {
    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    },
    send() {
      if (this.waiting > 0) {
        return;
      }

      const {
        username,
        email,
      } = this.form;

      if (!username
          || !email) {
        return;
      }

      // TODO: test
      UserAPI.sendRetrieve(username, email)
        .then(() => {
          this.startCountdown();
          this.$message.success('验证码已发送至您的邮箱');
        });
    },
    startCountdown() {
      this.waiting = 60;

      timer = window.setInterval(() => {
        if (this.waiting > 0) {
          this.waiting -= 1;
        } else {
          window.clearInterval(timer);
        }
      }, 1000);
    },
    save() {
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
            email,
            code,
            password,
          } = this.form;

          UserAPI.resetPassword(
            email,
            code,
            password,
          )
            .then(() => {
              this.$message.success('密码已重置，请登录');

              this.$router.push({
                name: 'login',
              });
            })
            .catch(() => {
              this.$message.error('重置密码失败');
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
