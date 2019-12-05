<template>
  <div class="create-creative">
      <el-tabs v-model="activeName" class="my-tabs creative-box" type="border-card">
        <el-tab-pane name="create" label="创建投放计划">
          <CreativeNewProject/>
        </el-tab-pane>
        <el-tab-pane name="exist" label="选择已有投放计划">
          <ExistProjectList/>
        </el-tab-pane>
      </el-tabs>
  </div>
</template>

<script>
import CreativeNewProject from './modules/CreativeNewProject.vue'
import ExistProjectList from './modules/ExistProjectList'
export default {
  components: {
    CreativeNewProject,
    ExistProjectList
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