<template>
  <div class="home-body">
    <el-card class="box-card mid">
      <div class="company-msg mid">
        <img width="48px" :src="images.userHead" alt="">
        <span class="company-name">成都新潮传媒集团有限公司 媒集团有限公司</span>
      </div>
      <!--  -->
      <div :style="`background-image:url('${images.moneyBg}')`" class="account-money-box color-white">
        <div class="accouint-title">现金账户</div>
        <div class="account-val font-number">{{$tools.toThousands(10000.01)}}</div>
      </div>
      <div :style="`background-image:url('${images.moneyBg}')`" class="account-money-box color-white">
        <div class="accouint-title">信用账户</div>
        <div class="account-val font-number">{{$tools.toThousands(1000)}}</div>
      </div>
      <el-button class="create-put" type="primary" icon="el-icon-plus">创建投放方案</el-button>
    </el-card>
    <el-card class="box-card no-data mid-center">
      <div>
        <img :src="images.noData" alt="无数据">
        <div class="description text-center">
          <p>更多功能即将上线</p>
          <p>敬请期待</p>
        </div>
      </div>
    </el-card>

  </div>
</template>

<script>
export default {
  data(){
    return {
      images: {
        userHead: require('../../../assets/images/icons/icon_tx.png'),
        moneyBg: require('../../../assets/images/icon_money_bg.png'),
        noData: require('../../../assets/images/icon_no_data.png')
      }
    }
  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
.home-body{
  width: 1200px;
  margin: 0 auto;
  .box-card{
    position: relative;
    .company-msg{
      float: left;
      height: 100px;
      .company-name{
        margin: 0 14px;
        width:168px;
        font-size:14px;
        color:rgba(24,24,25,1);
      }
    }
    .accouint-title{
      height: 14px;
      font-size: 14px;
      line-height: 14px;
    }
    .account-money-box{
      float: left;
      padding: 18px 18px 30px;
      margin-left: 30px;
      width:258px;
      height:100px;
      // background:linear-gradient(-56deg,rgba(106,118,255,1) 0%,rgba(97,80,255,1) 100%);
      box-shadow:3px 4px 14px 0px rgba(45,90,255,0.3);
      border-radius:2px;
      background-size: cover;
      .account-val{
        margin-top: 19px;
        height:26px;
        line-height:26px;
        font-size:26px;
        font-weight:normal;
      }
    }
    .create-put{
      position: absolute;
      top: 73px; 
      right: 30px;
      box-shadow:3px 4px 14px 0px rgba(44,98,253,0.3);
    }
    &.no-data{
      height: calc(100vh - 305px);
      .description{
        font-size: 18px;
        color: #979EBA;
      }
    }
  }
}
  
</style>