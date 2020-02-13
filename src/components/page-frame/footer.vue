<template>
  <footer class="page-footer">
    <ul class="links">
      <li>
        <a href="/article/eula">{{ $t('page-frame.eula') }}</a>
      </li>
      <li>
        <a href="/article/privacy">{{ $t('privacy') }}</a>
      </li>
    </ul>
  </footer>
</template>

<script>
export default {
  name: 'PageFooter',
};
</script>

<style
    src="./footer.scss"
    lang="scss"
    scoped></style>
