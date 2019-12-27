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
            trigger: 'item',
            formatter: function (val) {
              return val.data;
            },
          },
          grid: {
            left: '2%',
            right: '2%',
            bottom: '8%',
            containLabel: true
          },
          color: ['#2D5AFF'],
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
            data: chartParam.yAxis.data,
            splitNumber: chartParam.yAxis.splitNumber,
            axisTick: {show: false},
            axisLabel: {
              color: '#999999',
              fontSize: 16,
              fontWeight: 'normal',
              fontFamily: 'DINMittelschrift',
              margin: 20,
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
              type: 'line',
              itemStyle: {
                normal: {color: 'rgba(45,90,255,1)'}
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
      getBarData() {
        console.log('submit!');
      }
      ,
    },
    watch: {
      axisData: {
        handler: function (newVal, oldVal) {
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
