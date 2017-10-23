
<style lang="scss" scoped>
@import '../styles/style-config.scss';
.m-login {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: r(15);
  .logo-box {
    margin: r(40) auto r(30);
    text-align: center;
    .logo {
      width: r(290);
      height: r(200);
      margin-bottom: r(20);
      @include image('../assets/icons/login-logo.png')
    }
    .title {
      margin-bottom: r(6);
      @include font($font_large, $color_f1);
    }
    .slogan {
      @include font($font_normal, $color_f2);
    }
  }
  .login-form {
    width: 100%;
    .item {
      border-bottom: 1px solid $color_b; // height: r(50);
      input {
        display: block;
        width: 100%;
        height: r(50);
        padding: r(15) r(40);
        background-position: 0% center;
        background-repeat: no-repeat;
        background-size: r(28) r(28);
        @include font($font_normal, $color_f2);
        &::-webkit-input-placeholder {
          color: $color_f3;
        }
      }
    }
    .username {
      input {
        background-image: url('../assets/icons/login-username.png');
      }
    }
    .password {
      input {
        background-image: url('../assets/icons/login-password.png');
      }
    }
    .login-btn {
      margin-top: r(30);
      button {
        display: block;
        width: 100%;
        height: r(45);
        border-radius: r(5);
        @include font($font_normal,
        #fff);
        background-color: $color_main;
      }
    }
  }
  .copy {
    margin-top: r(30);
    text-align: center;
    @include font($font_small,
    $color_f3);
  }
}
</style>

<template>
  <!-- 登录组件 -->
  <div class="m-login">
    <!-- Logo -->
    <div class="logo-box">
      <div class="logo"></div>
      <p class="title">商家助手</p>
      <p class="slogan">专为车商设计的管理平台</p>
    </div>
    <!-- /Logo -->

    <!-- 登录表单 -->
    <div class="login-form">
      <div class="item username">
        <input type="text" v-model="formData.username" placeholder="请输入您的账号">
      </div>
      <div class="item password">
        <input type="password" v-model="formData.password" placeholder="请输入您的密码">
      </div>
      <div class="login-btn">
        <button @click="login">登录</button>
      </div>
    </div>
    <!-- /登录表单 -->
    <!-- 版权 -->
    <div class="copy">
      <span>云程科技 · 技术支持</span>
    </div>
    <!-- /版权 -->
  </div>
  <!-- /登录组件 -->
</template>

<script>
import CONFIG from '../config/config'

export default {
  name: 'LoginPage',
  components: {},
  data() {
    return {
      formData: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    login(e) {
      let { username, password } = this.formData
      if (username === '' || password === '') {
        this.$toast('请填写账号及密码')
        return
      }
      console.log(123)
      this.$axios({
        url: CONFIG.HOST + '/org/employee/login',
        method: 'post',
        data: this.formData
      }).then(res => { console.log(res) })
    }
  }
}
</script>
