<template>
  <!-- 详情 -->
  <el-tabs @tab-click="showPointDetails" class="thin-tab small" v-model="activeTab">
    <el-tab-pane label="方案信息" name="project">
      <el-form v-loading="projectDetail.loading" label-position='left' label-width="150px">
        <el-form-item label="投放方案名称">
          <span class="color-text-1">{{projectDetail.data.name}}</span>
        </el-form-item>
        <el-form-item label="投放方案状态">
          <span class="color-text-1">{{projectDetail.data.status}}</span>
        </el-form-item>
        <el-form-item label="投放方案行业">
          <span class="color-text-1">{{projectDetail.data.industry}}</span>
        </el-form-item>
        <el-form-item label="投放类型">
          <span class="color-text-1">{{projectDetail.data.projectType}}</span>
        </el-form-item>
        <el-form-item label="投放时间">
          <span class="color-text-1">
            {{$tools.getFormatDate('YY-mm-dd', projectDetail.data.beginTime)}}
            -
            {{$tools.getFormatDate('YY-mm-dd', projectDetail.data.endTime)}}
          </span>
        </el-form-item>
        <el-form-item label="投放方式">
          <span class="color-text-1">{{projectDetail.data.deliveryMode}}</span>
        </el-form-item>
        <el-form-item label="投放频次">
          <span class="color-text-1">{{projectDetail.data.count}}</span>
        </el-form-item>
        <el-form-item label="投放时长">
          <span class="color-text-1">{{projectDetail.data.second}}</span>
        </el-form-item>
        <el-form-item label="屏幕类型">
          <span class="color-text-1">{{projectDetail.data.type}}</span>
        </el-form-item>
        <el-form-item label="总计">
          <span class="color-red">{{projectDetail.data.totalCost}}</span>
        </el-form-item>
      </el-form>
    </el-tab-pane>

    <el-tab-pane label="点位信息" name="point">
      <div class="build-msg-list">
        <div class="build-title mid-between">
          <div>
            <span>已选择楼盘 <span class="color-main font16">78</span> 个</span>,
            <span> 可售设备 <span class="color-main font16">67</span> 个</span>
          </div>
        </div>
        <ul class="build-msg-item-box">
          <li class="item mid color-text" v-for="(item, index) in pointDetail.data" :key="index">
            <div class="left-info">
              <p class="name">{{item.name}}</p>
            </div>
            <span>{{item.count}} 部</span>
          </li>
          <!-- <li class="item clearfix">
            <el-pagination
              class="float-right"
              background
              layout="total, sizes, prev, pager, next"
              :total="20">
            </el-pagination>
          </li> -->
        </ul>
        
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  props: {
    projectId: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      projectDetail: {
        loading: true,
        data: ''
      },

      pointDetail: {
        param: {
          pageIndex: 0, 
          pageSize: 1000, 
          projectId: '', 
          record: 0, 
          startIndex: 0, 
          totalPageCount: 0
        },
        loading: true,
        data: []
      },
      activeTab: 'project'
    }
  },

  mounted() {
    this.ProjectDetailById(this.projectId)
  },

  methods: {
    ProjectDetailById(projectId) {
      this.projectDetail = {
        loading: true,
        data: ''
      }
      this.$api.PutProject.GetProjectDetailById(projectId)
        .then(res => {
          this.projectDetail = {
              loading: false,
              data: res.result
            }
        })
        .catch(res => {
          this.projectDetail = {
              loading: false,
              data: ''
            }
        })
    },

    showPointDetails() {
      if (this.activeTab === 'project' && this.pointDetail.data.length > 0) return;
      this.pointDetail.param.projectId = this.projectId;
      this.pointDetail.loading = true;
      this.pointDetail.data = [];
      this.$api.PutProject.ProjectBuildList(this.pointDetail.param)
        .then(res => {
          this.pointDetail.loading = false;
          this.pointDetail.data = res.result;
        })
        .catch(res => {
          this.pointDetail.loading = true;
          this.pointDetail.data = [];
        })
    },
  },

  watch: {
    projectId: function(oldVal, newVal){
      this.ProjectDetailById(newVal)
    }
  }
}
</script>

<style lang="scss">
.build-msg-list{
  margin-top: 40px;
  width:538px;
  border:1px solid rgba(229,231,233,1);
  .build-title{
    height: 48px;
    padding: 0 11px;
    line-height: 44px;
    font-weight: bold;
    background:rgba(249,252,255,1);
  }
  .build-msg-item-box{
    max-height: 482px;
    overflow-y: auto;
    .item{
      position: relative;
      border-top:1px solid rgba(229,231,233,1);
      padding: 14px 11px;
      .left-info{
        width: 440px;
        .name{
          height: 14px;
          line-height: 14px;
        }
      }
    }
  }
}
</style>