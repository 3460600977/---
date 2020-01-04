<template>
  <div class="list">

    
    <!-- 查询 -->
    <searchCondition @searchByCondition="handleSearch" :searchType="'project'"/>
    

    <div class="query_result">
      <el-table v-loading="tableData.loading" :data="tableData.data" class="list_table">
        <el-table-column prop="name" label="投放方案名称">
          <template slot-scope="scope">
            <span class="hand">{{scope.row.name}}</span>
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
              <!-- <router-link :to="`/putManage/create/project?editProjectId=${scope.row.projectId}`"> -->
              <router-link :to="`/putManage/create/creative?projectId=${scope.row.projectId}&createType=step`">
                <i class="iconfont icon-bianji icon-color"></i>修改
              </router-link>
            </span>

            <span 
              @click="detailDialog.projectId=+scope.row.projectId; detailDialog.show=true; detailDialog.activeTab='point'"
              v-if="scope.row.status == 1 || scope.row.status == 2" 
              class="icon-space hand">
              <i class="iconfont icon-ziyuan icon-color"></i>点位
            </span>

            <span v-if="scope.row.status == 1 || scope.row.status == 2" class="icon-space hand">
              <router-link :to="`/reportList/project?projectId=${scope.row.projectId}&projectTime=${$tools.getFormatDate('YY-mm-dd', scope.row.beginTime)}~${$tools.getFormatDate('YY-mm-dd', scope.row.endTime)}`">
                <i class="iconfont icon-baobiao icon-color"></i>报表
              </router-link>
            </span>

            <span @click="comfirmPay(scope.row.projectId)" v-if="scope.row.status == 4" class="icon-space hand">
              <i class="iconfont icon-kuaijiezhifu1 icon-color"></i>支付
            </span>

            <span @click="cancleProject(scope.row.projectId)" v-if="scope.row.status == 0 || scope.row.status == 4" class="icon-space hand">
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
      title="投放方案详情"
      :visible.sync="detailDialog.show"
      width="1000px">
      <detailDialog :activeTab="detailDialog.activeTab" :projectId="detailDialog.projectId"/>
      <span slot="footer" class="dialog-footer center">
        <el-button style="width: 136px;" type="primary" @click="detailDialog.show = false">确定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
import { projectConst, projectStatus } from '../../../../../utils/static'
import { putManageMixin } from '../putManageMixin'
import searchCondition from '../../../templates/searchCondition'
import detailDialog from './modules/detailDialog'

export default {
  name: "planList",
  mixins: [putManageMixin],
  props: {
    active: {
      type: Boolean,
      default: false,
    }
  },

  components: {
    detailDialog,
    searchCondition
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

    };
  },

  beforeMount() {
    this.getAllCity()
  },
  methods: {

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
        "campaignId": 'plan' in this.searchParam.condition ? this.searchParam.condition.plan.data.id : '',
        "pageIndex": this.searchParam.page.pageIndex,
        "pageSize": this.searchParam.page.pageSize,
        "projectId": 'project' in this.searchParam.condition ? this.searchParam.condition.project.data.id : '',
        "status": 'project' in this.searchParam.condition ? this.searchParam.condition.project.status.value : '',
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
  }
};
</script>

<style lang='scss' scoped>
@import '../listCommonStyle.scss';
</style>
