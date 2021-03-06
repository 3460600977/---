<!--水平柱状图-->
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
      rotate: {
        type: Number,
        default: 0
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
      title:{
        type: String,
        default:""
      },
      legend:{
        type: Array,
        default: function () {
          return []
        }
      },
      grid: {
        type: Object,
        default: function () {
          return {
            left: '11.36%',
            right: '14.69%',
            bottom: 22,
          }
        }
      },
    },
    data() {
      return {
        myChart: null,
      }
    },
    watch: {
      data: {
        handler() {
          this.reDraw()
        },
        deep: true
      },
    },
    mounted() {
      this.myChart = echarts.init(this.$refs.chartBox);
      let option = {
        title:{
          text:this.title,
          textStyle:{
            fontSize:14,
            fontWeight:"bold"
          }
        },
        legend: {
          icon: 'circle',
          show: this.isShowLegend,
          name: this.legend,
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
                    <span>${item.seriesName}: ${(item.data * 100).toFixed(2)}%</span>
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
          ...this.grid,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          splitLine:{ show:false},
          axisLine: {show: false},
          axisTick: {show: false},
          axisLabel: {
            margin: 16,
            interval: 0,
            rotate: this.rotate
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
      this.myChart.setOption(option);
      window.addEventListener('resize', this.resize)
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resize)
    },
    methods: {
      resize() {
        this.myChart.resize();
      },
      reDraw() {
        this.myChart.clear();
        let option = {
          title:{
            text:this.title,
            textStyle:{
              fontSize:14,
              fontWeight:"bold"
            }
          },
          legend: {
            icon: 'circle',
            show: this.isShowLegend,
            name: this.legend,
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
                    <span>${item.seriesName}: ${(item.data * 100).toFixed(2)}%</span>
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
            ...this.grid,
            containLabel: true
          },
          xAxis: {
            type: 'category',
            splitLine:{ show:false},
            axisLine: {show: false},
            axisTick: {show: false},
            axisLabel: {
              margin: 16,
              interval: 0,
              rotate: this.rotate
            },
            data: this.data.xAxis,
          },
          color: this.color,
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: function (v) {
                return (v * 100)+'%'
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
        this.myChart.setOption(option, true);
      },
    }
  }
</script>

<style scoped lang="scss">

  .title {

  }
</style>
