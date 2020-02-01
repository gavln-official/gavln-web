<template>
  <nav class="main-nav">
    <div class="logo">
      <a href="/">
        <img
            alt="Gavln"
            :src="images.logo">
      </a>
    </div>
    <ul>
      <li
          v-for="item in menus"
          :key="item.name"
          :class="{
            active: item.name === activeItem,
          }">
        <router-link
            :to="{
              name: item.name,
            }">
          <i
              class="iconfont"
              :class="`icon-${item.icon}`"></i>
          <span>{{ item.label }}</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import logo from '../../assets/logo-white.svg';

export default {
  name: 'MainNav',
  data() {
    return {
      images: {
        logo,
      },
      menus: [
        {
          name: 'home',
          label: this.$t('main-nav.home'),
          icon: 'files',
        },
        {
          name: 'favorite',
          label: this.$t('main-nav.favorite'),
          icon: 'star-o',
        },
        {
          name: 'upload',
          label: this.$t('main-nav.upload'),
          icon: 'upload',
        },
        {
          name: 'download',
          label: this.$t('main-nav.download'),
          icon: 'download',
        },
        {
          name: 'finished',
          label: this.$t('main-nav.finished'),
          icon: 'check-circle',
        },
        {
          name: 'share',
          label: this.$t('main-nav.share'),
          icon: 'share',
        },
        {
          name: 'trash',
          label: this.$t('main-nav.trash'),
          icon: 'trash',
        },
      ],
    };
  },
  computed: {
    activeItem() {
      return this.$route.name;
    },
  },
};
</script>

<style
    src="./index.scss"
    lang="scss"
    scoped></style>
