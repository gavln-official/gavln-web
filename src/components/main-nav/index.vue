<template>
  <nav class="main-nav">
    <div class="logo">
      <a href="/">Gavln</a>
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
export default {
  name: 'MainNav',
  data() {
    return {
      menus: [
        {
          name: 'home',
          label: '全部文件',
          icon: 'file',
        },
        {
          name: 'favorite',
          label: '我的收藏',
          icon: 'star-o',
        },
        {
          name: 'upload',
          label: '正在上传',
          icon: 'upload',
        },
        {
          name: 'download',
          label: '正在下载',
          icon: 'download',
        },
        {
          name: 'finished',
          label: '传输完成',
          icon: 'check-o',
        },
        {
          name: 'share',
          label: '我的分享',
          icon: 'share',
        },
        {
          name: 'trash',
          label: '回收站',
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
