<template>
  <div  v-loading="loading" class="container customScroll">
    <p class="back border-bottom margin1 hand" @click="back">
      <span class="iconfont icon-icon-test icon"></span>
      返回
    </p>
    <div v-if="buildDetail">
      <div class="wrapper border-bottom">
        <p class="bold">{{buildDetail.name}}</p>
        <div class="mid-start margin-top-20">
          <p class="name">楼栋数</p>
          <p class="font-16 color-text-1 font-number">{{buildDetail.buildNum}}个</p>
        </div>
        <div class="mid-start margin-top-20">
          <p class="name">单元数</p>
          <p class="font-16 color-text-1 font-number">{{buildDetail.unitNum}}个</p>
        </div>
        <div class="mid-start margin-top-20">
          <p class="name">可售点位数</p>
          <p class="font-16 color-text-1 font-number">{{buildDetail.signDeviceNum}}个</p>
        </div>
      </div>
      <div class="wrapper border-bottom">
        <div class="mid-start">
          <p class="name">楼盘类型</p>
          <p class="color-text-1">{{buildDetail.typeName}}</p>
        </div>
        <div class="mid-start margin-top-20">
          <p class="name">入住时间</p>
          <p class="color-text-1">{{formatDate(buildDetail.inTime, 'yyyy-MM-dd')}}</p>
        </div>
        <div class="mid-start margin-top-20">
          <p class="name">入住率</p>
          <p class="color-text-1">{{buildDetail.inHouseRate}}%</p>
        </div>
        <div class="mid-start margin-top-20">
          <p class="name">约覆盖人数</p>
          <p class="color-text-1">{{buildDetail.totalPeople}}人</p>
        </div>
        <div class="mid-start margin-top-20">
          <p class="name">最低楼层</p>
          <p class="color-text-1">{{buildDetail.minStorey}}层</p>
        </div>
        <div class="mid-start margin-top-20">
          <p class="name">最高楼层</p>
          <p class="color-text-1">{{buildDetail.maxStorey}}层</p>
        </div>
        <div class="mid-start margin-top-20">
          <p class="name">物业费</p>
          <p class="color-text-1">{{buildDetail.managementPrice}}元/平方米/月</p>
        </div>
        <div class="mid-start margin-top-20">
          <p class="name">车位数</p>
          <p class="color-text-1">{{buildDetail.parkingNum}}个</p>
        </div>
        <div class="mid-start margin-top-20">
          <p class="name">平均售价</p>
          <p class="color-text-1">{{buildDetail.avgPrice}}元</p>
        </div>
        <div class="mid-start margin-top-20">
          <p class="name">详细地址</p>
          <p class="color-text-1">{{buildDetail.address}}</p>
        </div>
      </div>
      <div class="charts margin1">
        <div v-if="sexArr" class="border-bottom box box1 mid-column padding1">
          <p class="title" style="position: relative;top: 0">性别比例</p>
          <div class="mid-center flex1 fullContainer">
            <div class="sex-ratio">
              <ratio-chart
                :height="25"
                :dataArr="sexArr"
              >
                <template #text="{ratioArr}">
                  <div class="mid-between text-container font-number">
                    <p v-for="(item, index) in ratioArr" :key="index"
                       :style="{'color': item.color, 'width': item.width, 'textAlign': index === 1?'right':'left'}"
                    >{{item.width}}</p>
                  </div>
                </template>
                <template #bottom="{ratioArr}">
                  <div class="bottom-container font-number color-text-1">
                    <div class="mid-between">
                      <p v-for="(item, index) in ratioArr" :key="index"
                         :style="{'width': item.width, 'textAlign': index === 1?'right':'left'}"
                      >
                        <img :src=renderImg(item.src) alt="">
                      </p>
                    </div>
                    <div class="mid-between">
                      <p v-for="(item, index) in ratioArr" :key="index"
                         :style="{'width': item.width, 'textAlign': index === 1?'right':'left'}"
                      >{{item.tag}}</p>
                    </div>
                  </div>
                </template>
              </ratio-chart>
            </div>
          </div>
        </div>
        <div v-if="ageArr" class="box2 box border-bottom">
          <p class="title">年龄分布</p>
          <div class="fullContainer">
            <histogram
              v-if="ageArr.xAxis.length"
              width="100%"
              height="100%"
              :grid="positionType"
              :color="colorType[1]"
              :data="ageArr"
            ></histogram>
          </div>
        </div>
        <div  v-if="marriageDist" class="box2 box border-bottom">
          <p class="title">婚姻状况</p>
          <div class="fullContainer">
            <histogram
              v-if="marriageDist.xAxis.length"
              width="100%"
              height="100%"
              :isShowLine="true"
              :grid="positionType"
              :color="colorType[2]"
              :data="marriageDist"
            ></histogram>
          </div>
        </div>
        <div v-if="educationDist" class="box2 box border-bottom">
          <p class="title">学历分布</p>
          <div class="fullContainer">
            <histogram
              v-if="educationDist.xAxis.length"
              width="100%"
              height="100%"
              :isShowLine="true"
              :grid="positionType"
              :color="colorType[1]"
              :data="educationDist"
            ></histogram>
          </div>
        </div>
        <div v-if="incomeDist" class="box2 box border-bottom">
          <p class="title">收入水平</p>
          <div class="fullContainer">
            <histogram
              v-if="incomeDist.xAxis.length"
              width="100%"
              height="100%"
              :isShowLine="true"
              :grid="positionType"
              :color="colorType[1]"
              :data="incomeDist"
            ></histogram>
          </div>
        </div>
        <div v-if="consumptionDist" class="box2 box border-bottom">
          <p class="title">消费水平</p>
          <div class="fullContainer">
            <histogram
              v-if="consumptionDist.xAxis.length"
              width="100%"
              height="100%"
              :isShowLine="true"
              :grid="positionType"
              :color="colorType[1]"
              :data="consumptionDist"
            ></histogram>
          </div>
        </div>
        <div v-if="privateCarDist" class="box2 box border-bottom">
          <p class="title">车产状况</p>
          <div class="fullContainer">
            <histogram
              v-if="privateCarDist.xAxis.length"
              width="100%"
              height="100%"
              :isShowLine="true"
              :grid="positionType"
              :color="colorType[2]"
              :data="privateCarDist"
            ></histogram>
          </div>
        </div>
        <div v-if="hotSearch" class="box3 box border-bottom">
          <p class="title">行业热搜指数</p>
          <div class="fullContainer">
            <histogram
              width="100%"
              height="100%"
              v-if="hotSearch.xAxis.length"
              :color="colorType[3]"
              :isShowLine="true"
              :isShowLegend="false"
              :data='hotSearch'
              :grid="positionType"
              :rotate="20"
            ></histogram>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      没有楼盘详情数据！
    </div>
  </div>
</template>

<script>
  import RatioChart from "../../../components/chart/RatioChart";
  import Histogram from "../../../components/chart/Histogram";
  import pie from "../../../components/chart/pie";
  import pieHollow from "../../../components/chart/pieHollow";
  import verticalHistogram from "../../../components/chart/verticalHistogram";

  export default {
    name: "buildingDetail",
    components: {
      RatioChart,
      Histogram,
      pieHollow,
      verticalHistogram,
      pie
    },
    data() {
      return {
        loading: false,
        buildDetail: null,
        sexArr: null,
        ageArr: null,
        consumptionDist: null,
        marriageDist: null,
        privateCarDist: null,
        hotSearch: null,
        incomeDist: null,
        educationDist: null,
        formatDate: this.$tools.formatDate,
        sexArrStyle: [
          {style: 'background:linear-gradient(270deg,rgba(95,129,255,1),rgba(45,90,255,1));' +
              'box-shadow:0px 10px 17px 3px rgba(45,90,255,0.2);', color: 'rgba(45,90,255,1)'},
          {style: 'background:linear-gradient(-90deg,rgba(244,74,74,1),rgba(244,102,74,1));' +
              'box-shadow:0px 10px 17px 3px rgba(242,126,86,0.2);', color: 'rgba(244,102,74,1)'},
        ],
        colorType: {
          1: [
            {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(251,180,103,1)' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(250,126,82,1)' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            },
            {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(250,206,98,1)' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(254,217,42,1)' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          ],
          2: [
            {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: '#FF8A81' // 0% 处的颜色
              }, {
                offset: 1, color: '#FF2E5C' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            },
            {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: '#5F81FF' // 0% 处的颜色
              }, {
                offset: 1, color: '#2D5AFF' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          ],
          3: [
              {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#FBB467' // 0% 处的颜色
                }, {
                  offset: 1, color: '#FA7E52' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              },
          ],
        },
        positionType: {
          left: 0,
          right: 0,
          bottom: 30,
        }
      }
    },
    methods: {
      back() {
        this.$emit('back')
      },
      renderImg(src) {
        return require(`@/assets/images/icon_${src}.png`)
      },
      loadData(id) {
        this.loading = true
        this.$api.cityInsight.getBuildingDetail({pid: id}).then((data) => {
          this.buildDetail = data.result
          this.loading = false
          if (!this.buildDetail || (this.buildDetail && !this.buildDetail.chat)) {
            return
          }
          if (!this.buildDetail.chat.cityAverage) {
            return;
          }
          this.sexArr = this.renderSexChart(data.result.chat.genderDist)
          this.ageArr = this.renderHistogramChart(data.result.chat.ageDist, data.result.chat.cityAverage.ageAverageDist)

          this.consumptionDist = this.renderHistogramChart(data.result.chat.consumptionDist, data.result.chat.cityAverage.consumptionAverageDist)

          this.marriageDist = this.renderHistogramChart(data.result.chat.marriageDist, data.result.chat.cityAverage.marriageAverageDist)

          this.privateCarDist = this.renderHistogramChart(data.result.chat.privateCarDist, data.result.chat.cityAverage.privateCarAverageDist)
          this.hotSearch = this.renderHistogramChart(data.result.chat.hotSearch)
          this.incomeDist = this.renderHistogramChart(data.result.chat.incomeDist, data.result.chat.cityAverage.incomeAverageDist)

          this.educationDist = this.renderHistogramChart(data.result.chat.educationDist, data.result.chat.cityAverage.educationAverageDist)
        })
      },
      renderSexChart(arr) {
        let result = []
        result = arr.map((item, i) => {
          if (item.tag === '女') {
            return {...item, ...this.sexArrStyle[1], src: 'woman'}
          } else {
            return {...item, ...this.sexArrStyle[0], src: 'man'}
          }
        })
        return result
      },
      renderHistogramChart(arr1, arr2) {
        let result = {
          xAxis: [],
          yAxis: []
        }
        let data = []
        arr1.forEach((item) => {
          result.xAxis.push(item.tag)
          data.push(item.value)
        })
        result.yAxis.push({name: this.buildDetail.name, type: 'bar', data: data, barWidth: 18})
        if (arr2) {
          let data1 = arr2.map((item) => {
            return item.value
          })
          result.yAxis.push({name: this.buildDetail.cityName, type: 'bar', data: data1, barWidth: 18})
        }
        return result
      },
      renderPieChart(arr1, arr2) {
        let result = []
        let data = arr1.map((item) => {
          return {value: item.value, name: item.tag}
        })
        let data2 = arr2.map((item) => {
          return {value: item.value, name: item.tag}
        })
        result.push(data, data2)
        return result
      },
    },
  }
</script>

<style scoped lang='scss'>
  .container {
    width:452px;
    position: relative;
    overflow-y: auto;
    height: 100%;
    background: #ffffff;
    .fullContainer {
      height: 100%;
      width: 100%;
    }
    .padding1 {
      padding-top: 20px;
    }
    .margin1 {
      margin: 0px 20px;
    }
    .charts {
      .box1 {
        height: 180px;
      }
      .box2 {
        height: 290px;
      }
      .box3 {
        height: 316px;
      }
      .box {
        position: relative;
        width: 100%;
        .title {
          position: absolute;
          font-weight: bold;
          top: 20px;
          left: 0;
          padding-left: 10px;
          border-left: 3px solid $color-main;
        }
      }
      .text-container {
        margin-bottom: 8px;
      }
      .bottom-container {
        margin-top: 13px;
      }
      .sex-ratio {
        width: 100%;
      }
    }
    .back {
      line-height: 53px;
      color: $color-main;
    }
    .icon {
      margin-right: 10px;
      transform: rotate(90deg);
    }
    .wrapper {
      margin: 0px 20px;
      padding: 20px 0;
      .name {
        width: 100px;
      }
    }
  }
</style>
