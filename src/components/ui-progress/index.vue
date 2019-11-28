<template>
  <div class="ui-progress">
    <el-progress
        :percentage="percentage"
        :show-text="false" />
    <p class="message">{{ message }}</p>
  </div>
</template>

<script>
import {
  Progress,
} from 'element-ui';

export default {
  name: 'UiProgress',
  components: {
    'el-progress': Progress,
  },
  props: {
    percentage: Number,
    message: String,
  },
};
</script>

<style
    src="./index.scss"
    lang="scss"
    scoped></style>
