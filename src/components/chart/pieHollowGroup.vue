<!--空心饼状图-->
<template>
  <div ref="chartBox" class="chartBox" :style="{'width':width,'height': height}"></div>
  <!--<div class="fullContainer">

  </div>-->
</template>

<script>
  import echarts from 'echarts';

  export default {
    name: "pieGroup",
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
      title:{
        type: String,
        default:""
      },
      center: {
        type: Array,
        default: function () {
          return [
            ['32%', '32%'],
            ['55%', '32%'],
            ['32%', '70%'],
            ['55%', '70%']
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
            //name: item.name,
            type: 'pie',
            clockWise: false,
            radius: ['16%', '25%'],
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
            hoverAnimation: true,
            center: this.center[index],
            data: [
              {
                value: 1-item.value,
                itemStyle: {
                  normal: {
                    color: colors[index][1]
                  },
                  emphasis: {
                    color: colors[index][1]
                  }
                },
                label: {
                  normal: {
                    formatter: function(){
                      let result = item.value*100;
                      result = result.toFixed(2);
                      return result+"%";
                    },
                    position: 'center',
                    show: true,
                    textStyle: {
                      fontSize: '14',
                      color: colors[index][0]
                    }
                  }
                }
              },{
                value: item.value,
                name: item.name,
              }
            ]
          }
        )
      });
      let option = {
        title:{
          text:this.title,
          textStyle:{
            fontSize:14,
            fontWeight:"normal"
          }
        },
        legend: {
          data: ['运动型人群包', '全网人群'],
          icon: 'circle',
          top: 20,
          right: 40,
          padding: 0,
          itemHeight: 12,
          textStyle: {
            color: '#999999'
          }
        },
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
