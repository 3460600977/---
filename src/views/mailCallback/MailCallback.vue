<!-- 广告主邮件支付回调 -->
<template>
  <div v-loading="loading" element-loading-text="请稍候" class="mail-callback mid-center">
    <transition name="to-top">
      <div v-show="!loading" class="mail-callback-box">
        <div class="title center font-20 bold">
          <template v-if="callbackData.success">支付成功</template>
          <template v-if="!callbackData.success">支付失败</template>
        </div>

        <el-divider></el-divider>

        <div class="message">
          <!-- 成功 -->
          <template v-if="callbackData.success">
            <div class="success-box">
              <p class="account">支付金额: ¥ <span class="font-number">{{$tools.toThousands(callbackData.data.account / 100)}}</span></p>
              <p class="balance">账户余额: ¥ <span class="font-number">{{$tools.toThousands(callbackData.data.balance / 100)}}</span></p>
            </div>
          </template>

          <!-- 失败 -->
          <template v-if="!callbackData.success">
            <div class="fail-box text-center">
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
        success: false,
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
          this.callbackData = {
            success: true,
            data: res.result
          };
          this.loading = false;
        })
        .catch(err => {
          this.callbackData = {
            success: false,
            msg: err.msg
          };
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
    .mail-callback-box{
      border-radius: 2px;
      box-shadow: 0 0 40px rgba(0, 0, 0, 0.2);
      padding: 30px;
      width: 500px;
      >.message{
        padding: 30px 70px 50px;
        .success-box{
          .account,.balance{
            line-height: 20px;
          }
        }
      }
    }
  }
</style>