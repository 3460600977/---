<template>
  <div class="container">
    <el-tabs v-model="activeName" class="my-tabs" type="border-card">
      <el-tab-pane label="投放计划" name="plan"><planList/></el-tab-pane>
      <el-tab-pane label="投放方案" name="project"><projectList/></el-tab-pane>
      <el-tab-pane label="广告创意" name="creative"><creativeList/></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import planList from './list/modules/plan/List'
import creativeList from './list/modules/creative/List'
import projectList from './list/modules/project/List'

export default {
  components: {
    planList,
    creativeList,
    projectList
  },

  data() {
    return {
      activeName: 'plan'
    }
  },
}
</script>

<style scoped lang='scss'>
  .container {
    height: 100%;
    width: 100%;
    padding: 20px;
    background-color: $color-bg !important;
  }
</style>
