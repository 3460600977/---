<!--空心饼状图-->
<template>
  <div ref="chartBox" class="chartBox" :style="{'width':width,'height': height}"></div>
  <!--<div class="fullContainer">

  </div>-->
</template>

<script>
  import echarts from 'echarts';

  export default {
    name: "pieDouble",
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
      legend:{
        type: Array,
        required: true
      },
      center: {
        type: Array,
        default: function () {
          return [
            ['29%', '55%'],
            ['69%', '55%'],
          ]
        }
      }
    },
    mounted() {
      let myChart = echarts.init(this.$refs.chartBox);
      let seriesArr = [];
      this.data.forEach((item,index)=>{
        seriesArr.push(
          {
            name: this.data.name[index],
            type: 'pie',
            radius: ['29%', '50%'],
            center: this.center[index],
            itemStyle:  {
              normal: {
                shadowBlur: 0,
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                },
              }
            },
            data: [
              item[0],item[1]
            ]
          }
        );
      });
      let option = {
        title:{
          text:this.title,
          textStyle:{
            fontSize:14,
            fontWeight:"normal"
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {d}% "
        },
        legend: {
          data: ['有车','无车'],
          icon: 'circle',
          top: 20,
          right: 40,
          padding: 0,
          itemHeight: 12,
          textStyle: {
            color: '#999999'
          }
        },
        series: seriesArr,
        color:this.color
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
