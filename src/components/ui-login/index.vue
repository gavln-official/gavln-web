<template>
  <div class="ui-login">
    <div class="content">
      <div class="form">
        <form-content-login
            v-if="type === 'login'" />
        <form-content-register
            v-else />
      </div>
      <div class="img">
        <img
            src="https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&h=500&q=80"
            alt="logo">
      </div>
    </div>
  </div>
</template>

<script>
import FormContentLogin from './login.vue';
import FormContentRegister from './register.vue';

export default {
  name: 'UiLogin',
  components: {
    FormContentLogin,
    FormContentRegister,
  },
  props: {
    // 类型（register: 注册, login: 登录）
    type: {
      validator: (value) => {
        const values = [
          'register',
          'login',
        ];

        return (values.indexOf(value) >= 0);
      },
    },
  },
};
</script>

<style
    src="./index.scss"
    lang="scss"
    scoped></style>
