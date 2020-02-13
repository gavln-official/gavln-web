<template>
  <header class="page-header">
    <a
        class="logo"
        href="/">
      <img
          alt="Gavln"
          :src="images.logo">
    </a>
    <ul class="links">
      <li>
        <a href="/article/intro">{{ $t('page-frame.intro') }}</a>
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
            href="/login">{{ $t('login') }}</a>
      </li>
    </ul>
  </header>
</template>

<script>
import Storage from '../../utils/storage';

import logo from '../../assets/logo.svg';

export default {
  name: 'PageHeader',
  data() {
    return {
      images: {
        logo,
      },
    };
  },
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
