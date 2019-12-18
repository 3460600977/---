<template>
  <div class="report-plan">
    <div class="report-top-form">
      <div class="report-divider">
        <el-divider direction="vertical"></el-divider>
        <span class="report-form-title">{{formatCentToYuan('formatCentToYuan')}}投放计划报表</span>
      </div>
      <el-form :inline="true" :model="reportFormInline" class="report-query-form">
        <el-form-item class="item-space-1">
          <el-select v-model="reportPlanValue" placeholder="输入投放计划名称">
            <el-option
              v-for="item in reportPlanList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="item-space-1">
          <el-select v-model="reportPlanValue" placeholder="输入投放方案名称">
            <el-option
              v-for="item in reportPlanList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="item-space-end">
          <el-date-picker
            v-model="getDefaultTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" plain>查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="report-select-card">
      <el-card :class="{'box-card':true,'select-box':selectCardIndex===itemCard.id}"
               v-for="(itemCard,key) in reportSelectCard" :cardIndex="itemCard.id"
               :key="key">
        <div class="card-center">
          <div class="card_name">
            {{itemCard.name }}
          </div>
          <div class="card_value font-number">
            {{itemCard.value}}
          </div>
        </div>
      </el-card>
    </div>
    <div class="report-bar-graph">
      <el-select v-model="barSelectOptions.default.value" :placeholder="barSelectOptions.default.label"
                 class="select_bar" @change="getSelectData">
        <el-option
          v-for="item in barSelectOptions.select"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <div class="report-bar-graph-data">
        <BarGraph :axisData="barGraphData" :barIndex="barIndex"></BarGraph>
      </div>
    </div>
    <div class="report-result-list">
      <div class="report-head">
        <h3 class="table-title">数据明细</h3>
        <el-button type="info" plain class="download-data">下载</el-button>
      </div>
      <el-table
        :data="tableData"
        @sort-change="getReportPlan"
        :default-sort="{prop: 'costNum', order: 'ascending'}"
        style="width: 100%"
        class="report-table">
        <el-table-column prop="name" label="投放方案" width="180">
          <router-link :to="{path:'/reportList/projectDetail'}" class="project-id">投放方案</router-link>
        </el-table-column>
        <el-table-column prop="startTime" label="投放时间" width="180"></el-table-column>
        <el-table-column prop="cost" label="花费数" sortable="custom">
        </el-table-column>
        <el-table-column prop="showTimes" label="曝光数" sortable="custom"></el-table-column>
        <el-table-column prop="deviceNum" label="设备数" sortable="custom"></el-table-column>
        <el-table-column prop="totalPeople" label="受众人数" sortable="custom"></el-table-column>
        <el-table-column prop="watchedTimes" label="受众观看次数" sortable="custom"></el-table-column>
      </el-table>
    </div>
    <div class="report-page">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="1000"
        :page-sizes="[10, 20, 30, 40,50]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        class="list-page"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
    import BarGraph from "../../../../../components/echarts/BarGraph";

    export default {
        name: "reportProjectList",
        components: {BarGraph},
        data() {
            return {
                defaultIntervalTime: 7,
                currentPage: 1,
                barIndex: 0,
                selectCardIndex: 0,
                reportPlanValue: '',
                reportDateValue: [],
                reportPlanList: [
                    {
                        value: '选项1',
                        label: '黄金糕'
                    }, {
                        value: '选项2',
                        label: '双皮奶'
                    }, {
                        value: '选项3',
                        label: '蚵仔煎'
                    }, {
                        value: '选项4',
                        label: '龙须面'
                    }, {
                        value: '选项5',
                        label: '北京烤鸭'
                    }],
                reportFormInline: {
                    user: '',
                    region: ''
                },
                reportSelectCard:
                    [
                        {
                            id: 0, name: '花费总数（元）', value: '100,000,0.00', field: 'cost'
                        },
                        {
                            id: 1, name: '曝光总数（次）', value: '100,000,0', field: 'showTimes'
                        },
                        {
                            id: 2, name: '设备总数（个）', value: '100,000,0', field: 'deviceNum'
                        },
                        {
                            id: 3, name: '受众总人数（人）', value: '100,000,0', field: 'totalPeople'
                        },
                        {
                            id: 4, name: '受众观看总次数（次）', value: '100,000,0', field: 'watchedTimes'
                        },
                    ],
                barSelectOptions: {
                    default: {
                        label: 'top 5',
                        value: 'get_five'
                    },
                    select: [
                        {
                            label: 'top 5',
                            value: 'get_five'
                        },
                        {
                            label: 'top 10',
                            value: 'get_ten'
                        }
                    ],
                },

                barGraphData: {
                    xAxis: {
                        data: [
                            '投放计划1', '投放计划2', '投放计划3', '投放计划4', '投放计划5',
                            '投放计划6', '投放计划7', '投放计划8', '投放计划9', '投放计划10'
                        ]
                    },
                    yAxis: {
                        name: '花费数',
                        max: 1250,
                        // data: [250, 500, 750, 1000, 1250]
                    },
                    series: {
                        barWidth: 56,
                        data: [1000, 500, 750, 600, 600, 750, 600, 600, 750, 750],
                        dataShadow: [1250, 1250, 1250, 1250, 1250, 1250, 1250, 1250, 1250, 1250]
                    },
                },
                tableData: [{
                    date: '2016-05-02',
                    name: '投放计划1',
                    costNum: '100',
                    exposureNum: '900',
                    deviceNum: '1200',
                    watchAudiences: '102000',
                    watchNum: '102000'
                }, {
                    date: '2016-05-02',
                    name: '投放计划2',
                    costNum: '100',
                    exposureNum: '900',
                    deviceNum: '1200',
                    watchAudiences: '102000',
                    watchNum: '102000'
                }, {
                    date: '2016-05-02',
                    name: '投放计划3',
                    costNum: '100',
                    exposureNum: '900',
                    deviceNum: '1200',
                    watchAudiences: '102000',
                    watchNum: '102000'
                }, {
                    date: '2016-05-02',
                    name: '投放计划4',
                    costNum: '100',
                    exposureNum: '900',
                    deviceNum: '1200',
                    watchAudiences: '102000',
                    watchNum: '102000'
                }]
            }
        },
        mounted() {
            //获取方案的初始列表
            //获取默认日期下的统计查询
            let params = {
                startTime: this.$tools.getMonthFirstDay(),//开始时间 require
                endTime: this.$tools.getMonthLastDay(),//结束时间 require
            }
            this.getProjectTotal(params)
            //获取方案报表的柱状图数据
            this.getProjectBarChart(params)
            // this.getProjectList()
            // this.getProjectBarChart()
            // this.getProjectDownloadList()
            // this.getProjectTotal()
        },
        computed: {
            getDefaultTime: function () {
                return [this.$tools.getMonthFirstDay(), this.$tools.getMonthLastDay()]
            }
        },
        methods: {
            onSubmit() {
                console.log('submit!');
            },
            getSelectData() {
                console.log(22);
                this.barGraphData = {xAxis: [], yAxis: []};
                this.barIndex = 3;
                console.log('getSelectData:', this.barGraphData.xAxis, this.barIndex)
            },
            getReportPlan() {
                console.log('get plan report data')
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
            },
            formatCentToYuan(str) {
                return str.slice(0, 5)
            },
            //方案报表的统计查询
            getProjectTotal(param) {
                //必须参数
                let queryParam = {
                    startTime: '2019-12-02',//开始时间 require
                    endTime: '2019-12-31',//结束时间 require
                }
                //合并查询参数
                Object.assign(queryParam, param);
                console.log(queryParam)
                //请求方案报表列表查询接口
                this.$api.Report.getProjectTotal(queryParam)
                    .then(res => {
                        let cardList = res.result;
                        this.reportSelectCard.forEach(item => {
                            let property = item.field;
                            if (cardList.hasOwnProperty(property)) {
                                if (cardList[property] === '') {
                                    item.value = 0
                                } else if (property === 'cost') {
                                    let costValue = cardList[property]
                                    costValue = this.$tools.formatCentToYuan(costValue)
                                    item.value = this.$tools.toThousands(costValue)
                                } else {
                                    item.value = this.$tools.toThousands(cardList[property], false)
                                }
                            }
                        })
                    })
                    .catch(res => {
                    })
            },
            //获取方案报表的柱状图数据
            getProjectBarChart(param) {
                //必须参数
                let queryParam = {
                    startTime: '2019-12-01',//开始时间 require
                    endTime: '2019-12-31',//结束时间 require
                    showStatus: 0,//柱状图排序 0花费总数 1曝光次数 2设备总个数 3受众总人数 4受众观看次数
                    topStatus: 5//top数据类型 5 或者 10
                }
                //合并查询参数
                Object.assign(queryParam, param);
                //请求方案报表列表查询接口
                this.$api.Report.getProjectChartBar(queryParam)
                    .then(res => {
                        console.log('柱状图数据', res.result)

                    })
                    .catch(res => {
                        console.log(res.result)
                    })
            },
            //获取方案报表的列表下载数据-默认500条
            getProjectDownloadList(param) {
                //必须参数
                let queryParam = {
                    startTime: '2019-12-01',//开始时间 require
                    endTime: '2019-12-31',//结束时间 require
                    formShowStatus: 0,//列表排序 0花费数正序 1花费数倒序 2曝光数正序 3曝光数倒序 4设备数正序 5设备数倒序 6受众人数正序 7受众人数倒序 8受众观看数正序 9受众观看数倒序
                }
                //合并查询参数
                Object.assign(queryParam, param);
                //请求方案报表列表查询接口
                this.$api.Report.getProjectDownloadList(queryParam)
                    .then(res => {
                        console.log('下载数据', res)
                    })
                    .catch(res => {
                        console.log(res.result)
                    })
            },
            //获取方案报表的列表-默认每页10条
            getProjectList(param) {
                //必须参数
                let queryParam = {
                    startTime: '2019-12-01',//开始时间 require
                    endTime: '2019-12-31',//结束时间 require
                    formShowStatus: 0,//列表排序 0花费数正序 1花费数倒序 2曝光数正序 3曝光数倒序 4设备数正序 5设备数倒序 6受众人数正序 7受众人数倒序 8受众观看数正序 9受众观看数倒序
                }
                //合并查询参数
                Object.assign(queryParam, param);
                //请求方案报表列表查询接口
                this.$api.Report.getProjectList(queryParam)
                    .then(res => {
                        console.log(res.result)
                        let projectList = res.result
                        this.tableData = projectList
                    })
                    .catch(res => {
                        console.log(res.result)
                    })
            },
        }
    }
</script>

<style lang="scss">
  #chartBox {
    height: 250px;
    width: 100%;
  }

  .report-top-form {
    height: 160px;
    border-radius: 4px;
    background-color: $color-bg-3;
    padding: 30px 0 37px 38px;

    .report-divider {
      .el-divider {
        background-color: $color-blue;
        border-radius: 2px;
        width: 3px;
        margin: 0 5px 0 0;
      }

      .report-form-title {
        font-size: 16px;
        font-weight: bold;
        color: $color-text;
      }
    }

    .report-query-form {
      margin-top: 41px;

      .el-range-separator {
        width: 10%;
      }

      .item-space-1 {
        margin: 0 47px 0 0;
      }

      .item-space-end {
        margin: 2px 20px 0 0;
      }

      .el-select .el-input .el-select__caret {
        color: $color-blue;
      }
    }
  }

  .report-select-card {

    overflow: hidden;
    white-space: nowrap;
    width: 100%;
    margin-top: 30px;

    .box-card {
      width: calc(20% - 20px);
      height: 120px;
      border-radius: 4px;
      background-color: $color-bg-3;
      display: inline-block;
      margin-left: 25px;
      color: $color-text;
      margin-top: 0;

      .el-card__body {
        display: table;
        height: 100%;
        padding: 0;

        .card-center {
          display: table-cell;
          vertical-align: middle;
          padding-left: 20%;
        }
      }

      .card_name {
        font-size: 14px;
        font-weight: 400;
        margin-bottom: 14px;
      }

      .card_value {
        font-size: 26px;
        font-weight: normal;
      }

      &.select-box {
        background: rgba(45, 90, 255, 1);
        box-shadow: 0px 13px 27px 0px rgba(45, 90, 255, 0.25);
        color: $color-bg-3;
      }
    }

    .box-card:first-child {
      margin-left: 0;
    }
  }

  .report-bar-graph {
    background-color: $color-bg-3;
    border-radius: 4px;
    height: 100%;
    width: 100%;
    margin-top: 30px;
    position: relative;

    .select_bar {
      font-size: 14px;
      height: 40px;
      margin: 20px 0 0 28px;
    }

    .report-bar-graph-data {
      height: 531px;
      width: 100%;
    }
  }

  .report-result-list {

    margin-top: 30px;

    .report-head {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-content: flex-start;
      padding: 5px 30px;

      .download-data {
        width: 100px;
        font-size: 16px;
        font-weight: 400;
        color: $color-text;
        background-color: $color-bg-5 !important;
        border-radius: 2px;
        padding: 8px 0;
      }

      .table-title {
        font-size: 16px;
        font-weight: bold;
        color: $color-table-title;
      }
    }

    .report-table {
      margin: 0;
      margin-bottom: 37px;
      background-color: $color-bg !important;

      table {
        width: 100%;
        text-align: center;
      }

      th {
        font-size: 14px;
        font-weight: bold;
        color: $color-table-title;
        background-color: $color-bg;
        border-bottom: 0;
        display: table-cell;
        vertical-align: middle;
        text-align: center;
      }

      td {
        border-top: 10px solid $color-bg;
        font-size: 16px;
        font-weight: normal;
        font-family: DINMittelschrift;
        color: $color-text;
        display: table-cell;
        vertical-align: middle;
        text-align: inherit;
      }


      tr:first-child td {
        border-top: 0;
      }

      tr td:first-child {
        border-radius: 4px;
      }

      .project-id {
        font-size: 14px;
        font-weight: 400;
        color: $color-blue;
        text-decoration: none;
        cursor: pointer;
      }

      tr td:nth-child(2) {
        font-size: 14px;
        font-weight: 400;
        color: $color-text;
      }

      tr td:last-child {
        border-radius: 4px;
      }

      tr:hover > td {
        background-color: $color-bg-3 !important
      }

      tr > td {
        background-color: $color-bg-3 !important
      }
    }
  }

  .report-page {
    background-color: $color-bg-3;
    padding: 43px 0;
    text-align: center;
    border-radius: 4px;
    height: 120px;
    margin-top: 30px;

    li.active {
      background-color: $color-blue !important;
    }
  }

</style>
