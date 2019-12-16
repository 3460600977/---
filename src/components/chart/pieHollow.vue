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
      },
      color: {
        type: Array,
        required: true
      },
      data: {
        type: Array,
        required: true
      },
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
        color: this.color,
        series : [
          {
            name:'半径模式',
            type:'pie',
            radius : ['24%', '48%'],
            center : ['29%', '50%'],
            // roseType : 'radius',
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
            data: this.data[0]
          },
          {
            name:'面积模式',
            type:'pie',
            radius : ['24%', '48%'],
            center : ['69%', '50%'],
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
  .text {
    text-align: center;
    color: $color-text-1;
    position: absolute;
    bottom: 20px;
    width: 100%;
  }
</style>
