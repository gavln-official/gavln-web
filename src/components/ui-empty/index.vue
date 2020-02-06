<template>
  <div class="ui-empty">
    <img
        :src="currentIcon">
    <slot></slot>
  </div>
</template>

<script>
import defaultIcon from '../../assets/empty/default.svg';
import star from '../../assets/empty/star.svg';
import share from '../../assets/empty/share.svg';
import trash from '../../assets/empty/trash.svg';
import search from '../../assets/empty/search.svg';

export default {
  name: 'UiEmpty',
  props: {
    icon: String,
  },
  data() {
    return {
      icons: {
        default: defaultIcon,
        star,
        share,
        trash,
        search,
      },
    };
  },
  computed: {
    currentIcon() {
      if (this.icon
        && this.icons[this.icon]) {
        return this.icons[this.icon];
      }

      return this.icons.default;
    },
  },
};
</script>

<style
    src="./index.scss"
    lang="scss"
    scoped></style>
