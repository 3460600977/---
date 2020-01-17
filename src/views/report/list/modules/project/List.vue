<template>
  <div class="report-plan">
    <div class="report-top-form">
      <div class="report-divider">
        <p class="db-title">投放方案报表</p>
      </div>
      <el-form :inline="true" :model="projectList" class="report-query-form">
        <el-form-item class="item-space-1">
          <el-select
            v-model="projectList.selectPlan"
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
        <el-form-item class="item-space-1">
          <el-select
            v-model="projectList.selectProject"
            placeholder="请选择投放方案"
            :loading="reportProjectList.loading"
            @change="changeProjectValue"
            @clear="clearProjectValue"
            clearable
            filterable
          >
            <el-option
              v-for="item in reportProjectList.data"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
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
            @change="chooseReportTime"
            :picker-options="pickerOptions"
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
        :cardIndex="itemCard.field"
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
          @click="downloadProjectList"
        >下载</el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="resultData"
        @sort-change="tableSort"
        :default-sort="{prop: 'costNum', order: 'ascending'}"
        style="width: 100%"
        class="report-table"
      >
        <el-table-column prop="projectName" label="投放方案">
          <template slot-scope="scope">
            <router-link
              :to="{path:'/reportList/projectDetail?projectId='+scope.row['projectId']}"
              class="project-id"
            >{{scope.row[scope.column.property]}}</router-link>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="投放时间" min-width="105">
          <template slot-scope="scope">
            <span class="report-time">{{scope.row[scope.column.property]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cost" label="花费数（元）" sortable="custom"></el-table-column>
        <el-table-column prop="showTimes" label="曝光数" sortable="custom">
          <template slot-scope="scope">{{$tools.toThousands(scope.row['showTimes'],false)}}</template>
        </el-table-column>
        <el-table-column prop="deviceNum" label="设备数" sortable="custom">
          <template slot-scope="scope">{{$tools.toThousands(scope.row['deviceNum'],false)}}</template>
        </el-table-column>
        <el-table-column prop="totalPeople" label="受众人数" sortable="custom">
          <template slot-scope="scope">{{$tools.toThousands(scope.row['totalPeople'],false)}}</template>
        </el-table-column>
        <el-table-column prop="watchedTimes" label="受众观看次数" sortable="custom">
          <template slot-scope="scope">{{$tools.toThousands(scope.row['watchedTimes'],false)}}</template>
        </el-table-column>
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
  name: "reportProjectList",
  //mixins: [tableMixin],
  components: { BarGraph },
  computed: {
    // 日期限制
    pickerOptions() {
      return {
        disabledDate(date) {
          return date.getTime() > Date.now() - 3600 * 24 * 1000;
        }
      };
    }
  },
  data() {
    return {
      companyName: "",
      projectId: null,
      reportPlanList: { data: [], loading: false },
      reportProjectList: { data: [], loading: false },
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
            title: "受众观看总次数"
          }
        ],
        loading: false,
        selectCardIndex: 0
      },
      barSelectOptions: {
        loading: false,
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
      projectList: {
        selectPlan: "",
        selectProject: "",
        selectTime: [],
        startTime: "", //开始时间
        endTime: "", //结束时间
        formShowStatus: 0, //列表排序 0花费数正序 1花费数倒序 2曝光数正序 3曝光数倒序 4设备数正序 5设备数倒序 6受众人数正序 7受众人数倒序 8受众观看数正序 9受众观看数倒序
        sortField: "cost",
        sortType: 1,
        topStatus: 5, //top数据类型 5 或者 10
        campaignId: "", //计划id
        id: "" //方案id
      }
    };
  },
  created() {
    if (
      this.$route.query.projectId === "" ||
      this.$route.query.projectId === null ||
      this.$route.query.projectId === undefined
    ) {
    } else {
      this.projectList.id = this.$route.query.projectId;
      //this.projectList.selectProject = this.$route.query.projectId;
    }

    if (
      this.$route.query.campaignId === "" ||
      this.$route.query.campaignId === null ||
      this.$route.query.campaignId === undefined
    ) {
      //获取计划名称列表
      this.getPlanNameList();
      //获取方案名称列表
      this.getProjectNameList();
    } else {
      this.projectList.campaignId = this.$route.query.campaignId;
      //获取计划名称列表
      this.getPlanNameList();
      //获取方案名称列表
      this.getProjectListInPlan(this.projectList.campaignId);
      //this.projectList.selectPlan = this.$route.query.campaignId;
    }

    this.projectList.startTime = this.$tools.getMonthFirstDay();
    this.projectList.endTime = this.$tools.getYesterday();
    if (
      this.$route.query.projectTime === "" ||
      this.$route.query.projectTime === null ||
      this.$route.query.projectTime === undefined
    ) {
    } else {
      let projectTime = this.$route.query.projectTime.split("~");
      this.projectList.startTime = projectTime[0];
      this.projectList.endTime = projectTime[1];
    }
    this.projectList.selectTime = [
      this.projectList.startTime,
      this.projectList.endTime
    ];
    let userInfo = getUserInfo();
    if (
      !userInfo.company ||
      userInfo.company.match(/^[ ]*$/) ||
      userInfo.company != null
    ) {
      // "",null,undefined,NaN
      this.companyName = userInfo.company;
    }
    //获取默认状态下的卡片数据
    this.getProjectTotal();
    //获取默认状态下的柱状图数据
    this.getProjectBarChart();
    //获取默认状态下的列表数据
    this.getProjectList();
  },
  methods: {
    onSubmit() {
      this.pageIndex = 1;
      //获取默认状态下的卡片数据
      this.getProjectTotal();
      //获取默认状态下的柱状图数据
      this.getProjectBarChart();
      //获取默认状态下的列表数据
      this.getProjectList();
    },
    //top5 top10更换
    getBarSelectData(chooseValue) {
      this.projectList.topStatus = chooseValue;
      this.getProjectBarChart();
    },
    //卡片更换
    chooseCard(cardField, cardIndex) {
      this.projectList.sortField = cardField;
      this.reportSelectCard.selectCardIndex = cardIndex;
      this.getProjectBarChart();
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.getProjectList();
    },
    handleCurrentChange(currentPage) {
      this.pageIndex = currentPage;
      this.getProjectList();
    },
    //触发改变投放计划事件
    changePlanValue(selVal) {
      console.log("changePlanValue", this.projectList);
      this.projectList.selectProject = "";
      if (selVal) {
        this.projectList.campaignId = selVal;
        this.getProjectListInPlan(selVal);
      } else {
        this.getProjectNameList();
      }
    },
    //触发改变投放方案事件
    changeProjectValue(selVal) {
      this.projectList.id = selVal;
    },
    //触发改变时间选择器的值
    chooseReportTime(changeVal) {
      this.projectList.startTime = changeVal[0];
      this.projectList.endTime = changeVal[1];
    },
    //清空投放计划
    clearPlanValue() {
      this.projectList.campaignId = "";
      this.projectList.selectPlan = "";
    },
    //清空投放方案
    clearProjectValue() {
      this.projectList.id = "";
      this.projectList.selectProject = "";
    },
    //触发下载事件
    downloadProjectList() {
      let param = {};
      this.getProjectDownloadList(param);
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
            if (item.id === this.projectList.campaignId) {
              this.projectList.selectPlan = item.name;
            }
          });

          this.reportPlanList.loading = false;
        })
        .catch(res => {
          this.reportPlanList.data = [];
          this.reportPlanList.loading = false;
        });
    },
    //获取方案名称列表
    getProjectNameList() {
      //该接口没有必须参数，可选参数
      //请求获取方案名称列表
      this.reportProjectList.loading = true;
      this.$api.PutProject.ProjectNameList()
        .then(res => {
          this.reportProjectList.data = res.result;
          this.reportProjectList.data.forEach(item => {
            if (item.id === this.projectList.id) {
              this.projectList.selectProject = item.name;
            }
          });
          this.reportProjectList.loading = false;
        })
        .catch(res => {
          this.reportProjectList.data = [];
          this.reportProjectList.loading = false;
        });
    },
    //获取计划下的名称列表
    getProjectListInPlan(camId) {
      //请求获取计划下的名称列表
      this.reportProjectList.loading = true;
      this.$api.PutProject.ProjectNameListByCamId(camId)
        .then(res => {
          this.reportProjectList.data = res.result;
          console.log("getProjectListInPlan", this.projectList);
          this.reportProjectList.data.forEach(item => {
            if (item.id === this.projectList.id) {
              this.projectList.selectProject = item.name;
            }
          });
          this.reportProjectList.loading = false;
        })
        .catch(res => {
          this.reportProjectList.data = [];
          this.reportProjectList.loading = false;
        });
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
        pageSize: this.pageSize
      };
      //合并查询参数
      Object.assign(queryParam, param);
      //请求方案报表列表查询接口
      this.reportSelectCard.loading = true;
      this.$api.Report.getProjectTotal(queryParam)
        .then(res => {
          this.reportSelectCard.loading = false;
          let cardList = res.result;
          this.reportSelectCard.data.forEach(item => {
            let property = item.field;
            if (cardList.hasOwnProperty(property)) {
              if (cardList[property] === "") {
                item.value = 0;
              } else if (property === "cost") {
                let costValue = cardList[property];
                item.value = "¥ " + this.$tools.toThousands(costValue / 100);
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
    getProjectBarChart(param) {
      //必须参数
      let queryParam = {
        startTime: this.projectList.startTime,
        endTime: this.projectList.endTime,
        sortField: this.projectList.sortField,
        topStatus: this.projectList.topStatus,
        campaignId: this.projectList.campaignId,
        id: this.projectList.id,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      };
      //合并查询参数
      Object.assign(queryParam, param);
      //请求方案报表列表查询接口
      this.barGraphData.loading = true;
      this.$api.Report.getProjectChartBar(queryParam)
        .then(res => {
          // res.result = [...res.result, ...res.result, ...res.result, ...res.result]
          this.barGraphData.loading = false;
          let xdata = [];
          let sdata = [];
          let ymax = 0;
          res.result.forEach((item, index) => {
            xdata[index] = item.projectName;
            sdata[index] = item.data;
            if (ymax < item.data) {
              ymax = item.data;
            }
          });
          this.barGraphData.data = {
            sortField: this.projectList.sortField,
            topStatus: this.projectList.topStatus,
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
            sortField: this.projectList.sortField,
            topStatus: this.projectList.topStatus,
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
        pageSize: this.pageSize
      };
      //合并查询参数
      Object.assign(queryParam, param);
      //请求方案报表列表查询接口
      this.reportDownload.loading = true;
      this.$api.Report.getProjectDownloadList(queryParam)
        .then(res => {
          this.reportDownload.loading = false;
          if (this.companyName === undefined) {
            this.companyName = "未知公司";
          }
          this.$tools.downLoadFileFlow(
            res,
            `投放方案报表+${this.companyName}+${this.$tools.getFormatDate(
              "YYmmdd_HHMMSSccc"
            )}.xls`
          );
        })
        .catch(res => {
          this.reportDownload.loading = false;
        });
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
        pageSize: this.pageSize
      };
      //合并查询参数
      Object.assign(queryParam, param);
      //请求方案报表列表查询接口
      this.loading = true;
      this.$api.Report.getProjectList(queryParam)
        .then(res => {
          this.loading = false;
          this.resultData = res.result;
          this.totalCount = res.page.totalCount;
          this.pageIndex = res.page.currentPage;
          this.resultData.forEach(item => {
            let costValue = item.cost;
            item.cost = "¥ " + this.$tools.toThousands(costValue / 100);
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
      this.projectList.sortField = column.prop;
      if (column.order === "descending") {
        this.projectList.sortType = 1;
      }
      if (column.order === "ascending") {
        this.projectList.sortType = 0;
      }
      this.getProjectList();
    },
    getCardName() {
      let cardName = "";
      this.reportSelectCard.data.forEach(item => {
        let property = item.field;
        let sortFieldName = this.projectList.sortField;
        if (property === sortFieldName) {
          return (cardName = item.title);
        }
      });
      return cardName;
    }
  }
};
</script>