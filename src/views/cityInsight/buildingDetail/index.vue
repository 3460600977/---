<template>
    <div class="building-detail">
      <div class="info">
        <div class="left">
          <div class="img">

          </div>
          <ul class="ul margin1">
            <li class="border-right padding-right">
              <p class="color-main font-number font-22">42</p>
              <p class="color-text-1">楼栋数</p>
            </li>
            <li class="border-right padding-right padding-left">
              <p class="color-main font-number font-22">42</p>
              <p class="color-text-1">单元数</p>
            </li>
            <li class="padding-left">
              <p class="color-main font-number font-22">42</p>
              <p class="color-text-1">可售设备数</p>
            </li>
          </ul>
        </div>
        <div class="right flex1">
          <div class="title">
            <span class="font-20 bold">成都新潮传媒集团有限公司</span>
            <span class="type margin-left-20">中高端住宅</span>
          </div>
          <p class="color-text-1 margin-top-20">四川省成都市新潮传媒集团有限公司媒集团有限公司</p>
          <div class="margin-top-60">
            <ul class="ul">
              <li class="width">入住时间：<span class="font-16 font-number color-text">2010-12-02</span></li>
              <li class="width">入住率：<span class="font-16 font-number color-text">81%</span></li>
              <li>覆盖人数：<span class="font-16">约</span><span class="font-16 font-number color-text margin2">2010-12-02</span><span class="font-16">人</span></li>
            </ul>
            <ul class="ul">
              <li class="width">入住时间：<span class="font-16 font-number color-text">2010-12-02</span></li>
              <li class="width">入住率：<span class="font-16 font-number color-text">81%</span></li>
              <li>覆盖人数：<span class="font-16">约</span><span class="font-16 font-number color-text margin2">2010-12-02</span><span class="font-16">人</span></li>
            </ul>
            <ul class="ul">
              <li class="width">最低楼层：<span class="font-16 font-number color-text margin3">2010-12-02</span><span class="font-16">层</span></li>
              <li class="width">最高楼层：<span class="font-16 font-number color-text margin3">81%</span><span class="font-16">层</span></li>
              <li class="width">物业费：<span class="font-16 font-number color-text margin3">81%</span><span class="font-16">元/平方米/月</span></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="charts mid-row margin6">
        <div class="margin5 box1 box margin4 margin3 mid-column">
          <p class="title">性别比例</p>
          <div class="content flex1 mid-center">
            <div class="sex-ratio container1">
              <ratio-chart
                :height="25"
                :dataArr="sexArr"
              ></ratio-chart>
            </div>
          </div>
        </div>
        <div class="margin5 box2 box margin3 mid-column">
          <p class="title">年龄分布</p>
          <div class="fullContainer">
            <histogram width="100%" height="100%"></histogram>
          </div>
<!--          <div class="container2 container"></div>-->
        </div>
        <div class="margin5 box2 box margin3">
          <p class="title">年龄分布</p>
          <div class="fullContainer">
            <pie width="100%" height="100%"></pie>
          </div>
<!--          <div class="container3 container"></div>-->
        </div>
        <div class="margin5 box3 box margin4 margin3">
          <div class="container4 container"></div>
        </div>
        <div class="margin5 box3 box margin3">
          <div class="container4 container"></div>
        </div>
        <div class="margin5 box2 box margin3">
          <div class="container5 container"></div>
        </div>
        <div class="margin5 box4 box margin4 margin3">
          <div class="container6 container"></div>
        </div>
        <div class="margin5 box4 box margin3">
          <div class="container7 container"></div>
        </div>
      </div>
    </div>
</template>

<script>
  import RatioChart from "../../../components/chart/RatioChart";
  import Histogram from "../../../components/chart/Histogram";
  import pie from "../../../components/chart/pie";
  export default {
    name: "index",
    components: {
      RatioChart,
      Histogram,
      pie
    },
    data() {
      return {
        sexArr: [
          {value: 10, textStyle: 'color: rgba(45,90,255,1);textAlign: left', style: 'background:linear-gradient(270deg,rgba(95,129,255,1),rgba(45,90,255,1));' +
              'box-shadow:0px 10px 17px 3px rgba(45,90,255,0.2);'},
          {value: 50, textStyle: 'color: rgba(244,102,74,1);textAlign: right', style: 'background:linear-gradient(-90deg,rgba(244,74,74,1),rgba(244,102,74,1));' +
              'box-shadow:0px 10px 17px 3px rgba(242,126,86,0.2);'},
        ]
      }
    }
  }
</script>

<style scoped lang='scss'>
.building-detail {
  line-height: 1.15;
  .margin3 {
    margin-right: 2.08%;
  }
  .margin4 {
    margin-left: 2.08%;
  }
  .margin5 {
    margin-top: 2.08%;
  }
  .margin6 {
    margin-bottom: 2.08%;
  }
  .info {
    display: flex;
    flex-direction: row;
    padding: 30px 0 30px 80px;
    background: #fff;
    box-shadow:0px 4px 16px 0px rgba(139,139,139,0.16);
    .margin1 {
      margin-top: 36px;
    }
    .margin2 {
      margin: 0 6px;
    }
    .margin3 {
      margin-right: 6px;
    }
    .padding-left {
      padding-left: 33px;
    }
    .padding-right {
      padding-right: 33px;
    }
    .left {
      width: 290px;
      .img {
        width: 100%;
        height: 180px;
        background: red;
      }
      .ul {
        font-size: 0;
        li {
          display: inline-block;
          font-size: 14px;
          text-align: center;
        }
        .color-text-1 {
          margin-top: 10px;
          font-weight: 400;
        }
      }
    }
    .right {
      margin-left: 55px;
      padding-top: 10px;
      .ul {
        font-size: 0;
        margin-top: 30px;
        /*.width {*/
        /*  width: 360px;*/
        /*}*/
        li {
          width: 33.333%;
          font-size: 14px;
          display: inline-block;
          color: $color-text-1;
        }
      }
      .type {
        width:90px;
        height:24px;
        display: inline-block;
        text-align: center;
        border:1px solid $color-main;
        color: $color-main;
        line-height: 24px;
        border-radius:0px 12px 0px 12px;
      }
    }
  }
  .charts {
    box-sizing: content-box;
    background: $color-bg;
    flex-wrap: wrap;
    .sex-ratio {
      width: 300px;
    }
    .title {
      position: absolute;
      font-weight: bold;
      top: 20px;
      left: 20px;
      padding-left: 10px;
      border-left: 3px solid $color-main;
    }
    .box {
      background:#fff;
      position: relative;
      box-shadow:0px 4px 16px 0px rgba(139,139,139,0.16);
      border-radius:8px;
      height: 290px;
      flex-wrap: wrap;
    }
    .container {
      background: #000000;
      height: 200px;
    }
    .fullContainer {
      height: 100%;
      width: 100%;
    }
    .box1 {
      width: 22.92%;
    }
    .box2 {
      width: 34.37%;
    }
    .box3 {
      width: 28.64%;
    }
    .box4 {
      width: 46.87%;
    }
    .container1 {
      width: 68.18%;
      /*width: 300px;*/
    }
    .container2 {
      /*width: 74.24%;*/
      height: 100%;
      width: 100%;
    }
    .container3 {
      width: 66.66%;
    }
    .container4 {
      width: 66.36%;
    }
    .container5 {
      width: 72.72%;
    }
    .container6 {
      width: 77.78%;
    }
    .container7 {
      width: 56.66%;
    }
  }
}
</style>
