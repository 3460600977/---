<template>
  <div class="list">

    <!-- 查询 -->
    <el-form :inline="true" class="list-form-inline clearfix">
      <!-- 投放计划名称 -->
      <el-form-item class="line-space" label="投放计划名称">
        <el-input clearable v-model="searchParam.planName" placeholder="请输入"></el-input>
      </el-form-item>

      <!-- 查询 -->
      <el-form-item class="list-query-button">
        <el-button type="primary" plain @click="resetPageIndex(); search();">查询</el-button>
      </el-form-item>


      <!-- 新建 -->
      <el-form-item class="list-new-button">
        <router-link to="/putManage/create/plan">
          <el-button type="primary">新建投放计划</el-button>
        </router-link>
      </el-form-item>


    </el-form>

    <!-- 表格 分页 -->
    <div class="query_result">
      <el-table v-loading="tableData.loading" :data="tableData.data" class="list_table">
        <el-table-column prop="name" label="投放计划名称">
          <template slot-scope="scope">
            <router-link class="color-origin-blue" :to="`/putManage?active=project&planId=${scope.row.id}`">
              <span class="hand">{{scope.row.name}}</span>
            </router-link>
          </template>
        </el-table-column>

        <el-table-column prop="campaignType" label="投放目的">
          <template slot-scope="scope">
            {{$tools.getObjectItemFromArray(PutGoal, 'value', scope.row.campaignType).name}}
          </template>
        </el-table-column>

        <el-table-column prop="totalBudget" label="投放预算">
          <template slot-scope="scope">
            <span v-if="scope.row.totalBudget" class='color-blue'>
              ¥ {{$tools.toThousands(scope.row.totalBudget / 100)}}
            </span>
            <span v-else>
              不限
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="action" label="操作" fixed="right" width="400">
          <template slot-scope="scope">
            <span class="icon-space hand"
              @click="detailDialog.dataIndex=scope.$index; detailDialog.show=true"
            >
              <i class="iconfont icon-shuxingliebiaoxiangqing2 icon-color"></i>详情
            </span>
            <span class="icon-space hand">
              <router-link 
                :to="`/reportList/plan?campaignId=${scope.row.id}`">
                <i class="iconfont icon-baobiao icon-color"></i>报表
              </router-link>
            </span>
            <span class="icon-space hand">
              <router-link :to="`/putManage/create/plan?editPlanId=${scope.row.id}`">
                <i class="iconfont icon-bianji icon-color"></i>编辑
              </router-link>
            </span>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="tableData.page.currentPage"
        :total="tableData.page.totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="list-page"
      ></el-pagination>
    </div>



    <el-dialog
      v-if="tableData.data.length > 0"
      class="my-dialog"
      title="投放计划详情"
      :visible.sync="detailDialog.show"
      width="1000px">
        <el-form label-position='left' label-width="150px">
          <el-form-item label="投放计划名称">
            <span class="color-text-1">{{tableData.data[detailDialog.dataIndex].name}}</span>
          </el-form-item>
          <el-form-item label="投放目的">
            <span class="color-text-1">
              {{$tools.getObjectItemFromArray(PutGoal, 'value', tableData.data[detailDialog.dataIndex].campaignType).name}}
            </span>
          </el-form-item>
          <el-form-item label="总预算">
            <span class="color-red" v-if="tableData.data[detailDialog.dataIndex].totalBudget">¥ {{$tools.toThousands(tableData.data[detailDialog.dataIndex].totalBudget / 100)}}</span>
            <span class="color-red" v-else>不限</span>
          </el-form-item>
          <!-- <el-form-item label="投放时间">
            <span class="color-text-1">
              {{$tools.getFormatDate('YY-mm-dd', tableData.data[detailDialog.dataIndex].beginTime)}}
              -
              {{$tools.getFormatDate('YY-mm-dd', tableData.data[detailDialog.dataIndex].endTime)}}
            </span>
          </el-form-item> -->
        </el-form>
      <span slot="footer" class="dialog-footer center">
        <el-button style="width: 136px;" type="primary" @click="detailDialog.show = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { PutGoal, projectConst, MonitorData } from '@/utils/static'

export default {
  name: "planList",

  props: {
    active: {
      type: Boolean,
      default: false,
    }
  },

  data() {
    return {
      PutGoal, projectConst, MonitorData,

      searchParam: {
        planName: '',
        page: {
          pageSize: 10,
          pageIndex: 1,
        }
      },

      detailDialog: {
        show: false,
        dataIndex: 0,
      },

      tableData: {
        loading: true,
        data: [],
        page: {
          currentPage: 0,
          totalCount: 0
        }
      },

    };
  },

  beforeMount() {
    this.search()
  },

  methods: {

    // 搜索
    search() {
      let param = {
        name: this.searchParam.planName,
        pageIndex: this.searchParam.page.pageIndex,
        pageSize: this.searchParam.page.pageSize
      }

      this.tableData.loading = true;
      
      this.$api.PutPlan.PlanList(param)
        .then(res => {
          this.tableData = {
            loading: false,
            data: res.result,
            page: res.page
          }
        })
        .catch(res => {
          this.tableData = {
            loading: false,
            data: [],
            page: {
              currentPage: 0,
              totalCount: 0
            }
          }
        })
    },
    

    // 重置翻页为1
    resetPageIndex() {
      this.searchParam.page.pageIndex = 1;
    },


    handleSizeChange(val) {
      this.searchParam.page.pageSize = val;
      this.searchParam.page.pageIndex = 0;
      this.search()
    },
    

    handleCurrentChange(val) {
      debugger
      this.searchParam.page.pageIndex = val;
      this.search()
    }

  }
};
</script>

<style lang='scss' scoped>
@import '../listCommonStyle.scss';
</style>
 