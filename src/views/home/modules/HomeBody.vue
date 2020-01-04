<template>
  <div class="home-body">
    <el-card class="box-card mid shadow">
      <div class="company-msg mid">
        <img width="48px" :src="images.grayHead" alt="头像" />
        <span class="company-name">{{company}}</span>
      </div>
      <!--  -->
      <div
        :style="`background-image:url('${images.moneyBg}')`"
        class="account-money-box color-white"
      >
        <div class="accouint-title">现金账户</div>
        <div
          class="account-val font-number"
          v-loading
        >¥ {{$tools.toThousands(accountBalance / 100)}}</div>
      </div>
      <el-button class="create-put" type="primary" icon="el-icon-plus" @click="ToPathPlan">创建投放计划</el-button>
    </el-card>
    <el-card class="box-card no-data mid-center shadow">
      <div>
        <img :src="images.noData" alt="无数据" />
        <div class="description text-center">
          <p>更多功能即将上线</p>
          <p>敬请期待</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getUserInfo, setUserInfo } from "@/utils/auth";

export default {
  data() {
    return {
      company: "",
      accountBalance: "",
      images: {
        userHead: require("../../../assets/images/icons/icon_tx.png"),
        grayHead: require("../../../assets/images/icons/icon_head portrait.png"),
        moneyBg: require("../../../assets/images/icon_money_bg_red.png"),
        noData: require("../../../assets/images/icon_no_data.png")
      }
    };
  },
  mounted: async function() {
    //请求验证码接口
    let userInfo = await this.$store.getters.refreshUserInfo;
    this.accountBalance = userInfo.accountBalance;
    this.company = userInfo.company;
    if (userInfo.avatar) {
      this.images.grayHead = userInfo.avatar;
    }
  },
  methods: {
    ToPathPlan() {
      this.$router.push("putManage/create/plan");
    }
  }
};
</script>

<style lang="scss" scoped>
.home-body {
  width: 1200px;
  margin: 0 auto;
  .box-card {
    position: relative;
    .company-msg {
      float: left;
      height: 100px;
      .company-name {
        margin: 0 33px 0 14px;
        width: 168px;
        font-size: 14px;
        color: rgba(24, 24, 25, 1);
      }
    }
    .accouint-title {
      height: 14px;
      font-size: 14px;
      line-height: 14px;
    }
    .account-money-box {
      float: left;
      padding: 28px 24px;
      width: 282px;
      height: 124px;
      border-radius: 2px;
      background-size: cover;
      .account-val {
        margin-top: 19px;
        height: 26px;
        line-height: 26px;
        font-size: 26px;
        font-weight: normal;
      }
    }
    .create-put {
      position: absolute;
      top: 73px;
      right: 30px;
      box-shadow: 3px 4px 14px 0px rgba(44, 98, 253, 0.3);
    }
    &.no-data {
      height: calc(100vh - 305px);
      .description {
        font-size: 18px;
        color: #979eba;
      }
    }
  }
}
</style>
