<template>
  <div class="list">
    <el-form :inline="true" class="list-form-inline clearfix">
      <el-form-item class="line-space" label="投放计划名称">
        <el-select 
          @focus="getPlanNameList"
          :loading="planNameList.loading" 
          v-model="searchParam.campaignId" 
          placeholder="不限" 
          filterable
          clearable>
          <el-option
            v-for="item in planNameList.data"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item class="line-space" label="投放方案名称">
        <el-select 
          @focus="getProjectNameList"
          :loading="projectNameList.loading" 
          v-model="searchParam.projectId" 
          placeholder="不限" 
          filterable
          clearable>
          <el-option
            v-for="item in projectNameList.data"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item class="line-space" label="方案状态">
        <el-select 
          @focus="getPlanNameList"
          :loading="planNameList.loading" 
          v-model="searchParam.status" 
          placeholder="不限" 
          filterable
          clearable>
          <el-option
            v-for="item in putStatus"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item class="list-query-button">
        <el-button type="primary" plain @click="search">查询</el-button>
      </el-form-item>

      <el-form-item class="list-new-button">
        <router-link to="/putManage/create/plan">
          <el-button type="primary">新建投放方案</el-button>
        </router-link>
      </el-form-item>
    </el-form>

    <div class="query_result">
      <el-table v-loading="tableData.loading" :data="tableData.data" class="list_table">
        <el-table-column prop="name" label="投放方案名称">
          <template slot-scope="scope">
            <span class="hand">{{scope.row.name}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="投放方案状态">
          <template slot-scope="scope">
            {{projectStatus[scope.row.status]}}
          </template>
        </el-table-column>

        <el-table-column prop="status" label="创意状态">
          <template slot-scope="scope">
            <span v-if="scope.row.creativeStatus === 0" class="pending status">待审核</span>
            <span v-else-if="scope.row.creativeStatus === 1" class="deny status">审核拒绝</span>
            <span v-else-if="scope.row.creativeStatus === 2" class="pass status">审核通过</span>
            <span v-else class="empty status">未上传</span>
          </template>
        </el-table-column>

        <el-table-column prop="totalBudget" label="投放类型">
          <template slot-scope="scope">
            {{scope.row.projectType === 0 ? '按周投放' : '按天投放'}}
          </template>
        </el-table-column>

        <el-table-column prop="cityList" label="屏幕类型">
          <template slot-scope="scope">
            {{$tools.getObjectItemFromArray(screenType, 'value', scope.row.type).name}}
          </template>
        </el-table-column>

        <el-table-column prop="cityList" label="投放城市">
          <template slot-scope="scope">
            <template v-for="item in cityList">
              <template v-if="item.cityCode === scope.row.projectCity">{{item.name}}</template>
            </template>
          </template>
        </el-table-column>

        <el-table-column prop="beginTime" label="投放时间" width="250">
          <template slot-scope="scope">
            {{$tools.getFormatDate('YY/mm/dd', scope.row.beginTime)}}
            -
            {{$tools.getFormatDate('YY/mm/dd', scope.row.endTime)}}
          </template>
        </el-table-column>

        <el-table-column prop="action" label="操作" fixed="right" width="350">
          <template slot-scope="scope">
            <span 
              class="icon-space hand" 
              @click="detailDialog.projectId=+scope.row.projectId; detailDialog.show=true"
            >
              <i class="iconfont icon-shuxingliebiaoxiangqing2 icon-color"></i>详情
            </span>

            <span v-if="scope.row.status == 0" class="icon-space hand">
              <router-link :to="`/putManage/create/project?editProjectId=${scope.row.projectId}`">
                <i class="iconfont icon-bianji icon-color"></i>修改
              </router-link>
            </span>

            <span v-if="scope.row.status == 1 || scope.row.status == 2" class="icon-space hand">
              <router-link :to="`/putManage/create/plan?editPlanId=${scope.row.id}`">
                <i class="iconfont icon-ziyuan icon-color"></i>点位明细
              </router-link>
            </span>

            <span v-if="scope.row.status == 1 || scope.row.status == 2" class="icon-space hand">
              <router-link :to="`/reportList/plan?campaignId=${scope.row.id}`">
                <i class="iconfont icon-baobiao icon-color"></i>报表
              </router-link>
            </span>

            <span @click="cancleProject(scope.row.projectId)" v-if="scope.row.status == 0" class="icon-space hand">
              <i class="iconfont icon-error1 icon-color"></i>取消
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

    <!-- 详情 -->
    <el-dialog
      class="my-dialog"
      title="投放计划详情"
      :visible.sync="detailDialog.show"
      width="1000px">
      <detailDialog :projectId="detailDialog.projectId"/>
      <span slot="footer" class="dialog-footer center">
        <el-button style="width: 136px;" type="primary" @click="detailDialog.show = false">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { projectConst, projectStatus } from '../../../../../utils/static'
import detailDialog from './modules/detailDialog'
export default {
  name: "planList",

  components: {
    detailDialog
  },

  data() {
    return {
      screenType: projectConst.screenType,
      projectStatus,

      planNameList: {
        loading: true,
        data: []
      },

      projectNameList: {
        loading: true,
        data: []
      },

      putStatus: [
        { name: '待投放', value: 0 },
        { name: '投放中', value: 1 },
        { name: '已完成', value: 2 },
        { name: '已取消', value: 3 },
      ],

      cityList: [],

      searchParam: {
        campaignId: '', 
        projectId: '',
        status:'',
        pageIndex: '',
        pageSize: '',
      },

      tableData: {
        loading: true,
        data: [],
        page: {
          currentPage: 0,
          totalCount: 0
        }
      },

      detailDialog: {
        show: false,
        projectId: '',
        activeTab: 'project'
      },

    };
  },

  beforeMount() {
    this.search()
    this.getAllCity()
  },
  methods: {

    // 计划名称列表
    getPlanNameList() {
      if (this.planNameList.data.length > 0) return;
      this.$api.PutPlan.PlanNameList()
        .then(res => {
          this.planNameList = {
            loading: false,
            data: res.result,
          }
        })
        .catch(res => {
          this.planNameList = {
            loading: false,
            data: []
          }
        })
    },

    // 方案名字列表
    getProjectNameList() {
      this.$api.PutProject.ProjectNameList()
        .then(res => {
          this.projectNameList = {
            loading: false,
            data: res.result,
          }
        })
        .catch(res => {
          this.projectNameList = {
            loading: false,
            data: []
          }
        })
    },

    // 城市列表
    getAllCity() {
      this.$api.CityList.AllList()
        .then(res => {
          this.cityList = res.result;
        })
        .catch(res => {})
    },

    // 取消方案
    cancleProject(projectId) {
      this.tableData.loading = true;
      this.$api.PutProject.CancelProject({projectId: projectId})
        .then(res => {
          this.search()
        })
        .catch(res => {
          this.tableData.loading = false;
        })
    },

    // 搜索
    search() {
      this.tableData.loading = true;
      this.$api.PutProject.ProjectList(this.searchParam)
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


    handleSizeChange(val) {
      this.searchParam.pageSize = val;
      this.searchParam.pageIndex = 0;
      this.search()
    },

    handleCurrentChange(val) {
      this.searchParam.pageIndex = val;
      this.search()
    }
  }
};
</script>

<style lang='scss'>
@import '../listCommonStyle.scss';
</style>
