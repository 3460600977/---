<!-- 广告主邮件支付回调 -->
<template>
  <div v-loading="loading" element-loading-text="请稍候" class="mail-callback mid-center">
    <div class="mail-callback-box">
      <div class="title center font-20 bold">
        <template v-if="callbackData.success">支付成功</template>
        <template v-if="!callbackData.success">失败</template>
      </div>

      <el-divider></el-divider>

      <div class="message">
        {{callbackData.data.msg}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,

      callbackData: null
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
          this.loading = false;
          this.callbackData = {
            success: true,
            data: res
          };
        })
        .catch(err => {
          this.callbackData = {
            success: false,
            data: err
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
      >.message{
        padding: 50px;
      }
    }
  }
</style>