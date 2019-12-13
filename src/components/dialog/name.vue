<template>
  <el-dialog
      :visible="visible"
      :title="data.action === 'create'
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
  Dialog,
  Form,
  FormItem,
  Input,
  Button,
} from 'element-ui';

import FileAPI from '../../api/file';
import Utils from '../../utils/index';

export default {
  name: 'NameDialog',
  components: {
    'el-dialog': Dialog,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-input': Input,
    'el-button': Button,
  },
  props: {
    visible: Boolean,
    data: Object,
  },
  data() {
    return {
      form: {
        name: '',
        ext: '',
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
  computed: {
    fullName() {
      let {
        name,
      } = this.form;
      if (!this.data.dir) {
        name = `${name.trim()}.${this.form.ext}`;
      }

      return name;
    },
  },
  mounted() {
    if (this.data.dir) { // folder
      this.form.name = this.data.name;
    } else { // file
      const data = Utils.parseFileName(this.data.name);

      this.form.name = data.name;
      this.form.ext = data.ext;
    }
  },
  methods: {
    close() {
      if (this.uploading) {
        return;
      }

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

          if (this.data.action === 'create') {
            this.createPath();
          } else {
            this.updatePath();
          }
        });
    },
    createPath() {
      const path = /\/$/.test(this.data.path)
        ? `${this.data.path}${this.form.name}`
        : `${this.data.path}/${this.form.name}`;

      FileAPI.createPath(path.trim())
        .then(() => {
          this.$emit('success');
        })
        .finally(() => {
          this.saving = false;
        });
    },
    updatePath() {
      FileAPI.updatePath(this.data.path, this.fullName)
        .then(() => {
          this.$emit('success');
        })
        .finally(() => {
          this.saving = false;
        });
    },
  },
};
</script>
