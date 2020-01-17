<template>
  <div class="finance-account-list" v-loading.fullscreen.lock="loading">
    <!-- 查询表单 -->
    <div class="report-top-form">
      <p class="db-title">账户流水</p>
      <div class="finance-show">
        <div class="finance-icon">
          <span class="iconfont icon-yingshoukuanfenxi"></span>
        </div>
        <div class="finance-title">
          <span class="title-text">资金账户可用余额</span>
          <div class="title-num">
            <span class="title-icon">¥</span>
            {{$tools.toThousands(accountBalance / 100)}}
          </div>
        </div>
      </div>
      <el-form :inline="true" :model="flowForm" class="report-query-form">
        <el-form-item class="item-space" label="交易时间">
          <el-date-picker
            v-model="flowForm.operationDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item class="item-space" label="订单号">
          <el-input
            v-model.trim="flowForm.tradeNo"
            clearable
            placeholder="请输入"
            @keyup.enter.native="handleTransfer"
          ></el-input>
        </el-form-item>
        <el-form-item class="item-space-end item-space" label="交易类型">
          <el-select v-model="flowForm.tradeType" placeholder="请选择" clearable>
            <el-option
              v-for="(check,checkIndex) in financeStatus"
              :key="checkIndex"
              :label="check.label"
              :value="check.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="resetPageIndex();onSubmit();" plain>查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 账户流水table -->
    <div class="query_result">
      <el-table v-loading="tableData.loading" :data="tableData.data" class="list_table">
        <el-table-column prop="operationDate" label="交易日期">
          <template slot-scope="scope">
            <span>{{$tools.getFormatDate('YYYY-mm-dd HH:MM:SS',scope.row.operationDate)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tradeType" label="交易类型">
          <template slot-scope="scope">
            <span v-if="scope.row.tradeType===1">充值</span>
            <span v-if="scope.row.tradeType===2">扣款</span>
            <span v-if="scope.row.tradeType===3">返还</span>
          </template>
        </el-table-column>
        <el-table-column prop="money" label="资金账户">
          <template slot-scope="scope">
            <span
              v-if="scope.row.tradeType===2"
              class="text-danger"
            >¥ -{{ $tools.toThousands(scope.row.money/ 100)}}</span>
            <span v-else class="money-text">¥ +{{ $tools.toThousands(scope.row.money/ 100)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tradeNo" label="订单号"></el-table-column>
        <el-table-column prop="projectName" label="投放方案"></el-table-column>
      </el-table>
      <!-- 账户流水table 分页 -->
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="page.pageIndex"
        :total="page.totalCount"
        :page-sizes="page.pageSizeSelectable"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="my-list-page"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { getUserInfo } from "@/utils/auth";
const systemOnlineTime = "2020-01-10";
const PAGE_SIZE = [10, 20, 30, 40, 50];
export default {
  name: "flowList",
  computed: {
    // 日期限制
    pickerOptions() {
      let _that = this;
      return {
        disabledDate(date) {
          return (
            date.getTime() > Date.now()
            // date.getTime() <
            //   new Date(_that.$tools.getMonthFirstDay()).getTime() -
            //     24 * 3600 * 1000
            // date.getTime() <
            //   new Date(systemOnlineTime).getTime() - 24 * 3600 * 1000
          );
        }
      };
    }
  },
  data() {
    return {
      hasMinus: false,
      accountBalance: 0, //账户资金
      flowForm: {
        operationDate: [], //交易时间
        tradeNo: "", //交易号
        tradeType: "" //交易类型
      },
      tableData: {
        loading: false,
        data: null
      },
      loading: false,
      page: {
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0,
        pageSizeSelectable: PAGE_SIZE
      },
      financeStatus: [
        { value: 1, label: "充值" },
        { value: 2, label: "扣款" },
        { value: 3, label: "返还" }
      ]
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.flowForm.operationDate = [
        vm.$tools.getMonthFirstDay(),
        vm.$tools.getFormatDate("YYYY-mm-dd", new Date())
      ];
      vm.getSummaryDetail();
      vm.onSubmit();
    });
  },
  methods: {
    onSubmit() {
      this.tableData.loading = true;
      let param = {
        pageIndex: this.page.pageIndex,
        pageSize: this.page.pageSize,
        tradeNo: this.flowForm.tradeNo,
        tradeType: this.flowForm.tradeType
      };
      if (this.flowForm.operationDate) {
        param.beginTime = this.flowForm.operationDate[0];
        param.endTime = this.flowForm.operationDate[1];
      }
      this.$api.Finance.getFinanceAccountList(param)
        .then(res => {
          this.tableData = {
            loading: false,
            data: res.result
          };
          this.page.totalCount = res.page.totalCount;
        })
        .catch(res => {
          this.tableData = {
            loading: false,
            data: []
          };
        });
    },

    //刷新首页 概况详情=》统计计划，方案，未支付方案，审核拒绝创意数
    getSummaryDetail: async function() {
      this.loading = true;
      let summaryDetail = await this.$tools.getSummaryDetail();
      this.loading = false;
      this.accountBalance = summaryDetail.accountBalance;
    },

    // 重置翻页为1
    resetPageIndex() {
      this.page.pageIndex = 1;
    },

    // 改变每页显示页数
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.page.pageIndex = 1;
      this.onSubmit();
    },

    // 跳转到第几页
    handleCurrentChange(val) {
      this.page.pageIndex = val;
      this.onSubmit();
    }
  }
};
</script>

<style lang="scss" scoped>
.finance-account-list {
  .db-title {
    margin-bottom: 30px;
  }
  .report-top-form {
    /*height: 160px;*/
    border-radius: 4px;
    background-color: $color-bg-3;
    padding: 30px 0 35px 38px;
    /deep/ .el-form-item {
      margin-bottom: 0px;
    }
  }
  .item-space {
    margin-right: 50px;
  }
  .item-space-end {
    margin-right: 20px;
  }
  .show-title {
    font-size: 14px;
    font-weight: normal;
    padding-left: 9px;
    line-height: 1.15;
    margin-bottom: 40px;
  }
  .money-text {
    font-size: 14px;
    font-family: DINMittelschrift;
    font-weight: normal;
    color: $color-blue-money;
  }
  .text-danger {
    font-size: 14px;
    font-family: DINMittelschrift;
    font-weight: normal;
    color: $color-main;
  }
  .finance-show {
    width: 424px;
    height: 124px;
    border-radius: 2px 0px 0px 2px;
    display: flex;
    margin-bottom: 30px;
    .finance-icon {
      display: inline-block;
      width: 124px;
      height: 124px;
      background: $color-main;
      box-shadow: 0px 4px 10px 0px $color-shadow-9;
      border-radius: 2px 0px 0px 2px;
      text-align: center;
      span {
        display: inline-block;
        position: relative;
        top: 30%;
        color: $color-bg-3;
        font-size: 52px;
      }
    }
    .finance-title {
      display: inline-block;
      width: 300px;
      height: 124px;
      background: $color-bg-3;
      border: 1px solid $color-border;
      box-shadow: 0px 4px 10px 0px $color-shadow-10;
      border-radius: 0px 2px 2px 0px;
      padding: 32px 0 34px 44px;
      .title-text {
        font-size: 14px;
        font-weight: 400;
        color: $color-text-5;
        display: inline-block;
        margin-bottom: 24px;
      }
      .title-num {
        height: 21px;
        line-height: 21px;
        font-size: 26px;
        font-family: DINMittelschrift;
        font-weight: 400;
        color: $color-table-title;
        .title-icon {
          font-size: 20px;
          font-family: "Microsoft YaHei";
        }
      }
    }
  }
}
</style>