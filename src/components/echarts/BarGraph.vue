<template>
  <div ref="chartBox" class="chartBarGraphBox"></div>
</template>

<script>
  import echarts from 'echarts'

  export default {
    name: "BarGraph",
    components: {echarts},
    props: {
      axisData: {
        type: Object,
        required: true
      },
    },
    data() {
      return {
        chart: null,
        myChart: '',
        localData: {
          title: '花费数',
          xAxis: {
            data: []
          },
          yAxis: {
            splitNumber: 8,
            max: 1200,
          },
          series: {
            //barWidth: 56,
            data: [],
            dataShadow: []
          },
        }
      }
    },
    mounted() {
      this.initChart(this.localData)
    },
    methods: {
      initChart(chartParam) {
        let that = this
        this.myChart = this.myChart ? this.myChart : echarts.init(this.$refs.chartBox);
        let option = {
          title: {
            text: chartParam.title,
            textStyle: {
              fontSize: '14',
              fontWeight: '400',
              color: 'rgba(24,24,25,1)',
            },
            top: 0,
            left: 28,
          },
          tooltip: {//鼠标移入折点显示悬浮框
            trigger: 'axis',
            formatter: function (allVal) {
              let val = []
              if (allVal.length > 0) {
                val = allVal.shift()
                let showVal = 0;
                if (chartParam.sortField === 'cost') {
                  showVal = '¥ ' +that.$tools.toThousands(val.data, 2);
                } else {
                  showVal = that.$tools.toThousands(val.data, 0);
                }
                return val.name + '<br/>' +
                  '<div style="width: 12px; height: 12px;background: #F44A4A;border-radius: 50%;border: 1px solid #F44A4A;display: inline-block;margin-right: 20px"></div>'
                  + showVal
              }
            },
            padding: [10, 20]
          },
          grid: {
            left: '2%',
            right: '2%',
            bottom: '8%',
            containLabel: true
          },
          color: ['#F44A4A'],
          xAxis: {
            axisLine: {show: false},
            type: 'category',
            data: chartParam.xAxis.data,
            axisTick: {show: false},
            axisLabel: {
              interval: 0,
              color: '#999999',
              fontSize: 14,
              fontWeight: 400,
              margin: 20,
            },
          },
          yAxis: {
            axisLine: {show: false},
            type: 'value',
            max: chartParam.yAxis.max,
            splitNumber: chartParam.yAxis.splitNumber,
            axisTick: {show: false},
            axisLabel: {
              color: '#999999',
              fontSize: 16,
              fontWeight: 'normal',
              fontFamily: 'DINMittelschrift',
              margin: 20,
              formatter: function (value, index) {
                if (chartParam.sortField === 'cost') {
                  return '¥ ' +value.toFixed(2);
                }
                return value
              }
            },
          },
          series: [
            // { // For shadow
            //     type: 'line',
            //     itemStyle: {
            //
            //         normal: {color: 'rgba(110,136,195,0.14)'}
            //     },
            //     barGap: '-100%',
            //     barCategoryGap: 56,
            //     data: chartParam.series.dataShadow,
            //     animation: false,
            //     barWidth: 56,
            //     legendHoverLink: false,
            //     markLine: {
            //         lineStyle: {color: '#F5F6F8'}
            //     },
            // },
            {
              symbol: 'circle',
              symbolSize: 10,
              type: 'line',
              itemStyle: {
                normal: {color: 'rgba(244,74,74,1)'}
                // normal: {label: {show: true}, color: 'rgba(45,90,255,1)'}
              },
              legendHoverLink: false,
              barWidth: 56,
              data: chartParam.series.data,
              animation: false,
              markLine: {
                lineStyle: {color: '#F5F6F8'}
              }
            }]
        };
        this.myChart.setOption(option);
      },
    },
    watch: {
      axisData: {
        handler: function (newVal, oldVal) {
          if (newVal.sortField === 'cost') {
            newVal.series.data.forEach((item, index, arr) => {
              arr[index] = this.$tools.toThousands(item/100)
            })
          }
          this.initChart(newVal)
        }
        ,
        deep: true
      }
    }
    ,
  }
</script>

<style lang="scss">
  .chartBarGraphBox {
    width: 100%;
    height: 100%;
    margin-top: 26px;
  }
</style>
