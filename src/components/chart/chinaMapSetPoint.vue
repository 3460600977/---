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
        // default: function () {
        //   return []
        // }
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
            }
          },
          series: [
            {
              type: 'scatter',
              coordinateSystem: 'geo',
              data: this.list,
              symbolSize: function (val) {
                return 10;
              },
              label: {
                formatter: '{b}',
                position: 'right',
                show: false
              },
              itemStyle: {
                color: 'purple'
              },
              emphasis: {
                label: {
                  show: true
                }
              }
            },
          ]
        };
        this.myChart.setOption(mapOptions, true)
      }
    },
  }
</script>

<style scoped lang='scss'>

</style>
