<template>
  <div class="search-input">
    <input
        type="search"
        v-model="value"
        ref="input"
        @keydown="keydown">
    <i
        class="iconfont icon-search"
        @click="search"></i>
  </div>
</template>

<script>
export default {
  name: 'SearchInput',
  props: {
    text: String,
  },
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
  created() {
    this.value = this.text
      || '';
  },
  methods: {
    keydown(event) {
      if (event.key === 'Enter') {
        this.search();
      }
    },
    search() {
      const data = {
        name: 'search',
        query: {
          q: this.value,
        },
      };

      if (this.$route.name === 'search') {
        this.$router.replace(data);
      } else {
        this.$router.push(data);
      }
    },
  },
};
</script>

<style
    src="./index.scss"
    lang="scss"
    scoped></style>
