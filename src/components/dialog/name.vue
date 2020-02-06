<template>
  <el-dialog
      :visible="visible"
      :title="title"
      width="480px"
      append-to-body
      @close="close">
    <el-form
        label-width="80px"
        :disabled="saving"
        :model="form"
        :rules="formRules"
        ref="form">
      <el-form-item
          :label="$t('name')"
          prop="name">
        <el-input
            v-model="form.name" />
      </el-form-item>
    </el-form>
    <div
        slot="footer">
      <el-button
          :disabled="saving"
          @click="close">{{ $t('cancel') }}</el-button>
      <el-button
          :disabled="saving"
          @click="saveFolder">{{ $t('save') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import FileAPI from '../../api/file';
import Utils from '../../utils/index';

export default {
  name: 'NameDialog',
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
          message: this.$t('form-message.foldername-required'),
          trigger: 'blur',
        }],
      },
      saving: false,
    };
  },
  computed: {
    title() {
      const action = this.data.action === 'create'
        ? this.$t('create')
        : this.$t('rename');
      const name = this.data.dir
        ? this.$t('folder')
        : this.$t('file');

      return `${action}${name}`;
    },
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
