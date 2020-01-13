<template>
  <div class="form-content login">
    <h2>{{ $t('login.welcome-back') }}</h2>
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
            :placeholder="$t('login.username')"
            v-model="form.username" />
      </el-form-item>
      <el-form-item
          prop="password">
        <el-input
            :type="showPassword ? '' : 'password'"
            :placeholder="$t('login.password')"
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
      <a href="/reset">{{ $t('login.forget-password') }}</a>
      <a href="/register" class="right">{{ $t('login.go-register') }}</a>
    </div>
    <el-button
        type="text"
        :disabled="saving"
        @click="login">
      <span>{{ $t('login.login') }}</span>
      <i class="iconfont icon-arrow-right"></i>
    </el-button>
  </div>
</template>

<script>
import UserAPI from '../../api/user';

export default {
  name: 'FormContentLogin',
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
            message: this.$t('login.messages.username-required'),
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: this.$t('login.messages.password-required'),
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
