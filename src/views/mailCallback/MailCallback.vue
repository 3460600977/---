<!-- 广告主邮件支付回调 -->
<template>
  <div v-loading="loading" element-loading-text="请稍候" class="mail-callback mid-center">
    <transition name="to-top">
      <div v-show="!loading" class="mail-callback-box">
        <div class="title font-14 bold mid-center">
          <template v-if="callbackData.success">
            <i class="iconfont icon--zhengque-shiti color-main"></i>
            支付成功
          </template>
          <template v-if="!callbackData.success">
            <i class="iconfont icon-error color-main"></i>
            支付失败
          </template>
        </div>


        <div class="message">
          <!-- 成功 -->
          <template v-if="callbackData.success">
            <div class="success-box">
              <p class="account">支付金额：<span class="color-main">¥ <span class="font-number font-18">{{$tools.toThousands(callbackData.data.account / 100)}}</span>
                </span>
              </p>
              <p class="balance">账户余额：¥ <span class="font-number font-18">{{$tools.toThousands(callbackData.data.balance / 100)}}</span></p>
            </div>
          </template>

          <!-- 失败 -->
          <template v-if="!callbackData.success">
            <div class="message-box color-text-1">
              {{callbackData.msg}}
            </div>
          </template>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,

      callbackData: {
        title: '',
        success: true,
        data: null,
        msg: null
      }
    }
  },

  beforeMount() {
    this.mailConfirm()
  },

  methods: {
    mailConfirm() {
      let mailNum = this.$route.query.mailNum;
      if (!mailNum) return;

      this.$api.PutProject.ConfirmMail(mailNum)
        .then(res => {
          /**
           * 广告主邮件支付状态码过滤
           * 100002 支付失败
           * 100204 失效
           * 100103 过期
           * 100106 已支付
           */
          switch (res.code) {
            case 100001:
              this.callbackData = {
                title: '支付成功',
                success: true,
                msg: res.result
              };
              break;


            case 100002:
              this.callbackData = {
                title: '支付失败',
                success: false,
                msg: res.msg
              };
              break;


            case 100204:
              this.callbackData = {
                success: false,
                msg: res.msg
              };
              break;


            case 100103:
              this.callbackData = {
                success: false,
                msg: res.msg
              };
              break;


            case 100106:
              this.callbackData = {
                success: false,
                msg: res.msg
              };
              break;
          

            default:
              break;
          }
          console.log(this.callbackData)
          this.loading = false;
        })
        .catch(err => {
          // console.log(2)
          // this.callbackData = {
          //   success: false,
          //   msg: err.msg
          // };
          this.loading = false;
        })
    }
  },
}
</script>

<style lang="scss" scoped>
  .mail-callback{
    height: 100%;
    width: 100%;
    background-image: url('../../assets/images/mail_bg.png');
    background-size: cover;
    background-position: center;
    .mail-callback-box{
      position: relative;
      box-shadow:0px 8px 16px 2px rgba(67,3,3,0.1);
      padding: 72px 0 0;
      width:568px;
      height:280px;
      background-color: #fff;
      >.title{
        >.iconfont{
          font-size: 30px;
          margin-right: 20px;
        }
      }
      >.message{
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        margin-top: 60px;
        .message-box{
          position: relative;
          color: $color-table-title;
          line-height: 20px;
        }
        .success-box{
          .account,.balance{
            margin-bottom: 20px;
          }
        }
      }
    }
  }
</style>