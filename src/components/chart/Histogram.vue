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
      },
      color: {
        type: Array,
        required: true
      },
      isShowLine: {
        type: Boolean,
        default: false
      },
      isShowLegend: {
        type: Boolean,
        default: true
      },
      data: {
        type: Object,
        required: true
      },
    },
    mounted() {
      let myChart = echarts.init(this.$refs.chartBox);
      let option = {
        legend: {
          icon: 'circle',
          show: this.isShowLegend,
          top: 20,
          right: 40,
          padding: 0,
          itemHeight: 12,
          textStyle: {
            color: '#999999'
          }
        },
        tooltip: {},
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
            margin: 16,
            interval: 0
          },
          data: this.data.xAxis,
        },
        color: this.color,
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: function (v) {
              return `${parseInt(v * 100)}%`
            }
          },
          splitLine:{
            show: this.isShowLine,
            lineStyle: {
              color: '#E5E7E9'
            },
          },
          axisLine: {
            show: this.isShowLine,
            lineStyle: {
              color: '#E5E7E9'
            },
          },
          axisTick: {show: false}
        },
        series: this.data.yAxis
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
