<!-- eslint-disable -->
<template>
  <el-dialog
      class="share-dialog"
      :visible="visible"
      width="640px"
      :title="title"
      @close="close">
    <el-form
        label-width="120px"
        v-if="step === 'create'">
      <el-form-item
          :label="$t('share-dialog.type')">
        <el-radio-group
            class="type"
            v-model="form.type">
          <el-radio
              label="encrypt">{{ $t('share-dialog.encrypt') }}&nbsp;&nbsp;{{ $t('share-dialog.encrypt-info') }}</el-radio>
          <el-radio
              label="open">{{ $t('share-dialog.open') }}&nbsp;&nbsp;{{ $t('share-dialog.open-info') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
          :label="$t('share-dialog.duration')">
        <el-radio-group
            class="duration"
            v-model="form.duration">
          <el-radio
              :label="0">{{ $t('share-dialog.forever') }}</el-radio>
          <el-radio
              :label="30">30{{ $t('days') }}</el-radio>
          <el-radio
              :label="7">7{{ $t('days') }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div
        class="link"
        v-if="step === 'success'">
      <div class="info">
        <i class="iconfont icon-check-o"></i>
        <div class="message">{{ $t('share-dialog.create-success') }}</div>
        <div class="duration">{{ form.duration ? $t('share-dialog.expired-in', [form.duration]) : $t('share-dialog.forever') }}</div>
      </div>
      <div class="url">
        <span class="copy">{{ shareData.url }}</span>
        <el-button
            @click="copyLink">{{ form.type === 'encrypt' ? $t('share-dialog.copy-url-and-code') : $t('share-dialog.copy-url') }}</el-button>
      </div>
      <div
          class="code"
          v-if="form.type === 'encrypt'">
        <span>{{ $t('share-dialog.code') }}</span>
        <span class="copy">{{ shareData.code }}</span>
      </div>
    </div>
    <div
        slot="footer">
      <template
          v-if="step === 'create'">
        <el-button
            :disabled="saving"
            @click="close">{{ $t('cancel') }}</el-button>
        <el-button
            :disabled="saving"
            @click="share">{{ $t('share-dialog.create-url') }}</el-button>
      </template>
      <template
          v-if="step === 'success'">
        <el-button
            @click="close">{{ $t('close') }}</el-button>
      </template>
    </div>
  </el-dialog>
</template>
<!-- eslint-enable -->

<script>
import Utils from '../../../utils/index';

import FileAPI from '../../../api/file';

export default {
  name: 'ShareDialog',
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
      // create | success
      step: 'create',
      form: {
        type: 'encrypt',
        duration: 0,
      },
      shareData: {
        url: '',
        code: '',
      },
      saving: false,
    };
  },
  computed: {
    title() {
      const type = this.data.dir
        ? this.$t('folder')
        : this.$t('file');

      return `${this.$t('share')}${type}: ${this.data.name}`;
    },
  },
  methods: {
    close() {
      if (this.saving) {
        return;
      }

      this.$emit('close');
    },
    share() {
      if (this.saving) {
        return;
      }

      const code = this.form.type === 'encrypt'
        ? Utils.randomCode(4)
        : '';

      this.saving = true;

      FileAPI.share(this.data.path, this.form.duration, code)
        .then((res) => {
          this.shareData = {
            url: `${window.location.origin}/s/${res.data.rand}`,
            code,
          };

          this.step = 'success';
        })
        .finally(() => {
          this.saving = false;
        });
    },
    copyLink() {
      const text = this.form.type === 'encrypt'
        ? `${this.shareData.url} ${this.shareData.code}`
        : this.shareData.url;

      try {
        Utils.copyToClipboard(text);

        this.$message.success(this.$t('copy-success'));
      } catch (error) {
        this.$message.error(this.$t('share-dialog.copy-fail'));
      }
    },
  },
};
</script>

<style
    src="./index.scss"
    lang="scss"
    scoped></style>
