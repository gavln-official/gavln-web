<template>
  <div class="share-verify">
    <div class="header">
      <img src="" />
      <h2>
        <strong>Gavln</strong>
        <span>知其白，守其黑</span>
      </h2>
    </div>
    <div class="content">
      <p class="message">意*鱼i给您分享了加密文件</p>
      <div class="form">
        <span class="label">请输入提取码：</span>
        <div class="form-item">
          <div class="input">
            <el-input />
          </div>
          <el-button type="primary">提取文件</el-button>
        </div>
        <span class="error">提取码错误</span>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Input,
  Button,
} from 'element-ui';

export default {
  name: 'ShareVerify',
  components: {
    'el-input': Input,
    'el-button': Button,
  },
};
</script>

<style
    src="./verify.scss"
    lang="scss"
    scoped></style>
