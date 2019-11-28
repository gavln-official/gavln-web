<template>
  <div class="file-grid">
    <div class="check">
      <el-checkbox>全选</el-checkbox>
    </div>
    <ul class="grids">
      <li
          v-for="item in data"
          :key="item.id"
          @contextmenu.prevent="showContextMenu($event, item)">
        <i class="iconfont icon-folder-add"></i>
        <a
            v-if="item.type === 'folder'"
            :href="`/?path=${item.id}`">{{ item.name }}</a>
        <span
            v-else>{{ item.name }}</span>
      </li>
    </ul>
    <vue-context
        ref="menu">
      <li>打开</li>
      <li>下载</li>
      <li>分享</li>
      <li>收藏</li>
      <li>移动到</li>
      <li>复制到</li>
      <li>重命名</li>
      <li>删除</li>
    </vue-context>
  </div>
</template>

<script>
import {
  Checkbox,
} from 'element-ui';
import {
  VueContext,
} from 'vue-context';

export default {
  name: 'FileGrid',
  components: {
    'el-checkbox': Checkbox,
    VueContext,
  },
  props: {
    data: Array,
  },
  methods: {
    showContextMenu(event, item) {
      this.$refs.menu.open(event);

      return item;
    },
  },
};
</script>

<style
    src="./grid.scss"
    lang="scss"
    scoped></style>
