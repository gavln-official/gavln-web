<template>
  <div class="bread-crumb">
    <el-breadcrumb
        separator="/">
      <el-breadcrumb-item
          :to="{
            name: 'home',
          }">全部</el-breadcrumb-item>
      <el-breadcrumb-item
          v-for="(item, index) in list"
          :key="index"
          :to="{
            name: item.route,
            query: {
              path: item.path,
            },
          }">{{ item.name }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
import {
  Breadcrumb,
  BreadcrumbItem,
} from 'element-ui';

export default {
  name: 'BreadCrumb',
  components: {
    'el-breadcrumb': Breadcrumb,
    'el-breadcrumb-item': BreadcrumbItem,
  },
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
};
</script>

<style
    src="./bread-crumb.scss"
    lang="scss"
    scoped></style>
