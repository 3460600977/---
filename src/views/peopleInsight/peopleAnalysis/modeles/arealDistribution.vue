<!-- 地域分布 -->
<template>
  <el-card class="box-card area-distibution">

    <div class="report-form-title">
      地域分析
    </div>

    <div class="area-content">

      <div class="content-left">
        <div class="choose-type">
          <el-radio v-model="mapType" :label="0">TA人数</el-radio>
          <el-radio v-model="mapType" :label="1">TA浓度</el-radio>
        </div>
        <div class="ta-people-map">
          <div class="ta-people-map" ref="taMap"></div>
        </div>
      </div>

      <div class="content-right">
        <el-tabs  class="thin-tab small" v-model="activeTab">
          <el-tab-pane label="省份" name="province">
          </el-tab-pane>
          <el-tab-pane label="城市" name="city">
          </el-tab-pane>
          <ul class="map-list">
            <li v-for="(item, index) in data[activeTab][mapType]" :key="index" class=" mid-between map-list-item">
              <label class="t-name text-ellipsis">{{item.name}}</label>
              <label class='t-value flex1'>
                <div :style="{'width': item.countPercent}" class="value-content"></div>
              </label>
              <label v-if="activeTab === 'province'" class="value-text color-text-1">{{mapType === 0?$tools.toThousands(item.value,false): item.countPercent}}</label>
              <label v-else class="value-text color-text-1">{{mapType === 0?$tools.toThousands(item.label,false): item.countPercent}}</label>
            </li>
          </ul>
        </el-tabs>
      </div>

    </div>
  </el-card>
</template>

<script>

import echarts from 'echarts'
require('echarts/map/js/china.js');

export default {
  props: {
    areasList: {
      type: Object,
      default() {
        return {
          provinceTa: [],
          cityTa: []
        }
      }
    }
  },
  data() {
    return {
      mapType: 0,
      activeTab: 'province',
      mapData: [],
      data: {}
    }
  },
  created() {
    this.data.province = this.normalizeProvinceData(this.areasList.provinceTa)
    this.data.city = this.normalizeCityData(this.areasList.cityTa)
  },
  mounted() {
    this.myChart = echarts.init(this.$refs.taMap); //这里是为了获得容器所在位置
    window.onresize = this.myChart.resize;
    this.reDrawMap()
  },
  watch: {
    mapType() {
      this.reDrawMap()
    },
    activeTab() {
      this.reDrawMap()
    },
  },
  methods: {
    reDrawMap() {
      let list = this.data[this.activeTab][this.mapType]
      let mapOptions = {}
      if (this.activeTab === 'province') {
        mapOptions = { // 进行相关配置
           backgroundColor: "#fff",
           visualMap: [{
             type: 'piecewise', // 定义为分段型 visualMap
             text:['高', '低'],
             inverse: true,
             itemWidth: 20,
             itemHeight: 8,
             itemSymbol: 'rect',
             orient: 'horizontal',
             realtime: false,
             calculable: true,
             inRange: {
               color: ['#F4A3A3', '#F44A4A']
             },
             splitList: [
               {start: 0}
             ],
           }],
           geo: {
             map: 'china',
             label: {
               normal: {
                 show: false, // 是否显示对应地名
               }
             },
             itemStyle: {
               normal: {
                 borderColor: '#fff',
                 color: '#facdcd'
               },
               emphasis: {
                 areaColor: '#F44C4A',
                 shadowOffsetX: 0,
                 shadowOffsetY: 0,
                 shadowBlur: 20,
                 borderWidth: 0,
                 shadowColor: 'rgba(0, 0, 0, 0.5)'
               }
             },
             emphasis: {
               label: {
                 show: false
               },
             },
           },
           tooltip: {
             trigger: 'item',
             formatter(val) {
               if (val.data) {
                 return `${val.data.name}: ${val.data.countPercent}`
               } else {
                 return `${val.name}: 0%`
               }
             },
           },
           series: [{
             type: 'scatter',
             coordinateSystem: 'geo', // 对应上方配置
           },
             {
               type: 'map',
               geoIndex: 0,
               data: list
             }
           ]
         }
      } else {
        mapOptions = { // 进行相关配置
          backgroundColor: "#fff",
          geo: {
          map: 'china',
            label: {
              normal: {
                show: false, // 是否显示对应地名
              }
            },
          itemStyle: {
            normal: {
              borderColor: '#fff',
              color: '#facdcd'
            },
            emphasis: {
              label: {
                show: false
              },
              borderColor: '#fff',
              color: '#facdcd',
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 20,
              borderWidth: 0,
              shadowColor: 'rgba(255, 255, 255, 0.5)'
            }
          },
          emphasis: {
            label: {
              show: false
            },
          },
        },
          tooltip: {
            trigger: 'item',
            formatter(val) {
              if (val.data) {
                return `${val.data.name}: ${val.data.countPercent}`
              } else {
                return `${val.name}: 0%`
              }
            },
          },
          series: [
            {
              type: 'scatter',
              coordinateSystem: 'geo',
              data: list,
              symbolSize: function (val) {
                return 10;
              },
              // `${val.data.name}: ${val.data.countPercent}`
              //this.$tools.colorMain
              // label: {
              //   formatter: '{b}',
              //   position: 'right'
              // },
              itemStyle: {
                color: this.$tools.colorMain
              },
              emphasis: {
                label: {
                  show: false,
                  // formatter(val) {
                  //   return `${val.data.name}: ${val.data.countPercent}`
                  // },
                }
              }
            },
          ]
        }
      }
      this.myChart.setOption(mapOptions, true)
    },
    normalizeProvinceData(arr) {
      // 0是ta人数的值 1是ta浓度的值
      let data = {0: [], 1: []}
      arr.forEach((item) => {
        data[0].push({value: item.count, name: item.name.replace(/省/g,"").replace(/市/,""), countPercent: parseInt(item.countPercent, 10) * 100 + '%'})
        data[1].push({value: (item.density * 100).toFixed(2), name: item.name.replace(/省/g,"").replace(/市/,""), countPercent: (item.density * 100).toFixed(2) + '%'})
      })
      return data
    },
    normalizeCityData(arr) {
      // 0是ta人数的值 1是ta浓度的值
      let data = {0: [], 1: []}
      arr.forEach((item) => {
        let val = [Number(item.lng), Number(item.lat)]
        data[0].push({
          value: val.concat(Number(item.count)),
          label: item.count,
          name: item.name.replace(/省/g,"").replace(/市/,""),
          countPercent: parseInt(item.countPercent * 100, 10) + '%'
        })
        data[1].push({
          value: val.concat((item.density * 100).toFixed(2)),
          name: item.name.replace(/省/g,"").replace(/市/,""),
          countPercent: (item.density * 100).toFixed(2) + '%'
        })
      })
      return data
    },
  },
}
</script>

<style lang="scss">
  .area-distibution{
    .report-form-title {
      font-size: 16px;
      font-weight: bold;
      color: $color-text;
    }
    .area-content{
      display: flex;
      .content-left{
        position: relative;
        width: 800px;
        .choose-type{
          position: absolute;
          top:0;
          z-index: 2;
          margin-top: 30px;
        }
        .ta-people-map{
          position: relative;
          z-index: 1;
          width:700px;
          height:590px;
        }
      }
      .content-right{
        flex-grow: 1;
        .thin-tab{
          .map-list{
            margin-top: 10px;
            .map-list-item{
              &+.map-list-item{
                margin-top: 40px;
              }
              .t-name{
                display: inline-block;
                width: 100px;
              }
              .t-value{
                position: relative;
                display: inline-block;
                width: 240px;
                height: 8px;
                background-color: $color-bg;
                .value-content{
                  position: absolute;
                  top: 0;
                  left: 0;
                  height: 100%;
                  background-color: $color-main;
                }
              }
              .value-text{
                width: 100px;
                text-align: right;
                display: inline-block;
              }
            }
          }
        }
      }
    }
  }
</style>
