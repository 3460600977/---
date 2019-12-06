<template>
    <div class="mapPopup color-text">
      <p class="buildingName wrapper">选点{{item.index+1}}</p>
      <div class="wrapper">
        <div class="content">
          <div class="clearfix">
            <div class="float-left buldingNum">
              <p class="color-text-1">楼盘数</p>
              <p><span class="font-number font-16">{{item.buildings.length}}</span>个</p>
            </div>
            <div class="float-left buldingNum">
              <p class="color-text-1">设备数</p>
              <p><span class="font-number font-16">{{item.deviceCount}}</span>个</p>
            </div>
          </div>
          <p class="color-text-1 predict">预估覆盖人次 <span class="color-text font-number font-16">{{item.coveredPeople}}</span></p>
        </div>
        <div class="location" v-if="item.type === 'circle'">
          <p class="location-name">茂业中心</p>
          <p class="color-text-1">四川成都市武侯区天福达背离A段 家具和大海</p>
        </div>
        <div class="mid-between slider" v-if="item.type !== 'polygon'">
          <span class="color-text-1 text">半径</span>
          <div class="flex1">
            <el-slider v-model="value" :min="0" :max="5000" @change="sliderChange"></el-slider>
            <ul class="font-number mid-between">
              <li :class="{'active': value === 1000}">1km</li>
              <li :class="{'active': value === 3000}" class="flex1 text-center">3km</li>
              <li :class="{'active': value === 5000}">5km</li>
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
        value: 3000,
      }
    },
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    watch: {
      item(val) {
        this.value = val.radius
        console.log(val)
      }
    },
    methods: {
      sliderChange(val) {
        this.$emit('sliderChange', val)
      }
    }
  }
</script>

<style scoped lang='scss'>
  .mapPopup {
    width: 240px;
    background: #fff;
    font-family:Microsoft YaHei;
    font-size:14px;
    .active {
      color: $color-text;
    }
    .wrapper {
      padding: 0 14px;
    }
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
        margin-right: 12px;
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
