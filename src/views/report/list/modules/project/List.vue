<template>
  <div class="report-plan">
    <div class="report-top-form">
      <div class="report-divider">
        <el-divider direction="vertical"></el-divider>
        <span class="report-form-title">投放计划报表</span>
      </div>
      <el-form :inline="true" :model="projectList" class="report-query-form">
        <el-form-item class="item-space-1">
          <el-select v-model="projectList.campaignId" placeholder="输入投放计划名称"
                     :loading="reportPlanList.loading"
                     @change="changePlanValue" clearable filterable>
            <el-option
              v-for="item in reportPlanList.data"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="item-space-1">
          <el-select v-model="projectList.id" placeholder="输入投放方案名称"
                     :loading="reportProjectList.loading"
                     clearable filterable>
            <el-option
              v-for="item in reportProjectList.data"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="item-space-end">
          <el-date-picker
            v-model="projectList.selectTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="chooseReportTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" plain>查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="report-select-card">
      <el-card :class="{'box-card':true,'select-box':reportSelectCard.selectCardIndex===itemCard.id}"
               v-for="(itemCard,key) in reportSelectCard.data" :cardIndex="itemCard.id"
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
        <BarGraph :axisData="barGraphData.data" :barIndex="barIndex"></BarGraph>
      </div>
    </div>
    <div class="report-result-list">
      <div class="report-head">
        <h3 class="table-title">数据明细</h3>
        <el-button type="info" plain class="download-data" :loading="reportDownload.loading"
                   @click="downloadProjectList">下载
        </el-button>
      </div>
      <el-table
        :data="resultData"
        @sort-change="tableSort"
        :default-sort="{prop: 'costNum', order: 'ascending'}"
        style="width: 100%"
        class="report-table">
        <el-table-column prop="projectName" label="投放方案">
          <template slot-scope="scope">
            <router-link :to="{path:'/reportList/projectDetail?projectId='+scope.row['projectId']}" class="project-id">
              {{scope.row[scope.column.property]}}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="投放时间"></el-table-column>
        <el-table-column prop="cost" label="花费数" sortable="custom"></el-table-column>
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
        :total="totalCount"
        :page-sizes="pageSizeSelectable"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        class="list-page"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
    import BarGraph from "../../../../../components/echarts/BarGraph";
    //import {tableMixin} from '../../../mixins/tableMixin'
    const PAGE_SIZE = [10, 20, 30, 40, 50]
    export default {
        name: "reportProjectList",
        //mixins: [tableMixin],
        components: {BarGraph},
        data() {
            return {
                barIndex: 0,
                currentPage: 1,
                reportPlanList: {data: [], loading: false},
                reportProjectList: {data: [], loading: false},
                reportSelectCard: {
                    data: [
                        {
                            id: 0, name: '花费总数（元）', value: '', field: 'cost'
                        },
                        {
                            id: 1, name: '曝光总数（次）', value: '', field: 'showTimes'
                        },
                        {
                            id: 2, name: '设备总数（个）', value: '', field: 'deviceNum'
                        },
                        {
                            id: 3, name: '受众总人数（人）', value: '', field: 'totalPeople'
                        },
                        {
                            id: 4, name: '受众观看总次数（次）', value: '', field: 'watchedTimes'
                        },
                    ],
                    loading: false,
                    selectCardIndex: 0,
                },
                barSelectOptions: {
                    loading: false,
                    data: [],
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
                    loading: false,
                    data: {
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
                    }
                },
                reportDownload: {
                    data: [],
                    loading: false
                },
                totalCount: 0, // 总共条数
                pageSizeSelectable: PAGE_SIZE,
                resultData: null,
                pageIndex: 1,
                pageSize: 10,
                loading: false,
                projectList: {
                    selectTime: [],
                    startTime: '',//开始时间
                    endTime: '',//结束时间
                    formShowStatus: 0,//列表排序 0花费数正序 1花费数倒序 2曝光数正序 3曝光数倒序 4设备数正序 5设备数倒序 6受众人数正序 7受众人数倒序 8受众观看数正序 9受众观看数倒序
                    sortField: 'cost',
                    sortType: 0,
                    topStatus: 5,//top数据类型 5 或者 10
                    campaignId: '',//计划id
                    id: '',//方案id
                },
            }
        },
        mounted() {
            this.projectList.startTime = this.$tools.getMonthFirstDay()
            this.projectList.endTime = this.$tools.getMonthLastDay()
        },
        created() {
            this.projectList.startTime = this.$tools.getMonthFirstDay()
            this.projectList.endTime = this.$tools.getMonthLastDay()
            this.projectList.selectTime = [this.projectList.startTime, this.projectList.endTime]
            //获取计划名称列表
            this.getPlanNameList()
            //获取方案名称列表
            this.getProjectNameList()
            //获取默认状态下的卡片数据
            this.getProjectTotal()
            //获取默认状态下的柱状图数据
            this.getProjectBarChart()
            //获取默认状态下的列表数据
            this.getProjectList()
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
            handleSizeChange(size) {
                this.pageSize = size
                //console.log(`每页 ${size} 条`);
            },
            handleCurrentChange(currentPage) {
                //console.log(`当前页: ${currentPage}`);
                this.pageIndex = currentPage
                this.getProjectList()
            },
            formatCentToYuan(str) {
                return str.slice(0, 5)
            },
            //触发改变时间选择器的值
            chooseReportTime(changeVal) {
                this.projectList.startTime = changeVal[0]
                this.projectList.endTime = changeVal[1]
            },
            //触发改变投放计划事件
            changePlanValue(selVal) {
                this.getProjectListInPlan(selVal)
            },
            //触发下载事件
            downloadProjectList() {
                let param = {}
                this.getProjectDownloadList(param)
            },
            //获取计划名称列表
            getPlanNameList() {
                //该接口没有必须参数，可选参数
                //请求获取计划名称列表
                this.reportPlanList.loading = true
                this.$api.PutPlan.PlanNameList()
                    .then(res => {
                        this.reportPlanList.data = res.result
                        this.reportPlanList.loading = false
                    })
                    .catch(res => {
                        this.reportPlanList.loading = false
                    })
            },
            //获取方案名称列表
            getProjectNameList() {
                //该接口没有必须参数，可选参数
                //请求获取方案名称列表
                this.reportProjectList.loading = true
                this.$api.PutProject.ProjectNameList()
                    .then(res => {
                        this.reportProjectList.data = res.result
                        this.reportProjectList.loading = false
                    })
                    .catch(res => {
                        this.reportProjectList.loading = false
                    })
            },
            //获取计划下的名称列表
            getProjectListInPlan(camId) {
                //请求获取计划下的名称列表
                this.reportProjectList.loading = true
                this.$api.PutProject.ProjectNameListByCamId(camId)
                    .then(res => {
                        this.reportProjectList.data = res.result
                        this.reportProjectList.loading = false
                    })
                    .catch(res => {
                        this.reportProjectList.loading = false
                    })
            },
            //方案报表的统计查询
            getProjectTotal(param) {
                //必须参数
                let queryParam = {
                    startTime: this.projectList.startTime,
                    endTime: this.projectList.endTime,
                    campaignId: this.projectList.campaignId,
                    id: this.projectList.id,
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize,
                }
                //合并查询参数
                Object.assign(queryParam, param);
                //请求方案报表列表查询接口
                this.reportSelectCard.loading = true
                this.$api.Report.getProjectTotal(queryParam)
                    .then(res => {
                        this.reportSelectCard.loading = false
                        let cardList = res.result;
                        this.reportSelectCard.data.forEach(item => {
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
                        this.reportSelectCard.loading = false
                    })
            },
            //获取方案报表的柱状图数据
            getProjectBarChart(param) {
                //必须参数
                let queryParam = {
                    startTime: this.projectList.startTime,
                    endTime: this.projectList.endTime,
                    sortList: [
                        {
                            sortField: this.projectList.sortField,
                            sortType: 1
                        }
                    ],
                    topStatus: this.projectList.topStatus,
                    campaignId: this.projectList.campaignId,
                    id: this.projectList.id,
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize,
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
                let queryParam = {
                    startTime: this.projectList.startTime,
                    endTime: this.projectList.endTime,
                    sortList: [
                        {
                            sortField: this.projectList.sortField,
                            sortType: this.projectList.sortType
                        }
                    ],
                    campaignId: this.projectList.campaignId,
                    id: this.projectList.id,
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize,
                }
                //合并查询参数
                Object.assign(queryParam, param)
                //请求方案报表列表查询接口
                console.log('getProjectDownloadList', queryParam)
                this.reportDownload.loading = true
                this.$api.Report.getProjectDownloadList(queryParam)
                    .then(res => {
                        this.reportDownload.loading = false
                        this.$tools.downLoadFileFlow(res, `投放方案列表${this.$tools.getFormatDate("YYmmdd")}.xsl`)
                    })
                    .catch(res => {
                        this.reportDownload.loading = false
                    })
            },
            //获取方案报表的列表-默认每页10条
            getProjectList(param) {
                //必须参数
                let queryParam = {
                    startTime: this.projectList.startTime,
                    endTime: this.projectList.endTime,
                    sortList: [
                        {
                            sortField: this.projectList.sortField,
                            sortType: this.projectList.sortType
                        }
                    ],
                    campaignId: this.projectList.campaignId,
                    id: this.projectList.id,
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize,
                }
                //合并查询参数
                Object.assign(queryParam, param)
                //请求方案报表列表查询接口
                this.loading = true
                this.$api.Report.getProjectList(queryParam)
                    .then(res => {
                        this.loading = false
                        this.resultData = res.result
                        this.totalCount = res.page.totalCount
                        this.pageIndex = res.page.currentPage
                    })
                    .catch(res => {
                        this.loading = false
                    })
            },
            loadFunction(param) {
                const data = {...this.projectList, ...param}
                return new Promise((resolve, reject) => {
                    this.$api.toolBox.getResourceBundle(data).then(res => {
                        resolve(res);
                    }).catch((res) => {
                        reject(res)
                    })
                });
            },
            tableSort(column) {
                this.pageIndex = 1
                this.projectList.sortField = column.prop
                if (column.order === 'descending') {
                    this.projectList.sortType = 1
                }
                if (column.order === 'ascending') {
                    this.projectList.sortType = 0
                }
                this.getProjectList()
            }
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
