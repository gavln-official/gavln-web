<template>
  <el-dialog
      class="url-dialog"
      :visible="visible"
      width="480px"
      :title="$t('url-dialog.upload-from-url')">
    <el-form
        label-width="80px">
      <el-form-item
          :label="$t('url-dialog.url')">
        <el-input
            placeholder="http://" />
      </el-form-item>
    </el-form>
    <div
        slot="footer">
      <el-button>{{ $t('cancel') }}</el-button>
      <el-button>{{ $t('upload') }}</el-button>
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
