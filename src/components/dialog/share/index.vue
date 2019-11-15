<template>
  <el-dialog
      class="share-dialog"
      :visible="visible"
      width="640px"
      :title="title">
    <el-form
        label-width="80px">
      <el-form-item
          label="分享形式:">
        <el-radio-group
            class="type"
            v-model="form.type">
          <el-radio
              label="encrypt">有密码&nbsp;&nbsp;仅限拥有密码者可查看，更加隐私安全</el-radio>
          <el-radio
              label="open">无密码&nbsp;&nbsp;无需密码，仅拥有链接的用户可以查看</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
          label="有效期:">
        <el-radio-group
            class="duration"
            v-model="form.duration">
          <el-radio
              :label="0">永久有效</el-radio>
          <el-radio
              :label="30">30天</el-radio>
          <el-radio
              :label="7">7天</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div
        slot="footer">
      <el-button>取消</el-button>
      <el-button>创建链接</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  Dialog,
  Form,
  FormItem,
  RadioGroup,
  Radio,
  Button,
} from 'element-ui';

export default {
  name: 'ShareDialog',
  components: {
    'el-dialog': Dialog,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-radio-group': RadioGroup,
    'el-radio': Radio,
    'el-button': Button,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: {
        type: 'encrypt',
        duration: 0,
      },
    };
  },
  computed: {
    title() {
      const type = this.data.type === 'folder'
        ? '文件夹'
        : '文件';

      return `分享${type}: ${this.data.name}`;
    },
  },
};
</script>

<style
    src="./index.scss"
    lang="scss"
    scoped></style>
