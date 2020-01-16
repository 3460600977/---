<template>
  <div
    v-loading="pageLoading"
    class="login-page"
    v-bind:style="{ backgroundImage: 'url('+this.loginBackgroundImage+')'}"
  >
    <div v-if="(!isSaleLogin && !isAuditorLogin) || !pageLoading" class="login-box">
      <div class="box-center">
        <div class="xinchao-logo" v-bind:style="{ width: imageWidth +'px' }">
          <img :src="logo_img" class="login-image" v-bind:style="{ width: imageWidth +'px'}" />
        </div>
        <div class="logo-form" v-bind:style="{ width: loginFormWidth +'px' }">
          <el-container>
            <el-aside width="50%">
              <div class="left-form-box"></div>
            </el-aside>
            <el-main>
              <div class="login-form-box">
                <h3 class="login-title">欢迎登录</h3>
                <label class="login-des">HI,欢迎使用生活圈智投平台</label>
                <el-form ref="loginForm" :model="loginForm" class="loginForm" :rules="rules">
                  <el-form-item prop="username">
                    <el-input v-model.trim="loginForm.username" placeholder="请输入账户">
                      <i slot="prefix" class="iconfont icon-yonghu"></i>
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="password" class="loginPass">
                    <el-input
                      :type="passType"
                      v-model.trim="loginForm.password"
                      placeholder="请输入密码"
                    >
                      <i slot="prefix" class="iconfont icon-suo"></i>
                      <i slot="suffix" :class="classObject" @click="changePassType"></i>
                    </el-input>
                  </el-form-item>
                  <el-form-item class="loginCapture" prop="verifyValue">
                    <el-input
                      maxlength="4"
                      minlength="4"
                      v-model.trim="loginForm.verifyValue"
                      placeholder="请输入验证码"
                      @keyup.enter.native="onSubmit('loginForm')"
                    >
                      <i slot="prefix" class="iconfont icon-suo"></i>
                    </el-input>
                    <div class="captureNum mid" @click="changeCaptureNUm">
                      <img :src="login_capture_img" alt="点击刷新" />
                    </div>
                  </el-form-item>
                  <el-form-item :class="{'submit-login':true}">
                    <el-button
                      type="primary"
                      @click="onSubmit('loginForm')"
                      plain
                      :loading="loading"
                    >登录</el-button>
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
import { setUserInfo, setMenuList } from "@/utils/auth";
import { normalMenuList } from "@/utils/static";
export default {
  name: "login",
  data() {
    var checkVerify = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else if (value.length !== 4) {
        callback(new Error("验证码长度不一致"));
      } else {
        callback();
      }
    };

    return {
      normalMenuList,
      imageWidth: 442,
      logo_img: require("@/assets/images/icon_red@2x.png"),
      logo_back_img: require("@/assets/images/icon_bg@2x.png"),
      login_capture_img: "",
      loginForm: {
        username: "",
        password: "",
        verifyToken: "",
        verifyValue: ""
      },
      loading: false,
      pageLoading: true, // 整个页面转圈, 跳转登录用
      classObject: {
        iconfont: true,
        "icon-yanjing": true,
        "icon-icon-eye": false
      },
      passChange: true,
      passType: "password", //密码框类型
      rules: {
        username: [
          {
            required: true,
            message: "请输入账号名",
            trigger: ["blur", "change"]
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: ["blur", "change"] }
        ],
        verifyValue: [{ trigger: ["blur", "change"], validator: checkVerify }]
      },
      toolMenu: [
        { code: "1010", selected: true },
        { code: "1101", selected: true },
        { code: "1102", selected: true },
        { code: "1110", selected: true },
        { code: "1120", selected: true },
        { code: "1201", selected: true },
        { code: "1210", selected: true },
        { code: "1330", selected: true },
        { code: "1340", selected: true },
        { code: "1421", selected: true }
      ]
    };
  },

  computed: {
    loginFormWidth: function() {
      return this.imageWidth * 2 + 20;
    },

    isSaleLogin() {
      return (
        !!this.$route.query.advertiserId && !!this.$route.query.saleAccessToken
      );
    },

    isAuditorLogin() {
      return !!this.$route.query.blmToken;
    },

    loginBackgroundImage() {
      let url =
        this.isSaleLogin ||
        this.isAuditorLogin ||
        require("@/assets/images/icons/icon_bg@2x.png");
      return url;
    }
  },

  beforeMount() {
    // 销售登录
    if (this.isSaleLogin) {
      return this.saleLogin();
    }

    // 审核登录
    if (this.isAuditorLogin) {
      return this.auditorLogin();
    }

    this.pageLoading = false;
  },

  mounted() {
    if (!this.isSaleLogin || !this.isAuditorLogin) {
      this.changeCaptureNUm();
    }
  },

  methods: {
    //密码的隐藏和展示
    changePassType() {
      if (this.passType === "text") {
        this.passType = "password";
        //更换图标
        this.classObject["icon-yanjing"] = true;
        this.classObject["icon-icon-eye"] = false;
      } else {
        this.passType = "text";
        this.classObject["icon-yanjing"] = false;
        this.classObject["icon-icon-eye"] = true;
      }
    },

    onSubmit(formName) {
      //登录表框的验证
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false;
        } else {
          let param = {
            username: this.loginForm.username,
            password: this.loginForm.password,
            verifyToken: this.loginForm.verifyToken,
            verifyValue: this.loginForm.verifyValue
          };
          //请求登录接口
          this.loading = true;

          this.$api.Login.LoginIn(param)
            .then(res => {
              let info = res.result;
              this.loading = false;
              this.$store.commit("setToken", info.token);
              setUserInfo(info);
              let menuList = this.$tools.getAllMenuList(info.menu, []);
              let audit = false;
              menuList.forEach(item => {
                if (item.code === "1600" && item.selected) {
                  audit = true;
                }
              });
              if (audit) {
                setMenuList(menuList);
                this.$router.push({ path: "/auditList", query: {} });
              } else {
                this.toolMenu.forEach(item => {
                  menuList.push({ code: item.code, selected: item.selected });
                });
                setMenuList(menuList);

                this.$router.push({ path: "/home", query: {} });
              }
            })
            .catch(res => {
              this.changeCaptureNUm();
              this.loading = false;
            });
        }
      });
    },

    // 销售登录
    saleLogin() {
      let param = {
        advertiserId: this.$route.query.advertiserId,
        saleAccessToken: this.$route.query.saleAccessToken
      };
      this.$api.Login.SaleLogin(param)
        .then(res => {
          let info = res.result;
          let menuList = this.$tools.getAllMenuList(info.menu, []);
          let result = this.checkSaleMenu(menuList);
          if (result) {
          } else {
            this.$message.error("当前销售人员权限不足，请联系管理员");
            return false;
          }
          this.toolMenu.forEach(item => {
            menuList.push({ code: item.code, selected: item.selected });
          });
          setMenuList(menuList);
          this.$store.commit("setToken", info.token);
          setUserInfo(info);
          this.$router.replace("/home");
        })
        .catch(res => {
          this.pageLoading = false;
        });
    },

    // 审核登录
    auditorLogin() {
      let param = {
        blmToken: this.$route.query.blmToken
      };
      this.$api.Login.AuditorLogin(param)
        .then(res => {
          let info = res.result;
          let menuList = this.$tools.getAllMenuList(info.menu, []);
          let result = this.checkAuditorMenu(menuList);
          if (result) {
          } else {
            this.$message.error("当前审核人员没有审核权限，请联系管理员");
            return false;
          }
          setMenuList(menuList);
          this.$store.commit("setToken", info.token);
          setUserInfo(info);
          this.$router.replace("/auditList");
        })
        .catch(res => {
          this.pageLoading = false;
        });
    },

    //请求验证码接口
    changeCaptureNUm() {
      this.$api.Login.GetVerifyCode()
        .then(res => {
          if (window.ActiveXObject || "ActiveXObject" in window) {
            this.login_capture_img = res.result.image;
          } else {
            this.login_capture_img = res.result.image;
          }
          this.loginForm.verifyToken = res.result.verifyToken;
        })
        .catch(res => {});
    },

    // 审核人员菜单权限验证
    checkAuditorMenu(menuList) {
      let result = menuList.find(item => {
        return +item.code === 1600 && item.selected;
      });
      return result;
    },

    // 销售人员菜单权限验证
    checkSaleMenu(menuList) {
      let result = true;
      for (let i = 0; i < menuList.length; i++) {
        //判断除了审核，其他菜单是否有权限
        if (
          +menuList[i].code !== 1600 &&
          +menuList[i].code !== 1610 &&
          !menuList[i].selected
        ) {
          result = false;
          break;
        }
      }
      return result;
    }
  }
};
</script>

<style lang="scss" scoped>
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
      top: 16%;
      width: 800px;
      height: 520px;
      background: $color-bg-3;
      box-shadow: 0px 20px 50px 0px $color-shadow-6;
      border-radius: 14px;
    }
  }
  .xinchao-logo {
    position: absolute;
    z-index: 3;
    top: -6.5%;
    left: -0.6%;
  }
  .logo-form {
    width: 800px;
    height: 520px;
    background: $color-bg-3;
    border-radius: 14px;
    margin-right: 30px;
    /deep/ .el-input__inner {
      background-color: transparent;
    }
    /deep/ .el-form-item {
      margin-bottom: 30px;
      i.iconfont {
        font-size: 14px;
      }
    }
    .login-title {
      font-size: 32px;
      font-weight: 300;
      color: $color-table-title;
      margin-top: 32px;
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
      /deep/ .el-input__prefix {
        left: 19px;
        top: 0px;
        height: 16px;
      }
      /deep/ .el-input--prefix .el-input__inner {
        padding-left: 42px;
      }
    }
    /deep/ .el-input {
      width: 320px;
      height: 36px;
    }
    /deep/ .el-input__inner {
      width: 320px;
      height: 36px;
      border-radius: 18px;
      background-color: $color-bg-3;
    }
    /deep/ .is-error .el-input__inner {
      border: 1px solid $color-main !important;
    }
    /deep/ input::-webkit-input-placeholder {
      font-size: 14px;
      font-weight: 300;
      color: $color-text-1;
    }
    .loading-button button {
      border: none;
    }
    .loginPass {
      /deep/ .el-input__suffix {
        cursor: pointer;
        right: 21px;
      }
    }
    .loginCapture {
      margin-bottom: 0;
      display: flex;
      /deep/ .el-input {
        float: left;
        width: 220px;
        height: 36px;
      }
      /deep/ .el-input__inner {
        width: 220px;
        height: 36px;
      }
      /deep/ .el-form-item__content {
        display: flex;
        align-items: center;
      }
      .captureNum {
        float: left;
        width: 90px;
        height: 36px;
        display: inline-block;
        margin-left: 12px;
        position: relative;
        .el-image {
          position: absolute;
          top: -20px;
        }
        img {
          width: 100%;
          height: 32px;
          cursor: pointer;
        }
      }
    }
    .submit-login {
      button {
        margin-bottom: 0;
        width: 320px;
        height: 40px;
        border-radius: 20px;
        margin: 86px 0 68px 0;
        span {
          font-size: 14px !important;
        }
      }
    }
  }
}
</style>