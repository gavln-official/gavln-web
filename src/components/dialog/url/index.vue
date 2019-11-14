<template>
  <el-dialog
      class="url-dialog"
      :visible="visible"
      width="480px">
    <div class="header">
      <h3>上传链接</h3>
    </div>
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
import {
  Dialog,
  Form,
  FormItem,
  Input,
  Button,
} from 'element-ui';

export default {
  name: 'UrlDialog',
  components: {
    'el-dialog': Dialog,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-input': Input,
    'el-button': Button,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
};
</script>
