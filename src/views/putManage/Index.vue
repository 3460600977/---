<template>
  <div class="container">
    <el-tabs class="my-tabs" type="border-card">
      <el-tab-pane label="投放计划">投放方案</el-tab-pane>
      <el-tab-pane label="投放计划">投放计划</el-tab-pane>
      <el-tab-pane label="广告创意">
        <planList/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import planList from './list/modules/plan/List'

export default {
  components: {
    planList,
  }
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
