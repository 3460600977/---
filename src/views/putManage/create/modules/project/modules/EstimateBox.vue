<template>
  <!-- 投放预估数 -->
  <div class="estimate-box">
    <div class="font16">楼盘预估数</div>
    <div class="relative mid-between">
      <div class="estimate-number-box">
        <p class="color-text-1 estimate-title">楼盘数</p>
        <p class="font-14 estimate-number">
          <span class="bold font-18">34563456</span>个
        </p>
      </div>
      <div class="estimate-number-box">
        <p class="color-text-1 estimate-title">设备数</p>
        <p class="font-14 estimate-number">
          <span class="bold font-18">678567</span>个
        </p>
      </div>
    </div>

    <div class="estimate-dash-board-box">
      <DashBoard :total="43" :value="443" :displayData="443"/>
    </div>

    <div class="estimate-price-box font-16">
      <span>价格预估: </span>
      <span class="font-number color-main">¥ {{$tools.toThousands(3456)}}</span>
    </div>
  </div>
</template>

<script>
import DashBoard from '../../../../../../components/chart/DashBoard'
export default {
  components: {
    DashBoard
  }
}
</script>

<style lang="scss" scoped>
  .estimate-box{
    position: fixed;
    top: 18vh;
    right: 60px;
    padding: 20px 20px 25px;
    z-index: 1;
    width:312px;
    height:460px;
    background:rgba(255,255,255,1);
    border:1px solid rgba(229,231,233,1);
    box-shadow:0px 4px 16px 0px rgba(118,118,118,0.16);
    .estimate-number-box{
      &+.estimate-number-box{
        left: 175px;
      }
      position: absolute;
      margin-top: 55px;
      .estimate-number{
        margin-top: 6px;
      }
    }
    .estimate-dash-board-box{
      position: absolute;
      top: 150px;
      left: 77px;
      width: 154px;
      height: 154px;
    }
    .estimate-price-box{
      position: absolute;
      bottom: 0px;
      width: 272px;
      padding: 21px 0 26px;
      border-top: 1px solid #E5E7E9;
    }
  }
</style>