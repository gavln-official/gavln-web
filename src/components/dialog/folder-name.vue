<template>
  <el-dialog
      :visible="visible"
      :title="folderData.action === 'create'
        ? '新建目录'
        : '重命名目录'"
      width="480px"
      @close="close">
    <el-form
        label-width="60px"
        :disabled="saving"
        :model="form"
        :rules="formRules"
        ref="form">
      <el-form-item
          label="名称"
          prop="name">
        <el-input
            v-model="form.name" />
      </el-form-item>
    </el-form>
    <div
        slot="footer">
      <el-button
          :disabled="saving"
          @click="close">取消</el-button>
      <el-button
          :disabled="saving"
          @click="saveFolder">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  Message,
  Dialog,
  Form,
  FormItem,
  Input,
  Button,
} from 'element-ui';

import FileAPI from '../../api/file';

export default {
  name: 'FolderNameDialog',
  components: {
    'el-dialog': Dialog,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-input': Input,
    'el-button': Button,
  },
  props: {
    visible: Boolean,
    folderData: Object,
  },
  data() {
    return {
      form: {
        name: '',
      },
      formRules: {
        name: [{
          required: true,
          message: '请填写目录名称',
          trigger: 'blur',
        }],
      },
      saving: false,
    };
  },
  methods: {
    close() {
      this.$emit('close');
    },
    saveFolder() {
      if (this.saving) {
        return;
      }

      this.$refs.form
        .validate((valid) => {
          if (!valid) {
            return;
          }

          this.saving = true;

          if (this.folderData.action === 'create') {
            this.createPath();
          } else {
            this.updatePath();
          }
        });
    },
    createPath() {
      const path = /\/$/.test(this.folderData.path)
        ? `${this.folderData.path}${this.form.name}`
        : `${this.folderData.path}/${this.form.name}`;

      FileAPI.createPath(path)
        .then((res) => {
          console.log(res);
          this.$emit('success');
        })
        .catch((error) => {
          console.log(error);
          Message.error('保存失败');
        })
        .finally(() => {
          this.saving = false;
        });
    },
    updatePath() {
      FileAPI.updatePath(this.folderData.path, this.form.name)
        .then((res) => {
          console.log(res);
          this.$emit('success');
        })
        .catch((error) => {
          console.log(error);
          Message.error('保存失败');
        })
        .finally(() => {
          this.saving = false;
        });
    },
  },
};
</script>
