<template>
  <div ref="lineBox" class="lineBox" style="width:1150px;height:450px;"></div>
</template>
<script>
import echarts from "echarts";

export default {
  name: "HomeDataLine",
  components: { echarts },
  props: {
    summaryLineData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      myChart: "",
      localData: {
        title: "花费数",
        xAxis: {
          data: []
        },
        series: {
          //barWidth: 56,
          data: [],
          dataShadow: []
        }
      }
    };
  },
  mounted() {
    this.initChart(this.summaryLineData);
  },
  methods: {
    calMax(arr = []) {
      if (arr.length === 0) return 0;
      let max = parseFloat(arr[0]);
      for (let i = 1; i < arr.length; i++) {
        // 求出一组数组中的最大值
        if (max < parseFloat(arr[i])) {
          max = parseFloat(arr[i]);
        }
      }
      let maxint = Math.ceil(max / 10); // 向上取整
      let maxval = maxint * 10; // 最终设置的最大值
      return maxval; // 输出最大值
    },
    initChart(chartParam) {
      let _that = this;
      this.myChart = this.myChart
        ? this.myChart
        : echarts.init(this.$refs.lineBox);
      let appregnum = chartParam.sFirstData;
      let activenum = chartParam.sSecondData;
      let maxappreg = this.calMax(appregnum); //花费Y轴值
      let maxactive = this.calMax(activenum); //曝光度Y轴值
      let interval_left = maxappreg / 5; //左轴间隔
      let interval_right = maxactive / 5; //右轴间隔
      let option = {
        //1、 格式化提示信息
        grid: {
          width: "95%",
          height: "80%",
          left: "2%",
          right: "3%",
          bottom: "8%",
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          formatter: function(params) {
            let str = `<p>${params[0].name}</p>`;
            params.forEach(item => {
              if (item.seriesName !== "花费（元）¥ ") {
                item.data = _that.$tools.toThousands(item.data, 0);
              }
              str += `
                        <p>
                        <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;
                        background:${item.color};opacity:1"></span>
                        <span>${item.seriesName}: ${item.data}</span>
                        </p>
                      `;
            });
            return str;
          }
        },
        xAxis: [
          {
            type: "category",
            data: chartParam.xdata,
            axisPointer: {
              type: "shadow"
            },
            axisLine: {
              lineStyle: {
                color: "#999999"
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            min: 0,
            max: maxappreg,
            splitNumber: 5,
            interval: interval_left,
            axisLine: {
              lineStyle: {
                color: "#606266"
              }
            },
            axisLabel: {
              fontFamily: "DINMittelschrift",
              formatter: function(value, index) {
                if (chartParam.selectLine.firstValue === 1) {
                  return "¥ " + value.toFixed(2);
                } else {
                  return _that.$tools.toThousands(value, 0);
                }
                return value;
              }
            }
          },
          {
            type: "value",
            min: 0,
            max: maxactive,
            splitNumber: 5,
            interval: interval_right,
            axisLine: {
              lineStyle: {
                color: "#999999"
              }
            },
            axisLabel: {
              fontFamily: "DINMittelschrift",
              formatter: function(value, index) {
                if (chartParam.selectLine.secondValue === 1) {
                  return "¥ " + value.toFixed(2);
                } else {
                  return _that.$tools.toThousands(value, 0);
                }
                return value;
              }
            }
          }
        ],
        series: [
          {
            name: chartParam.selectLine.selectFirstLabelLine,
            type: "line",
            smooth: true,
            yAxisIndex: 0,
            animationDuration: 2800,
            animationEasing: "cubicInOut",
            data: appregnum,
            itemStyle: {
              normal: {
                color: "#2d5aff",
                lineStyle: {
                  color: "#2d5aff",
                  width: 2
                }
                // label : {show: true}
              }
            },
            areaStyle: {
              normal: {
                color: {
                  type: "linear", //设置线性渐变
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "#2d5aff" // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "white" // 100% 处的颜色
                    }
                  ],
                  globalCoord: false // 缺省为 false
                }
              }
            }
          },
          {
            name: chartParam.selectLine.selectSecondLabelLine,
            type: "line",
            yAxisIndex: 1,
            smooth: true,
            animationDuration: 2800,
            animationEasing: "cubicInOut",
            data: activenum,
            itemStyle: {
              normal: {
                color: "#f44a4a",
                lineStyle: {
                  color: "#f44a4a",
                  width: 2
                }
                // label : {show: true}
              }
            },
            areaStyle: {
              normal: {
                color: {
                  type: "linear", //设置线性渐变
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "#f44a4a" // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "white" // 100% 处的颜色
                    }
                  ],
                  globalCoord: false // 缺省为 false
                }
              }
            }
          }
        ]
      };
      this.myChart.setOption(option);
    }
  },
  watch: {
    summaryLineData: {
      handler: function(newVal, oldVal) {
        this.initChart(newVal);
      },
      deep: true
    }
  }
};
</script>

<style lang="scss">
</style>