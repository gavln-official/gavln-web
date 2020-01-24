<template>
  <el-dialog
      class="upload-dialog"
      :visible="visible"
      width="480px"
      :title="$t('upload-dialog.upload-local-file')"
      :close-on-click-modal="!uploading"
      @close="close">
    <el-form
        ref="form"
        label-width="80px"
        :model="form"
        :rules="formRules"
        :disabled="uploading">
      <el-form-item
          :label="$t('upload')">
        <el-upload
            action=""
            :before-upload="doNothing"
            :on-change="onSelect">
          <span> {{ label }}</span>
        </el-upload>
      </el-form-item>
      <el-form-item
          :label="$t('file-name')">
        <el-input
            v-model="form.name" />
      </el-form-item>
    </el-form>
    <div
        slot="footer">
      <el-button
          :disabled="uploading"
          @click="close">{{ $t('cancel') }}</el-button>
      <el-button
          :disabled="uploading"
          @click="upload">{{ $t('upload') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import FileAPI from '../../../api/file';
import Utils from '../../../utils/index';

export default {
  name: 'UploadDialog',
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
          message: this.$t('form-message.filename-required'),
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

      return this.$t('upload-dialog.no-file-selected');
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
    async upload() {
      if (this.uploading
          || !this.file) {
        return;
      }

      this.$refs.form
        .validate((valid) => {
          if (!valid) {
            return;
          }
          this.close();
          this.$message.info(this.$t('upload-dialog.prepare-upload'));
          FileAPI.upload(this.file, this.fullPath, this.fullName);
          this.$emit('success');
          this.$router.push('/upload');
        });
    },
  },
};
</script>
