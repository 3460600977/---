<template>
  <div class="login-page" v-bind:style="{ backgroundImage: 'url('+this.logo_back_img+')'}">
    <div class="login-box">
      <div class="box-center" v-bind:style="{ width: loginFormWidth +'px' }">
        <div class="xinchao-logo" v-bind:style="{ width: imageWidth +'px' }">
          <el-image :src="logo_img" class="login-image"
                    v-bind:style="{ width: imageWidth +'px'}" fit="cover">
          </el-image>
        </div>
        <div class="logo-form" v-bind:style="{ width: loginFormWidth +'px' }">
          <el-container>
            <el-aside width="50%">
              <div class="left-form-box"></div>
            </el-aside>
            <el-main>
              <div class="login-form-box">
                <h3 class="login-title">欢迎登录</h3>
                <label class="login-des">HI,欢迎使用新潮传媒-数字化刊播平台</label>
                <el-form ref="loginForm" :model="loginForm" class="loginForm">
                  <el-form-item>
                    <el-input prefix-icon="el-icon-user-solid"
                              v-model="loginForm.username" placeholder="请输入账户"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-input prefix-icon="el-icon-lock"
                              v-model="loginForm.password" show-password placeholder="请输入密码"></el-input>
                  </el-form-item>
                  <el-form-item class="loginCapture">
                    <el-input prefix-icon="el-icon-lock"
                              v-model="loginForm.capture" placeholder="请输入验证码"></el-input>
                    <div class="captureNum">
                      <img :src="login_capture_img" @click="changeCaptureNUm"/>
                    </div>
                  </el-form-item>
                  <el-form-item class="submit-login">
                    <el-button type="primary" @click="onSubmit" plain>登录</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-main>
          </el-container>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: 'login',
        data() {
            return {
                imageWidth: 442,
                logo_img: require('../../assets/images/icon_left@2x.png'),
                logo_back_img: require('../../assets/images/img_bg@2x.png'),
                login_capture_img: 'data:image/png;base64,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',
                loginForm: {
                    username: '',
                    password: '',
                    capture: ''
                },
            }
        },
        computed: {
            loginFormWidth: function () {
                return this.imageWidth * 2 + 20;
            }
        },
        methods: {
            onSubmit() {

            },
            changeCaptureNUm() {

            }
        }
    }
</script>

<style lang="scss">
  .login-page {
    width: 100%;
    height: 100%;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;

    .login-box {
      height: 100%;

      .box-center {
        position: relative;
        margin: 0 auto;
        top: 18%;
      }
    }

    .xinchao-logo {
      position: absolute;
      z-index: 3;
      top: -12.5%;
      left: -0.6%;
    }

    .logo-form {
      background: $color-bg-3;
      border-radius: 14px;

      .login-title {
        font-size: 32px;
        font-weight: 300;
        color: $color-table-title;
      }

      .login-des {
        font-size: 14px;
        font-weight: 300;
        color: $color-text-1;
        display: inline-block;
        margin-top: 18px;
      }

      .loginForm {
        margin-top: 44px;
      }

      .el-input {
        width: 320px;
        height: 36px;
      }

      .el-input__inner {
        width: 320px;
        height: 36px;
        background-color: $color-bg-8;
        border-radius: 18px;
      }

      input::-webkit-input-placeholder {
        font-size: 14px;
        font-weight: 300;
        color: $color-text-1;
      }

      .el-button {
        width: 320px;
        height: 40px;
        background: $color-bg-3;
        border: 1px solid $color-blue;
        border-radius: 20px;
        margin: 50px 0;
      }

      .loginCapture {
        margin-bottom: 0;
        display: flex;

        .el-input, .el-input__inner {
          display: inline-block;
          width: 220px;
          height: 36px;
        }

        .captureNum {
          width: 90px;
          display: inline-block;
          margin-left: 22px;
          position: absolute;
          top: 7%;

          img {
            width: 100%;
            cursor: pointer;
          }
        }
      }

      .submit-login {
        margin-bottom: 0;
      }
    }
  }
</style>
