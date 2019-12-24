<template>
  <div class="share-file">
    <div class="header">
      <el-button>
        <i class="iconfont icon-download"></i>
        <span>保存到网盘</span>
      </el-button>
      <el-button>
        <i class="iconfont icon-download"></i>
        <span>下载({{ data.size | filesize }})</span>
      </el-button>
    </div>
    <div class="content">
      <div class="file">
        <i class="iconfont icon-folder-add"></i>
        <span>{{ data.name }}</span>
      </div>
      <div class="info">文件大小: {{ data.size | filesize }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShareFile',
  props: {
    data: Object,
  },
};
</script>

<style
    src="./file.scss"
    lang="scss"
    scoped></style>
