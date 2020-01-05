<template>
  <div class="list">

    <!-- 查询 -->
    <el-form :inline="true" class="list-form-inline clearfix">
      <!-- 投放计划名称 -->
      <el-form-item class="line-space" label="投放计划名称">
        <el-select 
          @focus="getPlanNameList"
          @change="changePlan"
          value-key="id"
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
      <el-form-item  class="line-space" label="投放方案名称">
        <el-select 
          @focus="getProjectNameList"
          @change="changeProject"
          :loading="projectNameList.loading"
          v-model="searchParam.project.id" 
          placeholder="请选择" 
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



      <!-- 广告创意名称 -->
      <el-form-item  class="line-space" label="广告创意名称">
        <el-input clearable v-model="searchParam.creative.name" placeholder="请输入"></el-input>
      </el-form-item>


      <!-- 创意状态 -->
      <el-form-item class="line-space" label="创意状态">
        <el-select 
          v-model="searchParam.creative.status" 
          placeholder="不限"
          value-key="value"
          filterable
          clearable>
          <el-option
            v-for="item in creativeStatus"
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
        <router-link to="/putManage/create/creative?createType=single">
          <el-button type="primary">新建广告创意</el-button>
        </router-link>
      </el-form-item>


    </el-form>

    <div class="query_result">
      <el-table v-loading="tableData.loading" :data="tableData.data" class="list_table">
        <el-table-column prop="name" label="广告创意名称">
          <template slot-scope="scope">
            <span class="hand">{{scope.row.name}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="创意状态">
          <template slot-scope="scope">
            {{scope.row.statusName}}
          </template>
        </el-table-column>

        <el-table-column prop="cityList" label="屏幕类型">
          <template slot-scope="scope">
            {{scope.row.screenTypeName}}
          </template>
        </el-table-column>

        <el-table-column prop="totalBudget" label="创意行业">
          <template slot-scope="scope">
            {{scope.row. industryName}}
          </template>
        </el-table-column>

        <el-table-column prop="action" label="操作" fixed="right" width="400">
          <template slot-scope="scope">
            <span class="icon-space hand" 
              @click="getCreativeDetail(scope.row.id); detailDialog.loading = true"
            >
              <i class="iconfont icon-shuxingliebiaoxiangqing2 icon-color"></i>详情
            </span>

            <span v-if="scope.row.statusName !== '审核通过'" class="icon-space hand">
              <router-link :to="`/putManage/create/creative?createType=edit&creativeId=${scope.row.id}`">
                <i class="iconfont icon-bianji icon-color"></i>编辑
              </router-link>
            </span>

            <span 
              @click="deleteDialog.data.name = scope.row.name; 
              deleteDialog.data.id = scope.row.id;
              deleteDialog.show = true"
              v-if="scope.row.statusName != '审核通过'" 
              class="icon-space hand">
              <i class="iconfont icon-error icon-color"></i>删除
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


    <!-- 详情弹窗 -->
    <el-dialog 
      title="广告创意详情" 
      width="1000px" 
      :visible.sync="detailDialog.show" 
      class="creative-dialog my-dialog">
      <el-tabs v-model="activeName">
        <el-tab-pane label="创意资质" name="aptitude" class="aptitude">
          <div v-loading="detailDialog.loading">
            <div class="no-pass" v-if="detailDialog.data.status == 1">
              <img class="no-pass-img" :src="noPassImg" alt="" srcset="">
              <div>{{JSON.parse(detailDialog.data.rejectReason).join(',')}}</div>
            </div>
            <div class="text-col">
              <span class="text-title">广告创意名称</span>
              <label class="text-info">{{detailDialog.data.name}}</label>
            </div>

            <div  class="text-col">
              <span class="text-title">广告创意行业</span>
              <label class="text-info"><Industry :disabled="true" :originStyle="false" :value="detailDialog.data.industry" /></label>
            </div>

            <div  class="text-col">
              <span class="text-title">广告创意资质</span>
              <div v-if="detailDialog.data.industryIdentify" class="demo-image__preview">
                <el-image
                  fit="cover"
                  v-for="(item, index) in JSON.parse(detailDialog.data.industryIdentify)" :key="index" 
                  :src="item"
                  style="width: 100px; height: 158px;border-radius: 2px; margin-right: 10px;">
                </el-image>
              </div>
              <label v-else class="text-info">未上传</label>
            </div>

            <template v-if="detailDialog.data.monitor">
              <template v-for="(item, index) in detailDialog.data.monitor">
                <div  class="text-col" :key="index">
                  <span class="text-title">监测模式</span>
                  <label class="text-info">{{item.mode || '无'}}</label>
                </div>

                <div  class="text-col" :key="index">
                  <span class="text-title">第三方监测</span>
                  <label class="text-info">{{$tools.getObjectItemFromArray(MonitorData.thirdPartyMonitor, 'value', item.thirdPartyMonitor).name || '无'}}</label>
                </div>

                <div  class="text-col" :key="index">
                  <span class="text-title">监测地址</span>
                  <label class="text-info">{{item.thirdPartyMonitorUrl || '无'}}</label>
                </div>
              </template>
            </template>
            <template v-else>
              <div  class="text-col">
                <span class="text-title">监测模式</span>
                <label class="text-info">{{'无'}}</label>
              </div>

              <div  class="text-col">
                <span class="text-title">第三方监测</span>
                <label class="text-info">{{'无'}}</label>
              </div>

              <div  class="text-col">
                <span class="text-title">监测地址</span>
                <label class="text-info">{{'无'}}</label>
              </div>
            </template>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="创意素材" name="material" class="material">
          <div v-loading="detailDialog.loading">

            <div class="top-screen">
              <template v-for="(item, index) in detailDialog.data.materials">
                <template v-if="item.screenType === 1">
                  <p :key="index">上屏</p>
                  <el-image class="img" v-if="$tools.getSuffix(item.srcUrl) === 'jpg'" :key="index" :src="item.srcUrl"/>

                  <a v-else target="_black" :href="item.srcUrl" :key="index">
                    <el-button v-if="item.screenType === 1" :key="index" plain type="primary">下载视频</el-button>
                  </a>
                </template>
              </template>
            </div>

            <div class="bottom-screen">
              <template v-for="(item, index) in detailDialog.data.materials">
                <p :key="index" v-if="item.screenType === 2 && item.height === 880" style="margin-bottom: 20px;">下屏</p>
                <template v-if="item.screenType === 2">
                  <div :key="index" v-if="item.height === 880" class="left-pre">
                    <el-image :src="item.srcUrl"/>
                  </div>
                  <div :key="index" v-if="item.height === 720" class="right-pre">
                    <el-image :src="item.srcUrl"/>
                  </div>
                </template>
              </template>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer center">
        <el-button style="width: 136px;" type="primary" @click="detailDialog.show = false">确 定</el-button>
      </span>
    </el-dialog>


    
    <!-- 删除 提示弹窗 -->
    <el-dialog title="取消方案"
      :visible.sync="deleteDialog.show"
      width="568px"
      class="my-dialog"
    >
      <p>确认是否取消投放方案 <span class="color-main">【{{deleteDialog.data.name}}】？</span></p>
      <span slot="footer">
        <el-button @click="deleteDialog.show = false" class="btn1">取 消</el-button>
        <el-button type="primary" class="btn1" @click="delCreativeById(deleteDialog.data.id); deleteDialog.show = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { creativeStatus, projectStatus, PutGoal, projectConst, MonitorData } from '../../../../../utils/static'
import Industry from '../../../templates/Industry'

export default {
  name: "planList",
  
  components: {
    Industry
  },

  data() {
    return {
      PutGoal,
      MonitorData,
      creativeStatus,
      projectStatus,
      screenType: projectConst.screenType,

      noPassImg: require('@/assets/images/icon_not_passed.png'),

      activeName: 'aptitude',

      planNameList: {
        loading: true,
        data: []
      },

      projectNameList: {
        loading: true,
        data: []
      },

      searchParam: {
        plan: {
          id: ''
        },
        project: {
          id: ''
        },
        creative: {
          name: '',
          status: ''
        },
        page: {
          pageSize: 10,
          pageIndex: 1,
        }
      },

      detailDialog: {
        show: false,
        loading: false,
        data: ''
      },

      deleteDialog: {
        data: {name: '加载失败', id: ''},
        show: false
      },

      tableData: {
        loading: true,
        data: [],
        page: {
          currentPage: 0,
          totalCount: 0
        }
      },

      industryList: []

    };
  },

  
  watch: {
    '$route': {
      handler() {
        if (this.$route.query.active !== 'creative') return;

        if (this.$route.query.projectId) {
          this.getProjectNameList()
          this.searchParam.project.id = this.$route.query.projectId;
        } 

        else if (this.$route.query.status) {
          this.searchParam.creative.status = +this.$route.query.status;
        } 

        else {
          this.searchParam.project.id = '';
          this.searchParam.creative.status = '';
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


    // 下拉框数据 方案名字列表
    getProjectNameList() {
      this.projectNameList.loading = true;
      if (this.searchParam.plan.id) {
        return this.$api.PutProject.ProjectNameListByCamId(+this.searchParam.plan.id)
          .then(res => {
            this.projectNameList = {
              loading: false,
              data: res.result,
            }
          })
          .catch(res => {
            this.projectNameList = {
              loading: false,
              data: [],
            }
          })
      }
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

    // change计划
    changePlan() {
      this.searchParam.project.id = '';
      this.creativeName = '';
    },
    

    // change方案
    changeProject() {
      this.creativeName = '';
    },
   
    // 搜索
    search() {
      this.tableData.loading = true;
      let param = {
        campaignId: this.searchParam.plan.id,
        name: this.searchParam.creative.name,
        pageIndex: this.searchParam.page.pageIndex,
        pageSize: this.searchParam.page.pageSize,
        projectId: this.searchParam.project.id,
        status: this.searchParam.creative.status
      }
      this.$api.CreateCreative.CreativeList(param)
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

    // 创意详情
    getCreativeDetail(creativeId) {
      this.activeName = 'aptitude';
      this.detailDialog = {
        loading: true,
        show: true,
        data: ''
      }
      this.$api.CreateCreative.CreativeDetail(creativeId)
        .then(res => {
          this.detailDialog.data = res.result;
            this.detailDialog.loading = false;
        })
        .catch(res => {
          this.detailDialog = {
            loading: false,
            show: false,
            data: ''
          }
        })
    },

    // 删除by id
    delCreativeById(creativeId) {
      this.tableData.loading = true;
      this.$api.CreateCreative.DeleteCreativeById(creativeId)
        .then(res => {
          this.tableData.loading = false;
          this.$message({
            message: '删除创意成功',
            type: 'success'
          });
          this.search()
        })
        .catch(res => {
          this.tableData.loading = false;
        })
    },

    // 行业
    getIndustryList: async function() {
        this.$api.IndustryList.AllList()
          .then(res => {
            this.industryList = res.result;
          })
    },

    // 重置翻页为1 重置projectId
    handleSearch() {
      this.searchParam.page.pageIndex = 1;
      // this.$router.replace('/putManage?active=creative')
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
.creative-dialog {
  .no-pass{
    display: flex;
    align-items: center;
    padding: 16px 20px;
    background:rgba(83,160,255,0.08);
    .no-pass-img{
      width: 65px;
      height: 46px;
      margin-right: 23px;
    }
  }
  .el-dialog {
    margin-top: 10vh !important;
  }

  .el-dialog__header {
    border-bottom: 1px solid $color-border;
    padding: 24px 20px 21px 30px;

    .el-dialog__title {
      font-size: 16px;
      font-weight: 400;
      color: $color-text;
    }
  }

  .el-dialog__body {
    padding: 24px 30px 24px 30px;
  }

  .aptitude {
    .text-col {
      font-size: 14px;
      font-weight: 400;
      margin-top: 31px;
      display: flex;
    }
    .text-title {
      width: 90px;
      color: $color-table-title;
    }
    .text-info {
      color: $color-text-1;
      margin-left: 90px;
    }
    .demo-image__preview {
      margin-left: 90px;
    }
  }

  .material {
    .top-screen {
      margin-bottom: 40px;
      .el-button {
        margin-top: 24px;
      }
      .img{
        width: 260px; 
        margin-top: 20px;
      }
    }
    .bottom-screen {
      .bottom-screen-box {
        display: flex;
        margin-top: 24px;
      }
      .left-pre {
        display: inline-block;
        width: 260px;
        height: 212px;
        background: rgba(248, 248, 248, 1);
        border: 1px solid rgba(229, 231, 233, 1);
        border-radius: 2px;
      }
      .right-pre {
        display: inline-block;
        width: 260px;
        height: 146px;
        background: rgba(248, 248, 248, 1);
        border: 1px solid rgba(229, 231, 233, 1);
        border-radius: 2px;
        margin-left: 60px;
      }
    }
  }
}
</style>
