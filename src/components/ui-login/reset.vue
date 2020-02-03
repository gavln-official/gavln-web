<template>
  <div class="form-content register">
    <h2>{{ $t('reset.forget-password') }}</h2>
    <el-form
        class="login-form"
        label-position="top"
        :model="form"
        :rules="formRules"
        ref="form"
        :disabled="saving"
        @keydown.native="keydown">
      <el-form-item
          prop="username">
        <el-input
            :placeholder="$t('username')"
            v-model="form.username" />
      </el-form-item>
      <el-form-item
          prop="email">
        <el-input
            :placeholder="$t('email')"
            v-model="form.email" />
      </el-form-item>
      <el-form-item
          class="code"
          prop="code">
        <el-input
            :placeholder="$t('verification-code')"
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
    <el-button
        type="text"
        @click="save">
      <span>{{ $t('reset.done') }}</span>
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
            message: this.$t('form-message.username-required'),
            trigger: 'blur',
          },
        ],
        email: [
          {
            required: true,
            message: this.$t('form-message.email-required'),
            trigger: 'blur',
          },
          {
            type: 'email',
            message: this.$t('form-message.invalid-email'),
            trigger: 'blur',
          },
        ],
        code: [
          {
            required: true,
            message: this.$t('form-message.verification-code-required'),
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
      waiting: 0,
      saving: false,
    };
  },
  computed: {
    sendBtnLabel() {
      return this.waiting > 0
        ? `${this.waiting}s`
        : this.$t('reset.send');
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
          this.$message.success(this.$t('reset.send-success'));
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
    keydown(event) {
      if (event.key === 'Enter') {
        this.save();
      }
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
              this.$message.success(this.$t('reset.reset-success'));

              this.$router.push({
                name: 'login',
              });
            })
            .catch(() => {
              this.$message.error(this.$t('reset.reset-fail'));
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
