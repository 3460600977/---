<template>
    <div ref="chinaMap" class="container">
    </div>
</template>

<script>
  import echarts from 'echarts'
  require('echarts/map/js/china.js');

  export default {
    name: "chinaMap",
    props: {
      list: {
        type: Array,
        required: true
      },
    },
    data() {
      return {
        myChart: null
      }
    },
    mounted() {
      console.log(this.list)
      this.myChart = echarts.init(this.$refs.chinaMap); //这里是为了获得容器所在位置
      window.onresize = this.myChart.resize;
      this.initMap()
    },
    watch: {
      list(val) {
        this.initMap()
      },
    },
    methods: {
      initMap() {
        let mapOptions = { // 进行相关配置
          backgroundColor: "#fff",
          visualMap: [{
            type: 'piecewise', // 定义为分段型 visualMap
            text:['高', '低'],
            inverse: true,
            itemWidth: 20,
            itemHeight: 8,
            itemSymbol: 'rect',
            //itemSymbol: 'rect',
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
            }
          },
          series: [{
            type: 'scatter',
            coordinateSystem: 'geo', // 对应上方配置
          },
            {
              type: 'map',
              geoIndex: 0,
              data: this.list
            }
          ]
        };
        this.myChart.setOption(mapOptions, true)
      }
    },
  }
</script>

<style scoped lang='scss'>

</style>
