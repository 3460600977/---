<template>
  <div class="fullContainer">
    <div ref="chartBox" class="chartBox" :style="{'width':width,'height': height}"></div>
    <div class="clearfix text">
      <p style="width: 50%;" class="float-left">金沙雅苑未来街区</p>
      <p style="width: 50%;" class="float-left">上海市</p>
    </div>
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
            name:'半径模式',
            type:'pie',
            radius : '56%',
            center : ['28%', '50%'],
            roseType : 'radius',
            label: {
              normal: {
                show: false,
                color: '#999999'
                // position: 'inside'
              },
              emphasis: {
                show: true,
                position: 'outside'
              }
            },
            itemStyle: {
              shadowColor: 'rgba(238,162,104,0.2)',
              shadowBlur: 17,
              shadowOffsetX: 0,
              shadowOffsetY: 10,
            },
            data:[
              {value:10, name:'rose1'},
              {value:8, name:'rose2'},
              {value:12, name:'rose3'}
            ]
          },
          {
            name:'面积模式',
            type:'pie',
            radius : '56%',
            center : ['70%', '50%'],
            roseType : 'radius',
            itemStyle: {
              shadowColor: 'rgba(238,162,104,0.2)',
              shadowBlur: 17,
              shadowOffsetX: 0,
              shadowOffsetY: 10,
            },
            label: {
              normal: {
                show: false,
                color: '#999999'
              },
              emphasis: {
                show: true
              }
            },
            data:[
              {value:11, name:'rose1'},
              {value:11, name:'rose2'},
              {value:11, name:'rose3'},
            ]
          }
        ]
      };
      // let option = {
      //   legend: {
      //     data: ['2011年', '2012年'],
      //     icon: 'circle',
      //     top: 20,
      //     right: 40,
      //     padding: 0,
      //     itemHeight: 12,
      //     textStyle: {
      //       color: '#999999'
      //     }
      //   },
      //   textStyle: {
      //     color: '#999999'
      //   },
      //   grid: {
      //     left: '11.36%',
      //     right: '14.69%',
      //     bottom: 22,
      //     containLabel: true
      //   },
      //   xAxis: {
      //     type: 'category',
      //     splitLine:{ show:false},
      //     axisLine: {show: false},
      //     axisTick: {show: false},
      //     axisLabel: {
      //       margin: 16
      //     },
      //     data:['巴西','印尼','美国','印度','中国','世界人口(万)'],
      //   },
      //   yAxis: {
      //     type: 'value',
      //     splitLine:{show:false},
      //     axisLine: {show: false},
      //     axisTick: {show: false}
      //   },
      //   series: [
      //     {
      //       name: '2011年',
      //       type: 'bar',
      //       data: [18203, 23489, 29034, 104970, 131744, 630230],
      //       itemStyle: {
      //         normal: {
      //           color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
      //             offset: 0,
      //             color: 'rgba(250,126,82,1)' // 0% 处的颜色
      //           },{
      //             offset: 1,
      //             color: 'rgba(251,180,103,1)' // 100% 处的颜色
      //           }], false)
      //         }
      //       }
      //     },
      //     {
      //       name: '2012年',
      //       type: 'bar',
      //       data: [19325, 23438, 31000, 121594, 134141, 681807],
      //       itemStyle: {
      //         normal: {
      //           color: new echarts.graphic.LinearGradient(0, 1, 1, 0, [{
      //             offset: 0,
      //             color: 'rgba(254,217,42,1)' // 0% 处的颜色
      //           },{
      //             offset: 1,
      //             color: 'rgba(250,206,98,1)' // 100% 处的颜色
      //           }], false)
      //         }
      //       }
      //     }
      //   ]
      // };
      myChart.setOption(option);
    },
    methods: {
    }
  }
</script>

<style scoped lang="scss">
  .text {
    text-align: center;
    color: $color-text-1;
    position: absolute;
    bottom: 20px;
    width: 100%;
  }
</style>
