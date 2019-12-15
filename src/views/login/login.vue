<template>
  <div class="login-page">
    <div class="login-box">
      <div class="box-center" v-bind:style="{ width: loginFormWidth +'px' }">
        <div class="xinchao-logo" v-bind:style="{ width: loginImageWidth +'px' }">
          <el-image :src="logo_img" class="login-image"
                    v-bind:style="{ width: loginImageWidth +'px'}" fit="cover">
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
                    <el-input v-model="loginForm.username" placeholder="请输入账户"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-input v-model="loginForm.password" placeholder="请输入密码"></el-input>
                  </el-form-item>
                  <el-form-item class="loginCapture">
                    <el-input v-model="loginForm.capture" placeholder="请输入验证码"></el-input>
                    <div class="captureNum">

                    </div>
                  </el-form-item>
                  <el-form-item size="large">
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
                noteBookWidth: 1920,
                noteBookConstWidth: 1536,
                noteBookMinWidth: 1200,
                logo_img: require('../../assets/images/icon_left@2x.png'),
                loginForm: {
                    username: '',
                    password: '',
                    capture: ''
                },
            }
        },
        computed: {
            // 计算属性的 getter
            loginImageWidth: function () {
                // `this` 指向 vm 实例
                let width = 442;
                let loginWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                let loginHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                let scaleWidthPercent = 442 / 1920;
                if (loginWidth <= this.noteBookMinWidth) {
                    width = scaleWidthPercent * this.noteBookConstWidth;
                } else if (loginWidth <= this.noteBookWidth) {
                    width = scaleWidthPercent * loginWidth;
                }
                return width;
            },
            loginFormWidth: function () {
                return this.loginImageWidth * 2 + 50;
            }
        },
        methods: {
            onSubmit() {

            }
        }
    }
</script>

<style lang="scss">
  .login-page {
    width: 100%;
    height: 100%;
    background-position: center center;
    background-image: url('../../assets/images/img_bg@2x.png');
    background-repeat: no-repeat;
    background-size: cover;

    .login-box {
      height: 100%;

      .box-center {
        position: relative;
        margin: 0 auto;
        top: 25%;
      }
    }

    .xinchao-logo {
      position: absolute;
      z-index: 3;
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
      }

      .loginForm {
        margin-top: 44px;
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
      }

      .loginCapture {
        .el-input__inner {
          width: 220px;
          height: 36px;
        }
      }
    }
  }
</style>
