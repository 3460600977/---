<!--垂直柱状图-->
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
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            let str = `<p>${params[0].name}</p>`
            params.forEach((item) => {
              str += `
                    <p>
                    <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;
                    background:linear-gradient(187deg,${item.color.colorStops[0].color}, ${item.color.colorStops[1].color});"></span>
                    <span>${item.seriesName}: ${parseInt(item.data * 100)}%</span>
                    </p>
                  `
            })
            return str
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
        yAxis: {
          type: 'category',
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
          axisTick: {show: false},
          axisLabel: {
            margin: 16,
            interval: 0
          },
          data: this.data.xAxis,
        },
        color: this.color,
        xAxis: {
          type: 'value',
          axisLabel: {
            formatter: function (v) {
              return `${parseInt(v * 100)}%`
            }
          },
          splitLine:{
            show: false
          },
          axisLine: {
            show: false
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
