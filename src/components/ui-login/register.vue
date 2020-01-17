<template>
  <div class="form-content register">
    <h2>{{ $t('register.welcome-in') }}</h2>
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
            :placeholder="$t('username')"
            v-model="form.username" />
      </el-form-item>
      <el-form-item
          prop="email">
        <el-input
            type="email"
            :placeholder="$t('email')"
            v-model="form.email" />
      </el-form-item>
      <el-form-item
          prop="password">
        <el-input
            :type="showPassword ? '' : 'password'"
            :placeholder="$t('password')"
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
      <a href="/login" class="right">{{ $t('register.go-login') }}</a>
    </div>
    <el-button
        type="text"
        :disabled="saving"
        @click="register">
      <span>{{ $t('register.create-account') }}</span>
      <i class="iconfont icon-arrow-right"></i>
    </el-button>
  </div>
</template>

<script>
import UserAPI from '../../api/user';
import Validator from '../../utils/validator';

export default {
  name: 'FormContentRegister',
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
            message: this.$t('form-message.username-required'),
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
            message: this.$t('form-message.invalid-email'),
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: this.$t('form-message.password-required'),
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
        callback(new Error(this.$t('form-message.invalid-username')));
      }

      UserAPI.checkUsername(value)
        .then((res) => {
          if (res.data.exists) {
            callback(new Error(this.$t('form-message.username-exist')));
          }

          callback();
        })
        .catch(() => {
          callback();
        });
    },
    checkPassword(rule, value, callback) {
      if (!Validator.checkPassword(value)) {
        callback(new Error(this.$t('form-message.invalid-password')));
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
              this.$message.success(this.$t('register.success'));

              this.$router.push({
                name: 'login',
              });
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
