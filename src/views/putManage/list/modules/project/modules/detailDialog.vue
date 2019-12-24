<template>
  <!-- 详情 -->
  <el-dialog
    :close-on-click-modal="false"
    class="my-dialog"
    title="投放计划详情"
    :visible.sync="detailDialogShow"
    width="1000px">
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
        345345
      </el-tab-pane>
    </el-tabs>
    <span slot="footer" class="dialog-footer center">
      <el-button style="width: 136px;" type="primary" @click="$emit('closeDetail')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    projectId: {
      type: Number,
      required: true
    },
    detailDialogShow: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      projectDetail: {
        loading: true,
        data: ''
      },

      pointDetail: {
        loading: true,
        data: []
      },
      activeTab: 'project'
    }
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

    showPointDetails(pageIndex, pageSize, projectId, record, startIndex, totalPageCount) {
      if (this.activeTab === 'point' && this.pointDetail.data.length > 0) return;
      this.$api.PutProject.ProjectBuildList()
        .then(res => {

        })
        .catch(res => {

        })
    },
  },

  watch: {
    projectId: function(oldVal, newVal){
      this.ProjectDetailById(this.projectId)
    }
  }
}
</script>