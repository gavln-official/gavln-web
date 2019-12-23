<template>
  <div class="search-input">
    <input
        type="search"
        v-model="value"
        @keydown="keydown">
    <i
        class="iconfont icon-search"
        @click="search"></i>
  </div>
</template>

<script>
export default {
  name: 'SearchInput',
  data() {
    return {
      value: '',
    };
  },
  watch: {
    value(newValue, oldValue) {
      if (oldValue
          && !newValue) {
        this.search();
      }
    },
  },
  methods: {
    keydown(event) {
      if (event.key === 'Enter') {
        this.search();
      }
    },
    search() {
      this.$emit('search', this.value);
    },
  },
};
</script>

<style
    src="./index.scss"
    lang="scss"
    scoped></style>
