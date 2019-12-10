<template>
  <div ref="chartBox" class="chartBarGraphBox"></div>
</template>

<script>
    import echarts from 'echarts'

    export default {
        name: "BarGraph",
        components: {echarts},
        props: {
            title: {
                type: String,
                default: '投放报告'
            },
            axisData: {
                type: Object,
                required: true
            },
            barIndex: {
                type: Number,
                default: 2
            }
        },
        data() {
            return {
                chart: null
            }
        },
        mounted() {
            this.initChart()
        },
        updated() {
            console.log('child:updated:', this.title, this.barIndex);
        },
        computed: {
            testXData: function () {
                console.log('child:testXData：', this.axisData.xAxis.data)
                return this.axisData.xAxis.data
            },
            testIndex: function () {
                console.log('child:testIndex：', this.barIndex)
            }
        },
        methods: {
            initChart() {
                let myChart = echarts.init(this.$refs.chartBox);
                let option = {
                    title: {
                        text: '花费数',
                        textStyle: {
                            fontSize: '14',
                            fontWeight: '400',
                            color: 'rgba(24,24,25,1)',
                        },
                        top: 0,
                        left: 28,
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
                        data: this.testXData,
                        axisTick: {show: false},
                        axisLabel: {
                            color: '#999999',
                            fontSize: 14,
                            fontWeight: 400,
                            margin: 20,
                        },
                    },
                    yAxis: {
                        axisLine: {show: false},
                        type: 'value',
                        max: this.axisData.yAxis.max,
                        data: this.axisData.yAxis.data,
                        interval: 250,
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
                        { // For shadow
                            type: 'bar',
                            itemStyle: {

                                normal: {color: 'rgba(110,136,195,0.14)'}
                            },
                            barGap: '-100%',
                            barCategoryGap: 56,
                            data: this.axisData.series.dataShadow,
                            animation: false,
                            barWidth: 56,
                            legendHoverLink: false,
                            markLine: {
                                lineStyle: {color: '#F5F6F8'}
                            },
                        },
                        {
                            type: 'bar',
                            itemStyle: {
                                normal: {color: 'rgba(45,90,255,1)'}
                            },
                            legendHoverLink: false,
                            barWidth: 56,
                            data: this.axisData.series.data,
                            animation: false,
                            markLine: {
                                lineStyle: {color: '#F5F6F8'}
                            }
                        }]
                };
                myChart.setOption(option);
            }
        },
        watch: {
            // 如果 `question` 发生改变，这个函数就会运行
            barIndex: function (newQuestion, oldQuestion) {
                console.log('child:watch,testIndex：', this.barIndex)
            }
        },
    }
</script>

<style lang="scss">
  .chartBarGraphBox {
    width: 100%;
    height: 100%;
    margin-top: 26px;
  }
</style>
