<template>
  <el-dialog
      class="url-dialog"
      :visible="visible"
      width="480px"
      title="上传链接">
    <el-form
        label-width="80px">
      <el-form-item
          label="输入链接">
        <el-input
            placeholder="http://" />
      </el-form-item>
    </el-form>
    <div
        slot="footer">
      <el-button>取消</el-button>
      <el-button>上传</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'UrlDialog',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
};
</script>
