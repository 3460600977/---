<!--空心饼状图-->
<template>
  <div ref="chartBox" class="chartBox" :style="{'width':width,'height': height}"></div>
  <!--<div class="fullContainer">

  </div>-->
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
      data: {
        type: Array,
        required: true
      },
      center: {
        type: Array,
        default: function () {
          return [
            ['32%', '32%'],
            ['59%', '32%'],
            ['32%', '75%'],
            ['59%', '75%']
          ]
        }
      }
    },
    mounted() {
      let myChart = echarts.init(this.$refs.chartBox);
      let seriesArr = [];
      let colors = this.color;
      this.data.forEach((item,index)=>{
        seriesArr.push(
          {
            name: item.name,
            type: 'pie',
            clockWise: false,
            radius: ['25%', '38%'],
            itemStyle:  {
              normal: {
                color: colors[index][0],
                shadowColor: colors[index][0],
                shadowBlur: 0,
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                },
              }
            },
            hoverAnimation: false,
            center: this.center[index],
            data: [ {
              value: 100-item.value,
              name: 'invisible',
              itemStyle: {
                normal: {
                  color: colors[index][1]
                },
                emphasis: {
                  color: colors[index][1]
                }
              }
            },{
              value: item.value,
              label: {
                normal: {
                  formatter: function(params){
                    return params.value+'%';
                  },
                  position: 'center',
                  show: true,
                  textStyle: {
                    fontSize: '20',
                    fontWeight: 'bold',
                    color: colors[index][0]
                  }
                }
              },
            }]
          }
        )
      });
      let option = {
        series: seriesArr
      };
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
