<template>
  <div class="page-article">
    <page-header />
    <div class="page-content">
      <keep-alive>
        <component
            v-bind:is="content" />
      </keep-alive>
    </div>
    <page-footer />
  </div>
</template>

<script>
import Storage from '../../utils/storage';

import PageHeader from '../../components/page-frame/header.vue';
import PageFooter from '../../components/page-frame/footer.vue';

import IntroCn from './content/cn/intro.vue';
import EulaCn from './content/cn/eula.vue';
import PrivacyCn from './content/cn/privacy.vue';

import IntroEn from './content/en/intro.vue';
import EulaEn from './content/en/eula.vue';
import PrivacyEn from './content/en/privacy.vue';

export default {
  name: 'PageLogin',
  components: {
    PageHeader,
    PageFooter,
    IntroCn,
  },
  computed: {
    name() {
      return this.$route.params.name;
    },
    content() {
      const components = {
        cn: {
          intro: IntroCn,
          eula: EulaCn,
          privacy: PrivacyCn,
        },
        en: {
          intro: IntroEn,
          eula: EulaEn,
          privacy: PrivacyEn,
        },
      };

      const locale = Storage.get('locale')
        || 'cn';

      if (components[locale]
          && components[locale][this.name]) {
        return components[locale][this.name];
      }

      return null;
    },
  },
};
</script>

<style
    src="./index.scss"
    lang="scss"></style>
