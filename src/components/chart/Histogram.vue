<template>
  <div ref="chartBox" class="chartBox" :style="{'width':width,'height': height}"></div>
</template>

<script>
  import echarts from 'echarts';

  export default {
    name: "Histogram",
    props: {
      width: {
        type: String,
        required: true
      },
      height: {
        type: String,
        required: true
      }
    },
    mounted() {
      let myChart = echarts.init(this.$refs.chartBox);
      let option = {
        legend: {
          icon: 'circle',
          top: 20,
          right: 40,
          padding: 0,
          itemHeight: 12,
          textStyle: {
            color: '#999999'
          }
        },
        textStyle: {
          color: '#999999'
        },
        grid: {
          left: '11.36%',
          right: '14.69%',
          bottom: 22,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          splitLine:{ show:false},
          axisLine: {show: false},
          axisTick: {show: false},
          axisLabel: {
            margin: 16
          },
          data:['巴西','印尼','美国','印度','中国','世界人口(万)'],
        },
        yAxis: {
          type: 'value',
          splitLine:{show:false},
          axisLine: {show: false},
          axisTick: {show: false}
        },
        series: [
          {
            name: '2011年',
            type: 'bar',
            data: [18203, 23489, 29034, 104970, 131744, 630230],
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                  offset: 0,
                  color: 'rgba(250,126,82,1)' // 0% 处的颜色
                },{
                  offset: 1,
                  color: 'rgba(251,180,103,1)' // 100% 处的颜色
                }], false)
              }
            }
          },
          {
            name: '2012年',
            type: 'bar',
            data: [19325, 23438, 31000, 121594, 134141, 681807],
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 1, 1, 0, [{
                  offset: 0,
                  color: 'rgba(254,217,42,1)' // 0% 处的颜色
                },{
                  offset: 1,
                  color: 'rgba(250,206,98,1)' // 100% 处的颜色
                }], false)
              }
            }
          }
        ]
      };
      myChart.setOption(option);
    },
    methods: {
    }
  }
</script>

<style scoped lang="scss">

  .title {

  }
</style>
