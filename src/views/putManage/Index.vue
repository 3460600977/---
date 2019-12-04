<template>
  <div class="container">
    <el-tabs class="my-tabs creative-box" type="border-card">
      <el-tab-pane label="创建新广告创意">
        <plan-list></plan-list>
      </el-tab-pane>
      <el-tab-pane label="选择已有广告创意">选择已有广告创意</el-tab-pane>
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
