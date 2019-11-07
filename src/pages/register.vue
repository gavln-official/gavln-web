<template>
  <page-frame>
    <div class="ui-login">
      <div class="content">
        <div class="form">
          <form-content-register />
        </div>
        <div class="img">
          <img
              src="https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&h=500&q=80"
              alt="logo">
        </div>
      </div>
    </div>
  </page-frame>
</template>

<script>
import PageFrame from '../components/page-frame/index.vue';
import FormContentRegister from '../components/ui-login/register.vue';

export default {
  name: 'PageRegister',
  components: {
    PageFrame,
    FormContentRegister,
  },
};
</script>

<style
    src="./login/index.scss"
    lang="scss"
    scoped></style>
