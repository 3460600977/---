<template>
  <div class="report-plan">
    <div class="report-top-form">
      <div class="report-divider">
        <p class="db-title">投放计划报表</p>
      </div>
      <el-form :inline="true" :model="planList" class="report-query-form">
        <el-form-item class="item-space-1">
          <el-select
            v-model="planList.selectPlan"
            placeholder="请选择投放计划"
            :loading="reportPlanList.loading"
            @change="changePlanValue"
            @clear="clearPlanValue"
            clearable
            filterable
          >
            <el-option
              v-for="item in reportPlanList.data"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="item-space-end">
          <el-date-picker
            v-model="planList.selectTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="chooseReportTime"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" plain>查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="report-select-card" :loading="reportSelectCard.loading">
      <el-card
        :class="{'box-card':true,'select-box':reportSelectCard.selectCardIndex===itemCard.id}"
        v-for="(itemCard,key) in reportSelectCard.data"
        :cardIndex="itemCard.id"
        :key="key"
      >
        <div class="card-center" @click="chooseCard(itemCard.field,itemCard.id)">
          <div class="card_name">{{itemCard.name }}</div>
          <div class="card_value font-number">{{itemCard.value}}</div>
        </div>
      </el-card>
    </div>
    <div class="report-bar-graph">
      <el-select
        v-model="barSelectOptions.default.value"
        :placeholder="barSelectOptions.default.label"
        class="select_bar"
        @change="getBarSelectData"
      >
        <el-option
          v-for="item in barSelectOptions.select"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <div class="report-bar-graph-data">
        <BarGraph :axisData="barGraphData.data" :loading="barGraphData.loading"></BarGraph>
      </div>
    </div>
    <div class="report-result-list">
      <div class="report-head">
        <h3 class="table-title">数据明细</h3>
        <el-button
          type="info"
          plain
          class="download-data"
          :loading="reportDownload.loading"
          @click="downloadPlanList"
        >下载</el-button>
      </div>
      <el-table
        :loading="loading"
        :data="resultData"
        @sort-change="tableSort"
        :default-sort="{prop: 'costNum', order: 'ascending'}"
        style="width: 100%"
        class="report-table"
      >
        <el-table-column prop="campaignName" label="投放计划">
          <template slot-scope="scope">
            <router-link
              :to="{path:'/reportList/project?campaignId='+scope.row['campaignId']}"
              class="project-id"
            >{{scope.row[scope.column.property]}}</router-link>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="startTime" label="投放时间" min-width="105">
          <template slot-scope="scope">
            <span class="report-time">{{scope.row[scope.column.property]}}</span>
          </template>
        </el-table-column>-->
        <el-table-column prop="cost" label="花费数（元）" sortable="custom"></el-table-column>
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
import { getUserInfo } from "@/utils/auth";
//import {tableMixin} from '../../../mixins/tableMixin'
const PAGE_SIZE = [10, 20, 30, 40, 50];
export default {
  name: "reportPlanList",
  components: { BarGraph },
  data() {
    return {
      companyName: "未知公司名",
      planId: null,
      reportPlanList: { data: [], loading: false },
      reportSelectCard: {
        data: [
          {
            id: 0,
            name: "花费总数（元）",
            value: "暂无数据",
            field: "cost",
            title: "花费总数（元）"
          },
          {
            id: 1,
            name: "曝光总数（次）",
            value: "暂无数据",
            field: "showTimes",
            title: "曝光总数（次）"
          },
          {
            id: 2,
            name: "设备总数（个）",
            value: "暂无数据",
            field: "deviceNum",
            title: "设备总数（个）"
          },
          {
            id: 3,
            name: "受众总人数（人）",
            value: "暂无数据",
            field: "totalPeople",
            title: "受众总人数（人）"
          },
          {
            id: 4,
            name: "受众观看总次数（次）",
            value: "暂无数据",
            field: "watchedTimes",
            title: "受众观看总次数（次）"
          }
        ],
        loading: false,
        selectCardIndex: 0
      },
      barSelectOptions: {
        default: {
          label: "top 5",
          value: "5"
        },
        select: [
          {
            label: "top 5",
            value: "5"
          },
          {
            label: "top 10",
            value: "10"
          }
        ]
      },
      barGraphData: {
        loading: false,
        data: {}
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
      planList: {
        selectPlan: "",
        selectTime: [],
        startTime: "", //开始时间
        endTime: "", //结束时间
        formShowStatus: 0, //列表排序 0花费数正序 1花费数倒序 2曝光数正序 3曝光数倒序 4设备数正序 5设备数倒序 6受众人数正序 7受众人数倒序 8受众观看数正序 9受众观看数倒序
        sortField: "cost",
        sortType: 0,
        topStatus: 5, //top数据类型 5 或者 10
        campaignId: "", //计划id
        id: "" //方案id
      }
    };
  },
  created() {
    if (
      this.$route.query.campaignId === "" ||
      this.$route.query.campaignId === null ||
      this.$route.query.campaignId === undefined
    ) {
    } else {
      this.planList.campaignId = this.$route.query.campaignId;
    }
    this.planList.startTime = this.$tools.getMonthFirstDay();
    this.planList.endTime = this.$tools.getMonthLastDay();
    if (
      this.$route.query.planTime === "" ||
      this.$route.query.planTime === null ||
      this.$route.query.planTime === undefined
    ) {
    } else {
      let planTime = this.$route.query.planTime.split("~");
      this.planList.startTime = planTime[0];
      this.planList.endTime = planTime[1];
    }
    this.planList.selectTime = [this.planList.startTime, this.planList.endTime];
    let userInfo = getUserInfo();
    if (
      !userInfo.company ||
      userInfo.company.match(/^[ ]*$/) ||
      userInfo.company != null ||
      userInfo.company != undefined
    ) {
      // "",null,undefined,NaN
      this.companyName = userInfo.company;
    }
    //获取计划名称列表
    this.getPlanNameList();
    // //获取默认状态下的卡片数据
    this.getPlanTotal();
    // //获取默认状态下的柱状图数据
    this.getPlanBarChart();
    // //获取默认状态下的列表数据
    this.getPlanList();
  },
  methods: {
    onSubmit() {
      this.pageIndex = 1;
      //获取默认状态下的卡片数据
      this.getPlanTotal();
      //获取默认状态下的柱状图数据
      this.getPlanBarChart();
      //获取默认状态下的列表数据
      this.getPlanList();
    },
    //触发改变投放计划事件
    changePlanValue(selVal) {
      this.planList.campaignId = selVal;
    },
    //清空投放计划
    clearPlanValue() {
      this.planList.campaignId = "";
      this.planList.selectPlan = "";
    },
    //top5 top10更换
    getBarSelectData(chooseValue) {
      this.planList.topStatus = chooseValue;
      this.getPlanBarChart();
    },
    //卡片更换
    chooseCard(cardField, cardIndex) {
      this.planList.sortField = cardField;
      this.reportSelectCard.selectCardIndex = cardIndex;
      this.getPlanBarChart();
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.getPlanList();
    },
    handleCurrentChange(currentPage) {
      this.pageIndex = currentPage;
      this.getPlanList();
    },
    //触发改变时间选择器的值
    chooseReportTime(changeVal) {
      this.planList.startTime = changeVal[0];
      this.planList.endTime = changeVal[1];
    },
    //触发下载事件
    downloadPlanList() {
      let param = {};
      this.getPlanDownloadList(param);
    },
    //获取计划名称列表
    getPlanNameList() {
      //该接口没有必须参数，可选参数
      //请求获取计划名称列表
      this.reportPlanList.loading = true;
      this.$api.PutPlan.PlanNameList()
        .then(res => {
          this.reportPlanList.data = res.result;
          this.reportPlanList.data.forEach(item => {
            if (item.id == this.planList.campaignId) {
              this.planList.selectPlan = item.name;
            }
          });
          this.reportPlanList.loading = false;
        })
        .catch(res => {
          this.reportPlanList.data = [];
          this.reportPlanList.loading = false;
        });
    },
    //方案报表的统计查询
    getPlanTotal(param) {
      //必须参数
      let queryParam = {
        startTime: this.planList.startTime,
        endTime: this.planList.endTime,
        campaignId: this.planList.campaignId,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      };
      //合并查询参数
      Object.assign(queryParam, param);
      //请求方案报表列表查询接口
      this.reportSelectCard.loading = true;
      this.$api.Report.getPlanTotal(queryParam)
        .then(res => {
          this.reportSelectCard.loading = false;
          let cardList = res.result;
          this.reportSelectCard.data.forEach(item => {
            let property = item.field;
            if (cardList.hasOwnProperty(property)) {
              if (cardList[property] === "" || cardList[property] === null) {
                item.value = 0;
              } else if (property === "cost") {
                let costValue = cardList[property];
                item.value = "¥ " + this.$tools.toThousands(costValue/100);
              } else {
                item.value = this.$tools.toThousands(cardList[property], false);
              }
            }
          });
        })
        .catch(res => {
          this.reportSelectCard.data.forEach(item => {
            item.value = "暂无数据";
          });
          this.reportSelectCard.loading = false;
        });
    },
    //获取方案报表的柱状图数据
    getPlanBarChart(param) {
      //必须参数
      let queryParam = {
        startTime: this.planList.startTime,
        endTime: this.planList.endTime,
        sortField: this.planList.sortField,
        topStatus: this.planList.topStatus,
        campaignId: this.planList.campaignId,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      };
      //合并查询参数
      Object.assign(queryParam, param);
      //请求方案报表列表查询接口
      this.barGraphData.loading = true;
      this.$api.Report.getPlanChartBar(queryParam)
        .then(res => {
          this.barGraphData.loading = false;
          let xdata = [];
          let sdata = [];
          let sdataShadow = [];
          let ymax = 0;
          let _that = this;
          res.result.forEach((item, index) => {
            xdata[index] = item.campaignName;
            sdata[index] = item.data;
            if (ymax < item.data) {
              ymax = item.data;
            }
          });

          this.barGraphData.data = {
            sortField: this.planList.sortField,
            topStatus: this.planList.topStatus,
            title: this.getCardName(),
            xAxis: {
              data: xdata
            },
            yAxis: {
              splitNumber: 8,
              max: function(value) {
                return value.max;
              }
            },
            series: {
              data: sdata
            }
          };
        })
        .catch(res => {
          this.barGraphData.data = {
            sortField: this.planList.sortField,
            topStatus: this.planList.topStatus,
            title: this.getCardName(),
            xAxis: {
              data: []
            },
            yAxis: {
              splitNumber: 8,
              max: 0
            },
            series: {
              data: []
            }
          };
          this.barGraphData.loading = false;
        });
    },
    //获取方案报表的列表下载数据-默认500条
    getPlanDownloadList(param) {
      let queryParam = {
        startTime: this.planList.startTime,
        endTime: this.planList.endTime,
        sortList: [
          {
            sortField: this.planList.sortField,
            sortType: this.planList.sortType
          }
        ],
        campaignId: this.planList.campaignId,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      };
      //合并查询参数
      Object.assign(queryParam, param);
      //请求方案报表列表查询接口
      this.reportDownload.loading = true;
      this.$api.Report.getPlanDownloadList(queryParam)
        .then(res => {
          this.reportDownload.loading = false;
          if (this.companyName === undefined) {
            this.companyName = "未知公司";
          }
          this.$tools.downLoadFileFlow(
            res,
            `投放计划报表+${this.companyName}+${this.$tools.getFormatDate(
              "YYmmdd_HHMMSSccc"
            )}.xls`
          );
        })
        .catch(res => {
          this.reportDownload.loading = false;
        });
    },
    //获取方案报表的列表-默认每页10条
    getPlanList(param) {
      //必须参数
      let queryParam = {
        startTime: this.planList.startTime,
        endTime: this.planList.endTime,
        sortList: [
          {
            sortField: this.planList.sortField,
            sortType: this.planList.sortType
          }
        ],
        campaignId: this.planList.campaignId,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      };
      //合并查询参数
      Object.assign(queryParam, param);
      //请求方案报表列表查询接口
      this.loading = true;
      this.$api.Report.getPlanList(queryParam)
        .then(res => {
          this.loading = false;
          this.resultData = res.result;
          this.totalCount = res.page.totalCount;
          this.pageIndex = res.page.currentPage;
          this.resultData.forEach(item => {
            let costValue = item.cost;
            item.cost = "¥ " + this.$tools.toThousands(costValue/100);
            item.startTime = item.startTime + "~" + item.endTime;
          });
        })
        .catch(res => {
          this.resultData = [];
          this.loading = false;
        });
    },
    tableSort(column) {
      this.pageIndex = 1;
      this.planList.sortField = column.prop;
      if (column.order === "descending") {
        this.planList.sortType = 1;
      }
      if (column.order === "ascending") {
        this.planList.sortType = 0;
      }
      this.getPlanList();
    },
    getCardName() {
      let cardName = "";
      this.reportSelectCard.data.forEach(item => {
        let property = item.field;
        let sortFieldName = this.planList.sortField;
        if (property === sortFieldName) {
          return (cardName = item.title);
        }
      });
      return cardName;
    }
  }
};
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
      background-color: $color-main;
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
      color: $color-main;
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
    cursor: pointer;
    .el-card__body {
      display: table;
      height: 100%;
      width: 100%;
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
      font-family: DINMittelschrift;
    }
    &.select-box {
      background: $color-main;
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
      color: $color-origin-blue;
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
      background-color: $color-bg-3 !important;
    }
    tr > td {
      background-color: $color-bg-3 !important;
    }
    .report-time {
      font-size: 14px;
      font-weight: 400;
      color: $color-text;
      font-family: Microsoft YaHei;
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
    background-color: $color-main !important;
  }
}
</style>
