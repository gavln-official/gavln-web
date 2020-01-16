<!-- eslint-disable -->
<template>
  <div class="file-grid">
    <ul class="grids">
      <li
          v-for="item in data"
          :key="item.path"
          @contextmenu.prevent="showContextMenu($event, item)">
        <i class="iconfont icon-folder-add"></i>
        <a
            v-if="type !== 'favorite' && item.dir"
            :href="`/?path=${item.path}`">{{ item.name }}</a>
        <span
            v-else>{{ item.name }}</span>
      </li>
    </ul>
    <vue-context
        ref="menu">
      <template v-if="type === 'home'">
        <li
            v-if="contextRow.dir"
            @click="goPath">{{ $t('open') }}</li>
        <li
            v-else
            @click="rowCommand('download')">{{ $t('download') }}</li>
        <li
            @click="rowCommand('share')">{{ $t('share') }}</li>
      </template>
      <li
          @click="rowCommand('move')">{{ $t('move-to') }}</li>
      <li
          @click="rowCommand('copy')">{{ $t('copy-to') }}</li>
      <li
          @click="rowCommand('rename')">{{ $t('rename') }}</li>
      <li
          @click="rowCommand('favorite')">{{ contextRow.mark ? $t('remove-from-fav') : $t('add-to-fav') }}</li>
      <li
          v-if="type === 'home'"
          @click="rowCommand('delete')">{{ $t('delete') }}</li>
    </vue-context>
  </div>
</template>
<!-- eslint-enable -->

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
