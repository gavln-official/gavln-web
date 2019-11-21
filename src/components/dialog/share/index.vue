<template>
  <el-dialog
      class="share-dialog"
      :visible="visible"
      width="640px"
      :title="title">
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
        <div class="duration">7天后失效</div>
      </div>
      <div class="url">
        <span class="copy">{{ share.url }}</span>
        <el-button
            @click="copyLink">{{ form.type === 'encrypt' ? '复制链接及密码' : '复制链接' }}</el-button>
      </div>
      <div
          class="code"
          v-if="form.type === 'encrypt'">
        <span>提取码:</span>
        <span class="copy">{{ share.code }}</span>
      </div>
    </div>
    <div
        slot="footer">
      <template
          v-if="step === 'create'">
        <el-button>取消</el-button>
        <el-button>创建链接</el-button>
      </template>
      <template
          v-if="step === 'success'">
        <el-button>关闭</el-button>
      </template>
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
  Message,
} from 'element-ui';

import Utils from '../../../utils/index';

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
      // create | success
      step: 'create',
      form: {
        type: 'encrypt',
        duration: 0,
      },
      share: {
        url: 'https://gavln.com/s/bvhfkdsnvkjon5TsNHnKAXQ',
        code: 'm8yw',
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
  methods: {
    copyLink() {
      let text = this.share.url;
      if (this.form.type === 'encrypt') {
        text = `${this.share.url} ${this.share.code}`;
      }

      try {
        Utils.copyToClipboard(text);

        Message.success('复制成功');
      } catch (error) {
        Message.error('复制失败，请手动复制');
      }
    },
  },
};
</script>

<style
    src="./index.scss"
    lang="scss"
    scoped></style>
