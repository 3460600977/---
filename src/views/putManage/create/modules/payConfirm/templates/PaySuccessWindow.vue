<!-- 支付成功弹窗 -->
<template>
  <el-dialog
    :beforeClose="backToList"    
    :visible.sync="show"
    class="my-confirm-dialog my-dialog dialog-mid"
    width="568px">

    <div class="confirm-title mid" slot="title">
      <i class="icon color-red iconfont icon--zhengque-shiti"></i>
      <div class="info">
        <p class="font-16">支付成功</p>
        <p class="font-14 color-text-1 mt-10">提示：请及时上传广告创意，若未及时上传，投放方案将自动取消</p>
      </div>
    </div>

    <div class="font-14">
      <span>支付金额：</span>
      <span class="color-red">¥ <span class="font-18 font-number">{{this.$tools.toThousands(account / 100)}}</span></span>
    </div>

    <div style="margin-top: 23px;" class="font-14">
      <span>账户余额：</span>
      <span class="color-red">¥ <span class="font-18 font-number">{{this.$tools.toThousands(balance / 100)}}</span></span>
    </div>
    <span slot="footer" class="dialog-footer mid-center">
      <el-button style="width: 100px" @click="backToList">返回列表</el-button>
      <el-button style="width: 100px; margin-left: 60px" type="primary" @click="uploadCreative">上传创意</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },

    account: {
      type: Number
    },
    
    balance: {
      type: Number
    },

  },

  methods: {
    // 去编辑创意
    uploadCreative() {
      this.$router.replace({
        path: '/putManage/create/creative',
        query: {
          projectId: this.$route.query.projectId,
          createType: 'step'
        }
      })
    },

    // 返回列表
    backToList() {
      this.$router.replace({
        path: '/putManage',
        query: {
          'active': 'project'
        }
      })
    },
  },
}
</script>