<template>
    <div class="container ts clearfix">
      <div class="ts-left clearfix float-left">
        <p class="border-right float-left bold">目标人群</p>
        <div class="float-left ul border-right hand">
          <p class="border-right ul-p">成都市<span class="iconfont icon1 icon-icon-test"></span></p>
          <p class="border-right ul-p">行业标签<span class="iconfont icon1 icon-icon-test"></span></p>
          <p class="ul-p">人群标签<span class="iconfont icon1 icon-icon-test"></span></p>
        </div>
        <p class="float-left switch">
          <span class="margin-right-10">点位推荐</span>
          <el-switch
            v-model="value"
            :width="30"
            :active-color="activeColor">
          </el-switch>
        </p>
      </div>
      <div class="ts-right clearfix float-right">
        <p class="border-right bold float-left right1">楼盘筛选</p>
        <div class="float-left hand">
          <p @click="showHide(0)" class="border-right padding ul-p border-right">楼宇标签<span :class="isShowBuildingTags?'icon-down': 'icon-up'" class="iconfont icon1 icon-icon-test"></span></p>
        </div>
        <div class="float-left hand font0 font-0">
          <p class="ul-p selectType border-right" title="查找选点"><span class="font-22 iconfont margin2 icon-locating"></span></p>
          <p class="ul-p selectType border-right" title="手动选点" @click="(e) => drawTypeSelect(e, 'circle')"><span class="font-22 iconfont margin2 icon-reconnaissance1"></span></p>
          <p class="ul-p selectType border-right" title="折线选点" @click="(e) => drawTypeSelect(e, 'polyline')"><span class="font-22 iconfont margin2 icon-brokenline"></span></p>
          <p class="ul-p selectType" title="多边形选点" @click="(e) => drawTypeSelect(e, 'polygon')"><span class="font-22 iconfont margin2 icon-polygon"></span></p>
        </div>
      </div>
      <div class="building-select select-style" v-show="isShowBuildingTags">
        <select-popUp
          :selectDatas="buildingDatas"
          :filters="buildingFilter"
          @hide="() => hide(0)"
          @returnResult="(val) => returnResult(val, 0)"
        ></select-popUp>
      </div>
      <div class="city-select select-style">
        <singleSelect-popup
          v-if="cityDatas.length"
          title="城市列表"
          :selectDatas="cityDatas"
          :filters="cityFilter"
          @hide="() => hide(1)"
          @returnResult="(val) => returnResult(val, 1)"
        ></singleSelect-popup>
      </div>
    </div>
</template>

<script>
  import {colorMain} from '../../../utils/static'
  import selectPopUp from "../../../components/map/multipleSelectPopUp";
  import singleSelectPopup from "../../../components/map/singleSelectPopup";

  const CITY_MAPPING = {
    1: '一线城市:',
    2: '二线城市:',
    3: '三线城市:'
  }

  export default {
    name: "topSelect",
    components: {
      selectPopUp,
      singleSelectPopup
    },
    props: {
      buildingFilter: {
        type: Object,
        required: true
      },
    },
    data() {
      return {
        value: true,
        activeColor: colorMain,
        activeArr: [false, false],
        isShowBuildingTags: false,
        buildingDatas: {
          title: '楼宇标签',
          options: [
            {
              title: '楼宇类型',
              key: 'buildType',
              types: [
                {label: '中高端住宅', key: 0},
                {label: '商住楼', key: 1},
                {label: '综合体', key: 2},
                {label: '写字楼', key: 3},
              ]
            },
            {
              title: '平均房价',
              key: 'premiseAvgFee',
              types: [
                {label: '1万以下', key: 0},
                {label: '1-1.5万', key: 1},
                {label: '1.5-2万', key: 2},
                {label: '2-2.5万', key: 3},
                {label: '2.5-3万', key: 4},
                {label: '3万以上', key: 5},
              ]
            },
            {
              title: '入住率(%)',
              key: 'occupancyRate',
              types: [
                {label: '70-80%', key: 0},
                {label: '80%-90%', key: 1},
                {label: '90%以上', key: 2},
                ]
            },
            {
              title: '楼龄(年)',
              key: 'buildingAge',
              types: [
                {label: '5年以内', key: 0},
                {label: '5-10年', key: 1},
                {label: '10年以上', key: 2}
                ]
            },
            {
              title: '车位数(个)',
              key: 'parkingNum',
              types: [
                {label: '低于200', key: 0},
                {label: '200-500', key: 1},
                {label: '5000-800', key: 2},
                {label: '800以上', key: 2}
              ]
            },
            {
              title: '物业费(元)',
              key: 'propertyRent',
              types: [
                {label: '2元以下', key: 0},
                {label: '2-3元', key: 1},
                {label: '3元以上', key: 2}
              ]
            },
          ]
        },
        cityDatas: [],
        cityFilter: {
          cityCode: 440100
        },
      }
    },
    created() {
      this.$api.CityList.TypeList().then((data) => {
        if (data.result) {
          this.cityDatas = data.result.map((item) => {
            return {title: CITY_MAPPING[item.level], values: item.citys}
          })
        }
      })
    },
    methods: {
      drawTypeSelect(e, type) {
        this.$emit('drawTypeSelect', {x: e.clientX, y: e.clientY}, type)
      },
      showHide(val) {
        switch (val) {
          case 0:
            this.isShowBuildingTags = !this.isShowBuildingTags
            break
        }
      },
      hide(val) {
        switch (val) {
          case 0:
            this.isShowBuildingTags = false
            break
        }
      },
      returnResult(val, type) {
        this.$emit('returnBuildingTags', val)
        this.hide(type)
      }
    }
  }
</script>

<style scoped lang='scss'>
  .select-style {
    position: absolute;
    top: 60px;
  }
  .ul-p {
    line-height: 20px;
    display: inline-block;
    vertical-align: middle;
    position: relative;
    .icon1 {
      position: absolute;
      right: 10px;
      transition: 0.5s;
      font-size: 12px;
      color: $color-split-line2;
    }
  }
  .selectType {
    padding: 0 20px;
  }
  .margin2 {
    margin-right: 8px;
  }
  .font-22 {
    font-size: 22px;
    color: #8D8D8E;
  }
  .building-select {
    right: 147px;
  }
  .city-select {
    left: 114px;
  }
  .iconfont {
    vertical-align: middle;
  }
.ts {
  background:rgba(255,255,255,1);
  box-shadow:0px 3px 5px 0px rgba(0, 0, 0, 0.1);
}
.icon-up {
  transform: rotate(-180deg);
}
.icon-down {
  transform: rotate(0deg);
}
.margin2 {
  margin-right: 8px;
}
.padding {
  padding: 0 30px;
}
.ts-left {
  line-height: 50px;
  & p {
    padding: 0 30px;
  }
  .switch /deep/ {
    .el-switch__core:after {
      height: 14px;
      width: 14px;
      top: 0;
    }
    .el-switch__core {
      height: 16px;
    }
    .el-switch.is-checked .el-switch__core::after {
      margin-left: -14px;
    }
  }
}
  .ts-right {
    line-height: 50px;
    .right1 {
      padding-right: 40px;
    }
  }
</style>
