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

      <el-form-item class="line-space" label="广告创意名称">
        <el-select 
          @focus="getCreativeNameList"
          :loading="creativeNameList.loading" 
          v-model="searchParam.name" 
          placeholder="不限" 
          filterable
          clearable>
          <el-option
            v-for="item in creativeNameList.data"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item class="line-space" label="创意状态">
        <el-select 
          v-model="searchParam.status" 
          placeholder="不限" 
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

      <el-form-item class="list-query-button">
        <el-button type="primary" plain @click="search">查询</el-button>
      </el-form-item>

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
              @click="getCreativeDetail(scope.row.id)"
            >
              <i class="iconfont icon-shuxingliebiaoxiangqing2 icon-color"></i>详情
            </span>
            <span class="icon-space hand">
              <router-link :to="`/putManage/create/creative?createType=edit&creativeId=${scope.row.id}`">
                <i class="iconfont icon-baobiao icon-color"></i>修改
              </router-link>
            </span>
            <span 
              @click="delCreativeById(scope.row.id)"
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



    <el-dialog 
      title="广告创意详情" 
      width="1000px" 
      :visible.sync="detailDialog.show" 
      class="creative-dialog my-dialog">
      <el-tabs v-model="activeName">
        <el-tab-pane label="创意资质" name="aptitude" class="aptitude">
          <div v-loading="detailDialog.loading">
            <div class="text-col">
              <span class="text-title">广告创意名称</span>
              <label class="text-info">{{detailDialog.data.name}}</label>
            </div>

            <div  class="text-col">
              <span class="text-title">广告创意行业</span>
              <label class="text-info">{{$tools.getObjectItemFromArray(industryList, 'industryId', detailDialog.data.industry).name}}</label>
            </div>

            <div  class="text-col">
              <span class="text-title">广告创意资质</span>
              <div v-if="detailDialog.data.industryIdentify" class="demo-image__preview">
                <el-image
                  fit="cover"
                  v-for="(item, index) in JSON.parse(detailDialog.data.industryIdentify)" :key="index" 
                  :src="item"
                  style="width: 100px; height: 158px;border-radius: 2px; margin-left: 10px;">
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
              <p>上屏</p>
              <template v-for="(item, index) in detailDialog.data.materials">
                <a target="_black" :href="item.srcUrl" :key="index">
                  <el-button v-if="item.screenType === 1" :key="index" plain type="primary">下载视频</el-button>
                </a>
              </template>
            </div>
            <div class="bottom-screen">
              <p>下屏</p>
              <div class="bottom-screen-box">
                <template v-for="(item, index) in detailDialog.data.materials">
                  <div v-if="item.height === 880 && item.screenType === 2" :key="index" class="left-pre">
                    <el-image :src="item.srcUrl"/>
                  </div>
                  <!-- <div class="left-pre mid-center" v-else :key="index">未上传</div> -->
                </template>
                <template v-for="(item, index) in detailDialog.data.materials">
                  <div v-if="item.height === 720 && item.screenType === 2" class="right-pre" :key="index">
                    <el-image :src="item.srcUrl"/>
                  </div>
                  <!-- <div class="right-pre mid-center" v-else :key="index">未上传</div> -->
                </template>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer center">
        <el-button style="width: 136px;" type="primary" @click="detailDialog.show = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { PutGoal, projectConst, MonitorData } from '../../../../../utils/static'
import { resolve, reject } from 'q';
export default {
  name: "planList",

  data() {
    return {
      PutGoal,
      MonitorData,
      screenType: projectConst.screenType,
      planNameList: {
        loading: true,
        data: []
      },
      projectNameList: {
        loading: true,
        data: []
      },
      creativeNameList: {
        loading: true,
        data: []
      },
      creativeStatus: [
        { name: '待审核', value: 0},
        { name: '审核通过', value: 2},
        { name: '审核拒绝', value: 1}
      ],

      activeName: 'aptitude',

      searchParam: {
        campaignId: '', 
        name: '',
        pageIndex:'',
        pageSize: '',
        projectId: '',
        status: ''
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
        loading: false,
        data: ''
      },

      industryList: []

    };
  },

  beforeMount() {
    this.search()
  },

  methods: {
    // 下拉框数据 计划名字列表
    getPlanNameList() {
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

    // 下拉框数据 创意名字列表
    getCreativeNameList() {
      this.creativeNameList.loading = true;
      this.$api.CreateCreative.CreativeNameList()
        .then(res => {
          this.creativeNameList = {
            loading: false,
            data: res.result
          };
        })
        .catch(res => {
          this.creativeNameList = {
            loading: false,
            data: []
          };
        })
    },

    // 搜索
    search() {
      this.tableData.loading = true;
      this.$api.CreateCreative.CreativeList(this.searchParam)
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
      this.getIndustryList()
      this.$api.CreateCreative.CreativeDetail(creativeId)
        .then(res => {
          this.detailDialog.loading = false;
          this.detailDialog.data = res.result;
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
          this.$notify({
            title: '成功',
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

<style lang='scss' scoped>
@import '../listCommonStyle.scss';
.creative-dialog {
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
      p {

      }

      .el-button {
        margin-top: 24px;
      }

    }

    .bottom-screen {
      margin-top: 50px;

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
