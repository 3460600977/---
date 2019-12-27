<!--实心饼状图-->
<template>
  <div class="fullContainer">
    <div ref="chartBox" class="chartBox" :style="{'width':width,'height': height}"></div>
  </div>
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
      data: {
        type: Array,
        required: true
      },
      center: {
        type: Array,
        default: function () {
          return [
            ['28%', '50%'],
            ['72%', '50%']
          ]
        }
      },
      customTooltip: {
        type: String,
        default: ''
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
        grid: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          containLabel: true
        },
        calculable : true,
        color:[
          {
            type: 'radial',
            x: 0,
            y: 0,
            r: 1,
            colorStops: [{
              offset: 0, color: '#5F81FF' // 0% 处的颜色
            }, {
              offset: 1, color: '#2D5AFF' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          },
          {
            type: 'radial',
            x: 0,
            y: 0,
            r: 1,
            colorStops: [{
              offset: 0, color: '#F08D6B' // 0% 处的颜色
            }, {
              offset: 1, color: '#FACE62' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          },
          {
            type: 'radial',
            x: 0,
            y: 0,
            r: 1,
            colorStops: [{
              offset: 0, color: '#B0E69D' // 0% 处的颜色
            }, {
              offset: 1, color: '#7CC86F' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        ],
        series : [
          {
            type:'pie',
            radius : '56%',
            center : this.center[0],
            roseType : 'radius',
            label: {
              normal: {
                show: false,
                color: '#999999'
              },
            },
            itemStyle: {
              shadowColor: 'rgba(238,162,104,0.2)',
              shadowBlur: 17,
              shadowOffsetX: 0,
              shadowOffsetY: 10,
            },
            emphasis: {
              label: {
                show: true,
                formatter: (param) => {
                  let str = ''
                  if (this.customTooltip !== '') {
                    str = `${param.name}${this.customTooltip}：${param.percent}%`
                  } else {
                    str = `${param.name}：${param.percent}%`
                  }
                  return str
                }
              }
            },
            data: this.data[0]
          },
          {
            type:'pie',
            radius : '56%',
            center : this.center[1],
            roseType : 'radius',
            itemStyle: {
              shadowColor: 'rgba(238,162,104,0.2)',
              shadowBlur: 17,
              shadowOffsetX: 0,
              shadowOffsetY: 10,
            },
            emphasis: {
              label: {
                show: true,
                formatter: (param) => {
                  let str = ''
                  if (this.customTooltip !== '') {
                    str = `${param.name}${this.customTooltip}：${param.percent}%`
                  } else {
                    str = `${param.name}：${param.percent}%`
                  }
                  return str
                }
              }
            },
            label: {
              normal: {
                show: false,
                color: '#999999'
              }
            },
            data: this.data[1]
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
</style>
