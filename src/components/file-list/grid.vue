<template>
  <div class="file-grid">
    <div class="check">
      <el-checkbox>全选</el-checkbox>
    </div>
    <ul class="grids">
      <li
          v-for="item in data"
          :key="item.path"
          @contextmenu.prevent="showContextMenu($event, item)">
        <i class="iconfont icon-folder-add"></i>
        <a
            v-if="item.dir"
            :href="`/?path=${item.path}`">{{ item.name }}</a>
        <span
            v-else>{{ item.name }}</span>
      </li>
    </ul>
    <vue-context
        ref="menu">
      <li @click="goPath" v-if="contextRow.dir">打开</li>
      <li @click="rowCommand('download')" v-else>下载</li>
      <li @click="rowCommand('share')" v-if="type === 'home'">分享</li>
      <li @click="rowCommand('favorite')">{{ contextRow.mark ? '取消' : '' }}收藏</li>
      <li @click="rowCommand('move')">移动到</li>
      <li @click="rowCommand('copy')">复制到</li>
      <li @click="rowCommand('rename')">重命名</li>
      <li @click="rowCommand('delete')" v-if="type === 'home'">删除</li>
    </vue-context>
  </div>
</template>

<script>
import {
  VueContext,
} from 'vue-context';

export default {
  name: 'FileGrid',
  components: {
    VueContext,
  },
  props: {
    type: {
      type: String,
      default: 'home',
    },
    data: Array,
  },
  data() {
    return {
      contextRow: {},
    };
  },
  methods: {
    showContextMenu(event, item) {
      this.$refs.menu.open(event);
      this.contextRow = item;
      return item;
    },
    goPath() {
      const { path } = this.contextRow;
      this.$router.push(`/?path=${path}`);
    },
    rowCommand(command) {
      const row = this.contextRow;
      this.$emit('command', {
        command,
        row,
      });
    },
  },
};
</script>

<style
    src="./grid.scss"
    lang="scss"
    scoped></style>
