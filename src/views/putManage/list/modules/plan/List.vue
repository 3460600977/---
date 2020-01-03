<template>
  <div class="list">

    <!-- 查询 -->
    <searchCondition @searchByCondition="handleSearch" :searchType="'plan'"/>


    <!-- 表格 分页 -->
    <div class="query_result">
      <el-table v-loading="tableData.loading" :data="tableData.data" class="list_table">
        <el-table-column prop="name" label="投放计划名称">
          <template slot-scope="scope">
            <span class="hand">{{scope.row.name}}</span>
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

        <el-table-column prop="beginTime" label="投放时间">
          <template slot-scope="scope">
            {{$tools.getFormatDate('YY/mm/dd', scope.row.beginTime)}}
            -
            {{$tools.getFormatDate('YY/mm/dd', scope.row.endTime)}}
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
                :to="`/reportList/plan?campaignId=${scope.row.id}&planTime=${$tools.getFormatDate('YY-mm-dd', scope.row.beginTime)}~${$tools.getFormatDate('YY-mm-dd', scope.row.endTime)}`">
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
            <span class="color-red" v-if="tableData.data[detailDialog.dataIndex].totalBudget">¥{{tableData.data[detailDialog.dataIndex].totalBudget / 100}}</span>
            <span class="color-red" v-else>不限</span>
          </el-form-item>
          <el-form-item label="投放时间">
            <span class="color-text-1">
              {{$tools.getFormatDate('YY-mm-dd', tableData.data[detailDialog.dataIndex].beginTime)}}
              -
              {{$tools.getFormatDate('YY-mm-dd', tableData.data[detailDialog.dataIndex].endTime)}}
            </span>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer center">
        <el-button style="width: 136px;" type="primary" @click="detailDialog.show = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import searchCondition from '../../../templates/searchCondition'
import { putManageMixin } from '../putManageMixin'
import { PutGoal, projectConst, MonitorData } from '@/utils/static'

export default {
  name: "planList",
  mixins: [putManageMixin],
  components: {
    searchCondition
  },

  props: {
    active: {
      type: Boolean,
      default: false,
    }
  },

  data() {
    return {
      PutGoal, projectConst, MonitorData,

      detailDialog: {
        show: false,
        dataIndex: 0,
      },
    };
  },


  methods: {

    // 搜索
    search() {
      let param = {
        name: 'plan' in this.searchParam.condition ? this.searchParam.condition.plan.data.name : '',
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
    }

  }
};
</script>

<style lang='scss' scoped>
@import '../listCommonStyle.scss';
</style>
 