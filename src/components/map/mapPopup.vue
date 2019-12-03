<template>
    <div class="mapPopup color-text">
      <p class="buildingName wrapper">选点2</p>
      <div class="wrapper">
        <div class="content">
          <div class="clearfix">
            <div class="float-left buldingNum">
              <p class="color-text-1">楼盘数</p>
              <p><span class="font-number">20</span>个</p>
            </div>
            <div class="float-left buldingNum">
              <p class="color-text-1">设备数</p>
              <p><span class="font-number">20</span>个</p>
            </div>
          </div>
          <p class="color-text-1 predict">预估覆盖人次<span class="color-text">200,00</span></p>
        </div>
        <div class="location">
          <p class="location-name">茂业中心</p>
          <p class="color-text-1">四川成都市武侯区天福达背离A段 家具和大海</p>
        </div>
        <div class="mid-between slider">
          <span class="color-text-1 text">半径</span>
          <div class="flex1">
            <el-slider v-model="value" :min="0" :max="2000"></el-slider>
            <ul class="font-number mid-between">
              <li>1km</li>
              <li class="flex1 text-center">3km</li>
              <li>5km</li>
            </ul>
          </div>
        </div>
      </div>
      <p class="info border-bottom wrapper">建议最少半径：<span class="color-text-1">3KM，低于该半径广告投放效果可能受到影响。</span></p>
      <div class="wrapper">
btn
      </div>
    </div>
</template>

<script>
  export default {
    name: "mapPopup",
    data() {
      return {
        value: 500
      }
    },
    watch: {
      value(val) {
        this.$emit('change', val)
      }
    },
    methods: {

    }
  }
</script>

<style scoped lang='scss'>
  .wrapper {
    padding: 0 14px;
  }
  .mapPopup {
    width: 240px;
    background: #fff;
    font-family:Microsoft YaHei;
    font-size:14px;
    .buildingName {
      line-height: 44px;
      font-size: 16px;
      color:rgba(24,24,25,1);
      border-bottom: 1px solid rgba(229,231,233,1);
    }
    .content {
      margin: 15px 0 10px;
      background:rgba(45,90,255,0.05);
      border-radius:0px 4px 0px 0px;
      padding: 12px 15px;
      .buldingNum {
        margin-right: 30px;
      }
      .predict {
        margin-top: 12px;
      }
    }
    .location-name {
      margin-bottom: 6px;
    }
    .slider {
      & /deep/ .el-slider__runway {
        margin: 20px 0 8px;
      }
      .text {
        margin-right: 4px;
        margin-top: 12px;
        align-self: flex-start;
      }
      ul {
        width: 100%;
        position: relative;
        color: $color-text-1;
      }
    }
    .info {
      margin-top: 20px;
    }
  }
</style>
