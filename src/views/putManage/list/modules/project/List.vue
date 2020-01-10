<template>
  <div class="list">

    
    <!-- 查询 -->
    <el-form :inline="true" class="list-form-inline clearfix">
      <!-- 投放计划名称 -->
      <el-form-item class="line-space" label="投放计划名称">
        <el-select 
          @focus="getPlanNameList"
          @change="changePlan"
          :loading="planNameList.loading" 
          v-model="searchParam.plan.id" 
          placeholder="请选择" 
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


      <!-- 投放方案名称 -->
      <el-form-item class="line-space" label="投放方案名称">
        <el-input clearable v-model="searchParam.projectName" placeholder="请输入"></el-input>
      </el-form-item>


      <!-- 方案状态 -->
      <el-form-item class="line-space" label="方案状态">
        <el-select 
          @focus="getPlanNameList"
          :loading="planNameList.loading" 
          value-key="value"
          v-model="searchParam.plan.status" 
          placeholder="不限" 
          filterable
          clearable>
          <el-option
            v-for="item in projectStatus"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>


      <!-- 查询 -->
      <el-form-item class="list-query-button">
        <el-button type="primary" plain @click="handleSearch(); search(); ">查询</el-button>
      </el-form-item>


      <!-- 新建 -->
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
            <router-link :to="`/putManage?active=creative&projectId=${scope.row.projectId}`">
              <span class="hand">{{scope.row.name}}</span>
            </router-link>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="投放方案状态">
          <template slot-scope="scope">
            {{$tools.getObjectItemFromArray(projectStatus, 'value', scope.row.status).name}}
          </template>
        </el-table-column>

        <el-table-column prop="status" label="创意状态">
          <template slot-scope="scope">
            <span v-if="scope.row.creativeStatus === 0" class="status">待审核</span>
            <span v-else-if="scope.row.creativeStatus === 1" class="deny status">审核拒绝</span>
            <span v-else-if="scope.row.creativeStatus === 2" class="status">审核通过</span>
            <span v-else class="status">未上传</span>
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
              v-if="scope.row.status != 4"
              class="icon-space hand" 
              @click="detailDialog.projectId=+scope.row.projectId; detailDialog.show=true; detailDialog.activeTab='project'"
            >
              <i class="iconfont icon-shuxingliebiaoxiangqing2 icon-color"></i>详情
            </span>
            <span v-if="scope.row.status == 0 && scope.row.creativeStatus == null" class="icon-space hand">
              <router-link :to="`/putManage/create/creative?projectId=${scope.row.projectId}&createType=step`">
                <i class="iconfont icon-bianji icon-color"></i>编辑
              </router-link>
            </span>

            <span v-if="scope.row.status == 1 || scope.row.status == 2" class="icon-space hand">
              <router-link :to="`/reportList/project?projectId=${scope.row.projectId}&projectTime=${$tools.getFormatDate('YY-mm-dd', scope.row.beginTime)}~${$tools.getFormatDate('YY-mm-dd', scope.row.endTime)}`">
                <i class="iconfont icon-baobiao icon-color"></i>报表
              </router-link>
            </span>

            <span @click="comfirmPay(scope.row.projectId)" v-if="scope.row.status == 4" class="icon-space hand">
              <i class="iconfont icon-kuaijiezhifu1 icon-color"></i>支付
            </span>

            <span @click="cancleDialog.data.name = scope.row.name; 
              cancleDialog.data.id = scope.row.projectId;
              cancleDialog.show = true" 
              v-if="scope.row.status == 0 || scope.row.status == 4" 
              class="icon-space hand">
              <i class="iconfont icon-error1 icon-color font-17"></i>取消
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
    <detail-dialog @hideDetial="detailDialog.show = false" :show="detailDialog.show" :projectId="detailDialog.projectId"/>

    <!-- 取消 提示弹窗 -->
    <el-dialog title="取消方案"
      :visible.sync="cancleDialog.show"
      width="568px"
      class="my-dialog dialog-mid"
    >
      <p>确认是否取消投放方案 <span class="color-main">【{{cancleDialog.data.name}}】？</span></p>
      <span slot="footer">
        <el-button @click="cancleDialog.show = false" class="btn1">取 消</el-button>
        <el-button type="primary" class="btn1" @click="cancleProject(cancleDialog.data.id); cancleDialog.show = false">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
import { projectConst, projectStatus } from '../../../../../utils/static'
import detailDialog from './modules/detailDialog'

export default {
  name: "planList",

  props: {
    active: {
      type: Boolean,
      default: false,
    }
  },

  components: {
    detailDialog
  },

  data() {
    return {
      screenType: projectConst.screenType,
      projectStatus,

      cityList: [],

      detailDialog: {
        show: false,
        projectId: '',
        activeTab: 'project'
      },

      cancleDialog: {
        data: {name: '加载失败', id: ''},
        show: false
      },

      planNameList: {
        loading: true,
        data: []
      },

      searchParam: {
        plan: {
          id: '',
          status: ''
        },
        projectName: '',
        page: {
          pageSize: 10,
          pageIndex: 1,
        }
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

  watch: {
    '$route': {
      handler() {
        this.getAllCity()

        if (this.$route.query.active !== 'project') return;

        if (this.$route.query.planId) {
          this.getPlanNameList()
          this.searchParam.plan.id = this.$route.query.planId;
        }

        else if (this.$route.query.status) {
          this.getPlanNameList()
          this.searchParam.plan.status = this.$route.query.status;
        } 

        else {
          this.searchParam.plan.id = '';
          this.searchParam.plan.status = ''
        }
        
        this.search()
      },
      immediate: true
    }
  },

  methods: {

    // 下拉框数据 计划名字列表
    getPlanNameList() {
      if (this.planNameList.data.length > 0) return false;
      this.planNameList.loading = true;
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

    // change计划
    changePlan() {
      this.searchParam.projectName = '';
    },

    // 城市列表
    getAllCity() {
      if (this.cityList.length > 0) return;
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
          this.$message({
            message: '已取消',
            type: 'success'
          });
          this.search()
        })
        .catch(res => {
          this.tableData.loading = false;
        })
    },

    // 支付
    comfirmPay(projectId) {
      this.$router.push({
        path: '/putManage/create/payConfirm',
        query: {
          projectId: projectId
        }
      })
    },

    // 搜索
    search() {
      this.tableData.loading = true;

      let param = {
        "campaignId": this.searchParam.plan.id,
        "pageIndex": this.searchParam.page.pageIndex,
        "pageSize": this.searchParam.page.pageSize,
        "name": this.searchParam.projectName,
        "status": this.searchParam.plan.status,
      }
      this.$api.PutProject.ProjectList(param)
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

    // 重置  翻页为1  重置传入的planid
    handleSearch() {
      this.searchParam.page.pageIndex = 1;
      // this.$router.replace('/putManage?active=project')
    },

    handleSizeChange(val) {
      this.searchParam.page.pageSize = val;
      this.searchParam.page.pageIndex = 0;
      this.search()
    },

    handleCurrentChange(val) {
      this.searchParam.page.pageIndex = val;
      this.search()
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../listCommonStyle.scss';
</style>
