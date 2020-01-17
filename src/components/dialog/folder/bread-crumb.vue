<template>
  <div class="bread-crumb">
    <div class="el-breadcrumb">
      <span class="el-breadcrumb__item">
        <span
            class="el-breadcrumb__inner is-link"
            @click="switchPath('/')">{{ rootName }}</span>
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
    // root path
    rootPath: String,
  },
  computed: {
    rootName() {
      if (this.rootPath) {
        return this.rootPath.split('/')[1];
      }

      return '全部';
    },
    list() {
      const path = this.rootPath
        ? this.path.substring(this.rootPath.length)
        : this.path;
      const list = [];

      if (path !== '/') {
        const names = path.split('/');

        for (let i = 2; i <= names.length; i += 1) {
          list.push({
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
      this.$emit('switch', `${this.rootPath}${path}`);
    },
  },
};
</script>

<style
    src="./bread-crumb.scss"
    lang="scss"
    scoped></style>
