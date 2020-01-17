<template>
  <header class="page-header">
    <a
        class="logo"
        href="/">Gavln</a>
    <ul class="links">
      <li>
        <a href="/">产品介绍</a>
      </li>
      <li>
        <el-dropdown
            @command="switchLang">
          <span>{{ locale.toUpperCase() }}</span>
          <el-dropdown-menu
              slot="dropdown">
            <el-dropdown-item
                command="cn">CN</el-dropdown-item>
            <el-dropdown-item
                command="en">EN</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </li>
      <li>
        <span
            v-if="username">{{ username }}</span>
        <a
            v-else
            href="/login">登录</a>
      </li>
    </ul>
  </header>
</template>

<script>
import Storage from '../../utils/storage';

export default {
  name: 'PageHeader',
  computed: {
    locale() {
      return this.$store.state.app.locale
        || '';
    },
    username() {
      return this.$store.state.user.name
        || '';
    },
  },
  methods: {
    switchLang(value) {
      Storage.set('locale', value);
      this.$store.dispatch('setLocale', value);

      this.$router.go();
    },
  },
};
</script>

<style
    src="./header.scss"
    lang="scss"
    scoped></style>
