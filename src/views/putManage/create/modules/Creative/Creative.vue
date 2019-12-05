<template>
  <div class="create-creative">
      <el-tabs v-model="activeName" class="my-tabs creative-box" type="border-card">
        <el-tab-pane name="create" label="创建新广告创意">
          <CreativeNewCreative/>
        </el-tab-pane>
        <el-tab-pane name="exist" label="选择已有广告创意">
          <ExistCreativeList/>
        </el-tab-pane>
      </el-tabs>
  </div>
</template>

<script>
import CreativeNewCreative from './modules/CreativeNewCreative.vue'
import ExistCreativeList from './modules/ExistCreativeList.vue'
export default {
  components: {
    CreativeNewCreative,
    ExistCreativeList
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