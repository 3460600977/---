<template>
  <div ref="lineBox" class="lineBox" style="width:1150px;height:480px;"></div>
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
      return maxint * 10; // 最终设置的最大值,输出最大值
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
      if (maxappreg === 0) maxappreg = 100;
      if (maxactive === 0) maxactive = 100;
      let interval_left = maxappreg / 5; //左轴间隔
      let interval_right = maxactive / 5; //右轴间隔
      let option = {};
      if (chartParam.selectLine.checked) {
        option = {
          //1、 格式化提示信息
          animation: false,
          grid: {
            width: "95%",
            height: "90%",
            left: "2%",
            right: "3%",
            bottom: "7%",
            containLabel: true
          },
          tooltip: {
            trigger: "axis",
            formatter: function(params) {
              let str = `<p>${params[0].name}</p>`;
              params.forEach(item => {
                if (item.seriesName !== "花费（元）¥ ") {
                  item.data = _that.$tools.toThousands(item.data, false);
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
              boundaryGap: false,
              type: "category",
              data: chartParam.xdata,
              axisPointer: {
                type: "line",
                lineStyle: {
                  color: "rgba(244, 74, 74, 0.06)",
                  width: 65
                }
              },
              axisLabel: {
                margin: 20,
                showMaxLabel: true,
                fontSize: 14,
                fontWeight: 400,
                color: "#999999"
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
              minInterval: 5,
              interval: maxappreg === 0 ? 100 : interval_left,
              axisLine: {
                show: false,
                lineStyle: {
                  color: "#606266"
                }
              },
              axisTick: {
                show: false
              },
              splitLine: {
                lineStyle: {
                  color: "#f5f6f8"
                }
              },
              axisLabel: {
                color: "#999999",
                fontSize: 16,
                fontWeight: "normal",
                fontFamily: "DINMittelschrift",
                formatter: function(value, index) {
                  if (chartParam.selectLine.firstValue === 1) {
                    return "¥ " + value.toFixed(2);
                  } else {
                    return _that.$tools.toThousands(value, false);
                  }
                }
              }
            },
            {
              type: "value",
              min: 0,
              max: maxactive,
              splitNumber: 5,
              minInterval: 5,
              interval: maxactive === 0 ? 100 : interval_right,
              axisLine: {
                show: false,
                lineStyle: {
                  color: "#999999"
                }
              },
              axisTick: {
                show: false
              },
              splitLine: {
                lineStyle: {
                  color: "#f5f6f8"
                }
              },
              axisLabel: {
                color: "#999999",
                fontSize: 16,
                fontWeight: "normal",
                fontFamily: "DINMittelschrift",
                formatter: function(value, index) {
                  if (chartParam.selectLine.secondValue === 1) {
                    return "¥ " + value.toFixed(2);
                  } else {
                    return _that.$tools.toThousands(value, false);
                  }
                }
              }
            }
          ],
          series: [
            {
              name: chartParam.selectLine.selectFirstLabelLine,
              type: "line",
              //smooth: true,
              yAxisIndex: 0,
              data: appregnum,
              itemStyle: {
                normal: {
                  color: "#f44a4a",
                  lineStyle: {
                    color: "#f44a4a",
                    width: 1
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
            },
            {
              name: chartParam.selectLine.selectSecondLabelLine,
              type: "line",
              yAxisIndex: 1,
              //smooth: true,
              data: activenum,
              itemStyle: {
                normal: {
                  color: "#2d5aff",
                  lineStyle: {
                    color: "#2d5aff",
                    width: 1
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
            }
          ]
        };
      } else {
        option = {
          //1、 格式化提示信息
          grid: {
            width: "95%",
            height: "90%",
            left: "2%",
            right: "3%",
            bottom: "7%",
            containLabel: true
          },
          tooltip: {
            trigger: "axis",
            formatter: function(params) {
              let str = `<p>${params[0].name}</p>`;
              params.forEach(item => {
                if (item.seriesName !== "花费（元）¥ ") {
                  item.data = _that.$tools.toThousands(item.data, false);
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
              boundaryGap: false,
              axisPointer: {
                type: "line",
                lineStyle: {
                  color: "rgba(244, 74, 74, 0.06)",
                  width: 65
                }
              },
              axisLabel: {
                margin: 20,
                showMaxLabel: true,
                fontSize: 14,
                fontWeight: 400,
                color: "#999999"
              },
              interval: 0,
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
              minInterval: 5,
              interval: maxappreg === 0 ? 100 : interval_left,
              axisLine: {
                show: false,
                lineStyle: {
                  color: "#606266"
                }
              },
              axisTick: {
                show: false
              },
              splitLine: {
                lineStyle: {
                  color: "#f5f6f8"
                }
              },
              axisLabel: {
                color: "#999999",
                fontSize: 16,
                fontWeight: "normal",
                fontFamily: "DINMittelschrift",
                formatter: function(value, index) {
                  if (chartParam.selectLine.firstValue === 1) {
                    return "¥ " + value.toFixed(2);
                  } else {
                    return _that.$tools.toThousands(value, false);
                  }
                }
              }
            }
          ],
          series: [
            {
              name: chartParam.selectLine.selectFirstLabelLine,
              type: "line",
              // smooth: true,
              yAxisIndex: 0,
              data: appregnum,
              itemStyle: {
                normal: {
                  color: "#f44a4a",
                  lineStyle: {
                    color: "#f44a4a",
                    width: 1
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
      }
      this.myChart.setOption(option, true);
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
