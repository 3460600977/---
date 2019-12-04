<template>
  <div class="create-creative">
      <el-tabs v-model="activeName" class="my-tabs creative-box" type="border-card">
        <el-tab-pane name="create" label="创建投放计划">
          <CreativeNewPlan/>
        </el-tab-pane>
        <el-tab-pane name="exist" label="选择已有投放计划">
        </el-tab-pane>
      </el-tabs>
  </div>
</template>

<script>
import CreativeNewPlan from './modules/CreativeNewPlan.vue'
export default {
  components: {
    CreativeNewPlan
  },
  data() {
    return{
      activeName: 'create'
    }
  }
}
</script>

<style lang="scss">
  .create-creative{
    
  }
</style>