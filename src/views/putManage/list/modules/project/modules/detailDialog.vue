<template>
  <!-- 详情 -->
  <el-tabs @tab-click="showPointDetails" class="thin-tab small" v-model="activeTab">
    <el-tab-pane label="方案信息" name="project">
      <el-form class="info-form" v-loading="projectDetail.loading" label-position='left' label-width="150px">
        <el-form-item label="投放方案名称">
          <span class="color-text-1">{{projectDetail.data.name}}</span>
        </el-form-item>
        <el-form-item label="投放方案状态">
          <label class="put-status-box">
            {{projectStatus[projectDetail.data.status]}}
          </label>
        </el-form-item>
        <el-form-item label="投放方案行业">
          <span class="color-text-1">{{$tools.getObjectItemFromArray(indurstryList, 'industryId', projectDetail.data.industry).name || '加载中'}}</span>
        </el-form-item>
        <el-form-item label="投放类型">
          <span class="color-text-1">{{$tools.getObjectItemFromArray(projectConst.putType, 'value', projectDetail.data.projectType).name}}</span>
        </el-form-item>
        <el-form-item label="投放时间">
          <span class="color-text-1">
            {{$tools.getFormatDate('YY-mm-dd', projectDetail.data.beginTime)}}
            -
            {{$tools.getFormatDate('YY-mm-dd', projectDetail.data.endTime)}}
          </span>
        </el-form-item>
        <!-- <el-form-item label="投放方式">
          <span class="color-text-1">{{$tools.getObjectItemFromArray(projectConst.putWay, 'value', projectDetail.data.deliveryMode).name}}</span>
        </el-form-item> -->
        <el-form-item label="投放频次">
          <span class="color-text-1">{{$tools.getObjectItemFromArray(projectConst.putFrequency, 'value', projectDetail.data.count).name}}</span>
        </el-form-item>
        <el-form-item label="投放时长">
          <span class="color-text-1">{{$tools.getObjectItemFromArray(projectConst.putDuration, 'value', projectDetail.data.second).name}}</span>
        </el-form-item>
        <el-form-item label="屏幕类型">
          <span class="color-text-1">{{$tools.getObjectItemFromArray(projectConst.screenType, 'value', projectDetail.data.type).name}}</span>
        </el-form-item>
        <el-form-item label="总计">
          <span class="color-red">¥ {{projectDetail.data.totalCost}}</span>
        </el-form-item>
      </el-form>
    </el-tab-pane>

    <el-tab-pane label="点位信息" name="point">
        <SelectedList 
          :projectId="projectId"
          :loading="projectDetail.loading"
          :buildingDirectionActiveType="'list'"/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { projectConst, projectStatus } from '../../../../../../utils/static'
import SelectedList from '../../../../create/modules/project/modules/SelectedList'
import { mapGetters, mapMutations } from 'vuex'

export default {
  props: {
    projectId: {
      type: Number,
      required: true
    },
    activeTab: {
      type: String,
      default: 'project'
    }
  },

  components: {
    SelectedList
  },

  data() {
    return {
      projectConst,
      projectStatus,

      projectDetail: {
        loading: true,
        data: ''
      },

      indurstryList: [],

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
    }
  },

  mounted() {
    this.ProjectDetailById(this.projectId)
  },

  methods: {
    ...mapMutations(['setBuildsList']),

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
          this.setBuildsList(this.projectDetail.data.premiseVOS)
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

    getIndustryList() {
      if (this.indurstryList.length > 0) return;
      this.$api.IndustryList.AllList()
        .then(res => {
          this.indurstryList = res.result;
        })
    }
  },

  watch: {
    projectId: function(oldVal, newVal){
      this.ProjectDetailById(newVal)
      this.getIndustryList()
    }
  }
}
</script>

<style lang="scss">
.put-status-box{
  padding: 4px 10px;
  background: $color-main;
  font-size: 14px;
  color: #fff;
  border-radius:12px 12px 12px 0px;
}
</style>