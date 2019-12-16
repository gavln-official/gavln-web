<template>
  <div class="bread-crumb">
    <div class="el-breadcrumb">
      <span class="el-breadcrumb__item">
        <span
            class="el-breadcrumb__inner is-link"
            @click="switchPath('/')">全部</span>
        <span class="el-breadcrumb__separator">/</span>
      </span>
      <span
          class="el-breadcrumb__item"
          v-for="(item, index) in list"
          :key="index">
        <span
            class="el-breadcrumb__inner is-link"
            @click="switchPath(item.path)">{{ item.name }}</span>
        <span class="el-breadcrumb__separator">/</span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BreadCrumb',
  props: {
    // current path
    path: String,
  },
  computed: {
    list() {
      const list = [];
      const {
        name,
      } = this.$route;

      if (this.path !== '/') {
        const names = this.path.split('/');

        for (let i = 2; i <= names.length; i += 1) {
          list.push({
            route: name,
            name: names[i - 1],
            path: names.slice(0, i).join('/'),
          });
        }

        return list;
      }

      return [];
    },
  },
  methods: {
    switchPath(path) {
      this.$emit('switch', path);
    },
  },
};
</script>

<style
    src="./bread-crumb.scss"
    lang="scss"
    scoped></style>
