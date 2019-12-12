<template>
  <el-dialog
      class="url-dialog"
      :visible="visible"
      width="480px"
      title="上传本地文件"
      @close="close">
    <el-form
        ref="form"
        label-width="80px"
        :model="form"
        :rules="formRules"
        :disabled="uploading">
      <el-form-item
          label="文件">
        <el-upload
            action=""
            :before-upload="doNothing"
            :on-change="onSelect">
          <span> {{ label }}</span>
        </el-upload>
      </el-form-item>
      <el-form-item
          label="文件名">
        <el-input
            v-model="form.name" />
      </el-form-item>
    </el-form>
    <div
        slot="footer">
      <el-button
          :disabled="uploading"
          @click="close">取消</el-button>
      <el-button
          :disabled="uploading"
          @click="upload">上传</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  Dialog,
  Form,
  FormItem,
  Upload,
  Input,
  Button,
} from 'element-ui';

import FileAPI from '../../../api/file';
import Utils from '../../../utils/index';

export default {
  name: 'UploadDialog',
  components: {
    'el-dialog': Dialog,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-upload': Upload,
    'el-input': Input,
    'el-button': Button,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    path: String,
  },
  data() {
    return {
      file: null,

      form: {
        name: '',
        ext: '',
      },
      formRules: {
        name: [{
          required: true,
          message: '请填写文件名',
          trigger: 'blur',
        }],
      },

      uploading: false,
    };
  },
  computed: {
    label() {
      if (this.file) {
        return this.file.name;
      }

      return '未选择文件';
    },
    fullName() {
      let {
        name,
      } = this.form;
      if (this.form.ext) {
        name = `${name}.${this.form.ext}`;
      }

      return name;
    },
    fullPath() {
      let {
        path,
      } = this;

      if (!path.endsWith('/')) {
        path = `${path}/`;
      }

      if (this.fullName) {
        path = `${path}${this.fullName}`;
      }

      return path;
    },
  },
  methods: {
    close() {
      if (this.uploading) {
        return;
      }

      this.$emit('close');
    },
    doNothing() {
      return false;
    },
    getFileName(file) {
      const data = Utils.parseFileName(file.name);

      this.form.name = data.name;
      this.form.ext = data.ext;
    },
    onSelect(file) {
      this.file = file
          && file.raw;
      this.getFileName(file);
    },
    upload() {
      if (this.uploading
          || !this.file) {
        return;
      }

      this.$refs.form
        .validate((valid) => {
          if (!valid) {
            return;
          }

          this.uploading = true;

          FileAPI.upload(this.file, this.fullPath, this.fullName)
            .then(() => {
              this.$emit('success');
            })
            .finally(() => {
              this.uploading = false;
            });
        });
    },
  },
};
</script>
