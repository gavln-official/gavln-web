<template>
  <div class="search-input">
    <input
        type="search"
        v-model="value"
        ref="input"
        @keydown="keydown"
        @focus="showConfig">
    <i
        class="iconfont icon-search"
        @click="search"></i>
    <div
        class="config"
        v-show="showConfigPanel"
        v-click-outside="hideConfig">
      <el-form>
        <el-form-item
            label="目录:">
          <el-radio-group
              class="duration"
              v-model="config.path">
            <el-radio
                label="all">全部</el-radio>
            <el-radio
                label="current">当前</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
            label="格式:">
          <el-input
              v-model="config.suffixs"
              placeholder="以空格分隔"
              clearable />
        </el-form-item>
        <el-form-item
            label="开始时间:">
          <el-date-picker
              v-model="config.start"
              type="date"
              format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item
            label="结束时间:">
          <el-date-picker
              v-model="config.end"
              type="date"
              format="yyyy-MM-dd" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchInput',
  data() {
    return {
      value: '',
      showConfigPanel: false,
      config: {
        path: 'all',
        suffixs: '',
        start: null,
        end: null,
      },
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
    showConfig() {
      this.showConfigPanel = true;
    },
    hideConfig(event) {
      if (event
          && event.target !== this.$refs.input) {
        this.showConfigPanel = false;
      }
    },
    search() {
      this.hideConfig();

      this.$emit('search', this.value, this.config);
    },
  },
};
</script>

<style
    src="./index.scss"
    lang="scss"
    scoped></style>
