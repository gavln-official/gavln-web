<template>
  <header class="frame-header">
    <el-button-group>
      <el-button
          type="text">
        <i class="iconfont icon-arrow-l-left"></i>
      </el-button>
      <el-button
          type="text">
        <i class="iconfont icon-arrow-l-right"></i>
      </el-button>
    </el-button-group>
    <div class="right">
      <img src="">
      <span>Gavln</span>
      <el-button
          type="text">
        <i class="iconfont icon-power"></i>
      </el-button>
    </div>
  </header>
</template>

<script>
import {
  ButtonGroup,
  Button,
} from 'element-ui';

export default {
  name: 'FrameHeader',
  components: {
    'el-button-group': ButtonGroup,
    'el-button': Button,
  },
};
</script>

<style
    src="./header.scss"
    lang="scss"
    scoped></style>
