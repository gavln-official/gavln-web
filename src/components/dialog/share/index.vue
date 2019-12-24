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
        class="link"
        v-if="step === 'success'">
      <div class="info">
        <i class="iconfont icon-check-o"></i>
        <div class="message">成功创建链接</div>
        <div class="duration">{{ form.duration ? `${form.duration}天后失效` : '永久有效' }}</div>
      </div>
      <div class="url">
        <span class="copy">{{ shareData.url }}</span>
        <el-button
            @click="copyLink">{{ form.type === 'encrypt' ? '复制链接及密码' : '复制链接' }}</el-button>
      </div>
      <div
          class="code"
          v-if="form.type === 'encrypt'">
        <span>提取码:</span>
        <span class="copy">{{ shareData.code }}</span>
      </div>
    </div>
    <div
        slot="footer">
      <template
          v-if="step === 'create'">
        <el-button
            :disabled="saving"
            @click="close">取消</el-button>
        <el-button
            :disabled="saving"
            @click="share">创建链接</el-button>
      </template>
      <template
          v-if="step === 'success'">
        <el-button
            @click="close">关闭</el-button>
      </template>
    </div>
  </el-dialog>
</template>

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
        ? '文件夹'
        : '文件';

      return `分享${type}: ${this.data.name}`;
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

      const time = !this.form.duration
        ? 0
        : Math.round((Date.now()
          + this.form.duration * 1000 * 60 * 60 * 24) / 1000);
      const code = this.form.type === 'encrypt'
        ? Utils.randomCode(4)
        : '';

      this.saving = true;

      FileAPI.share(this.data.path, time, code)
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

        this.$message.success('复制成功');
      } catch (error) {
        this.$message.error('复制失败，请手动复制');
      }
    },
  },
};
</script>

<style
    src="./index.scss"
    lang="scss"
    scoped></style>
