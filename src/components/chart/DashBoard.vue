<template>
    <div ref="chartBox" :style="{'width': width + 'px','height': height + 'px'}" class="chartBox"></div>
</template>

<script>
  import echarts from 'echarts';
  export default {
    name: "DashBoard",
    props: {
      // axisData: {
      //   type: Object,
      //   required: true
      // },
      width: {
        type: Number,
        default:154
      },
      height: {
        type: Number,
        default: 154
      }
    },
    mounted() {
      this.drawChart()
    },
    methods: {
      drawChart() {
        this.myChart = echarts.init(this.$refs.chartBox);
        let option = option = {
          tooltip : {
            formatter: "{a} <br/>{b} : {c}%"
          },
          series: [
            {
              name: '业务指标',
              type: 'gauge',
              detail: {formatter:'{value}%'},
              data: [{
                // 数据项的名称
                name: '数据1',
                // 数据项值8
                value: 10
              }, {
                name: '数据2',
                value: 20
              }]
            }
          ]
        };
        this.myChart.setOption(option);
      }
    }
  }
</script>

<style scoped lang='scss'>

</style>
