<template>
  <!-- 详情 -->
  <el-dialog
    class="my-dialog dialog-mid dialog-height-80"
    title="投放方案详情"
    :before-close="() => { $emit('hideDetial') }"
    :visible.sync="show"
    width="1000px">
    <el-tabs v-model="activeTab" style="margin-top: -15px;">
      
      <el-tab-pane label="方案信息" name="project">
        <el-form class="info-form" v-loading="projectDetail.loading" label-position='left' label-width="155px">
          <el-form-item label="投放方案名称">
            <span class="color-text-1">{{projectDetail.data.name}}</span>
          </el-form-item>
          <el-form-item label="投放方案状态">
            <label class="put-status-box">
              {{$tools.getObjectItemFromArray(projectStatus, 'value', projectDetail.data.status).name}}
            </label>
          </el-form-item>
          <el-form-item label="投放方案行业">
            <span class="color-text-1">{{projectDetail.data.industryName}}</span>
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
          <el-form-item label="投放频次">
            <span class="color-text-1">{{$tools.getObjectItemFromArray(projectConst.putFrequency, 'value', projectDetail.data.count).name}}</span>
          </el-form-item>
          <el-form-item label="投放时长">
            <span class="color-text-1">{{$tools.getObjectItemFromArray(projectConst.putDuration, 'value', projectDetail.data.second).name}}</span>
          </el-form-item>
          <el-form-item label="屏幕类型">
            <span class="color-text-1">{{$tools.getObjectItemFromArray(projectConst.screenType, 'value', projectDetail.data.type).name}}</span>
          </el-form-item>
          <el-form-item v-if="projectDetail.data.status !== 3" label="总计">
            <span class="color-red font-number">¥ {{this.$tools.toThousands(projectDetail.data.totalCost / 100)}}</span>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="点位信息" name="point">
          <BuildList 
            :projectId="projectId"
            :loading="projectDetail.loading"
            :buildingDirectionActiveType="'list'"/>
      </el-tab-pane>
    </el-tabs>
    <span slot="footer" class="dialog-footer center">
      <el-button style="width: 136px;" type="primary" @click="$emit('hideDetial')">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { projectConst, projectStatus } from '../../../../../../utils/static'
import Industry from '../../../../templates/Industry'
import BuildList from '@/views/putManage/templates/BuildList' 
import { mapGetters, mapMutations } from 'vuex'

export default {
  props: {
    projectId: {
      type: Number,
      default: 0,
      required: true
    },

    show: {
      type:Boolean
    }
  },

  components: {
    BuildList,
    Industry
  },

  data() {
    return {
      projectConst,
      projectStatus,

      projectDetail: {
        loading: true,
        data: ''
      },

      activeTab: 'project',

    }
  },

  mounted() {
    this.ProjectDetailById(this.projectId)
  },

  methods: {
    ...mapMutations(['setBuildsList']),

    // 方案详情
    ProjectDetailById: async function(projectId) {
      if (!projectId) return;
      
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

  },

  watch: {
    projectId: function(newVal, oldVal){
      this.ProjectDetailById(newVal)
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