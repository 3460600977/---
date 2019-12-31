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
      <div class="content-right"></div>
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
      .content-left{
        position: relative;
        width: 1092px;
        .choose-type{
          position: absolute;
          top:0;
          z-index: 2;
          margin-top: 30px;
        }
        .ta-people-map{
          position: relative;
          z-index: 1;
          width:698px;
          height:490px;
          background: #f1f1f1;
        }
      }
    }
  }
</style>