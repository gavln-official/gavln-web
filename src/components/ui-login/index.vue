<template>
  <div class="ui-login">
    <el-row>
      <el-col
          :span="12">form</el-col>
      <el-col
          :span="12">image</el-col>
    </el-row>
  </div>
</template>

<script>
import {
  Row,
  Col,
} from 'element-ui';

export default {
  name: 'UiLogin',
  components: {
    'el-row': Row,
    'el-col': Col,
  },
  props: {
    // 类型（register: 注册, login: 登录）
    type: {
      validator: (value) => {
        const values = [
          'register',
          'login',
        ];

        return (values.indexOf(value) >= 0);
      },
    },
  },
};
</script>
