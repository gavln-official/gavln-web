<template>
  <div class="file-grid">
    <div class="check">
      <el-checkbox>全选</el-checkbox>
    </div>
    <ul>
      <li
          v-for="item in data"
          :key="item.id">
        <i class="iconfont icon-folder-add"></i>
        <a
            v-if="item.type === 'folder'"
            :href="`/?path=${item.id}`">{{ item.name }}</a>
        <span
            v-else>{{ item.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import {
  Checkbox,
} from 'element-ui';

export default {
  name: 'FileGrid',
  components: {
    'el-checkbox': Checkbox,
  },
  props: {
    data: Array,
  },
};
</script>

<style
    src="./grid.scss"
    lang="scss"
    scoped></style>
