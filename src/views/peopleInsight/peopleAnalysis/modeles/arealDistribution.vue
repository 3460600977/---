<!-- 地域分布 -->
<template>
  <el-card class="box-card area-distibution">

    <div class="report-form-title">
      地域分析
    </div>

    <div class="area-content">

      <div class="content-left">
        <div class="choose-type">
          <el-radio v-model="mapType" label="1">TA人数</el-radio>
          <el-radio v-model="mapType" label="2">TA浓度</el-radio>
        </div>

        <div class="ta-people-map" ref="taMap"></div>
      </div>

      <div class="content-right">
        <el-tabs  class="thin-tab small" v-model="activeTab">
          <el-tab-pane label="省份" name="province">
            <ul class="map-list">
              <li v-for="(item, index) in list" :key="index" class="map-list-item">
                <label class="t-name">{{index+1}}、{{item.name}}</label>
                <label class=t-value>
                  <div :style="`width: ${+item.value / 10}%`" class="value-content"></div>
                </label>
                <label class="value-text color-text-1">{{+item.value / 10}} %</label>
              </li>
            </ul>
          </el-tab-pane>
          <el-tab-pane label="城市" name="city">
            <ul class="map-list">
              <li v-for="(item, index) in list" :key="index" class="map-list-item">
                <label class="t-name">{{index+1}}、{{item.name}}</label>
                <label class=t-value>
                  <div :style="`width: ${+item.value / 10}%`" class="value-content"></div>
                </label>
                <label class="value-text color-text-1">{{+item.value / 10}} %</label>
              </li>
            </ul>
          </el-tab-pane>
        </el-tabs>
      </div>

    </div>
  </el-card>
</template>

<script>
import echarts from 'echarts'
require('echarts/map/js/china.js');
export default {
  data() {
    return {
      chanaJson: '../../../../assets/china.json',
      mapType: '1',
      activeTab: 'province',
      list: [
        {
          "name": "北京",
          "value": 999
        }, 
        {
          "name": "湖北",
          "value": 810
        }, 
        {
          "name": "四川",
          "value": 453
        },
        {
          "name": "上海",
          "value": 142
        }, 
        {
          "name": "广东",
          "value": 142
        }, 
        {
          "name": "深圳",
          "value": 92
        }, 
        {
          "name": "黑龙江",
          "value": 44
        }, 
        {
          "name": "湖北",
          "value": 42
        }, 
        {
          "name": "浙江",
          "value": 20
        }, 
        {
          "name": "江西",
          "value": 15
        }, 
      ]
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    initMap() {
      let myChart = echarts.init(this.$refs.taMap); //这里是为了获得容器所在位置    
      window.onresize = myChart.resize;
      myChart.setOption({ // 进行相关配置
        backgroundColor: "#fff",
        visualMap: [{
          type: 'piecewise', // 定义为分段型 visualMap
          min: 10,
          max: 1000,
          text:['高', '低'],
          inverse: true,
          itemWidth: 20,
          itemHeight: 8,
          itemSymbol: 'rect',
          itemSymbol: 'rect',
          orient: 'horizontal',
          realtime: false,
          calculable: true,
          inRange: {
              color: ['#F4A3A3', '#F44A4A']
          }
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
          }
        },
        series: [{
            type: 'scatter',
            coordinateSystem: 'geo' // 对应上方配置
          },
          {
            type: 'map',
            geoIndex: 0,
            data: this.list
          }
        ]
      })
    }
  }
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
            .map-list-item{
              margin-top: 40px;
              .t-name{
                display: inline-block;
                width: 190px;
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
                margin-left: 50px;
              }
            }
          }
        }
      }
    }
  }
</style>