<template>
  <div class="create-creative">
      <el-tabs v-model="activeName" class="my-tabs creative-box" type="border-card">
        <el-tab-pane name="create" label="创建新广告创意">
          <CreativeCreativeCommon/>
        </el-tab-pane>
        <el-tab-pane name="exist" label="选择已有广告创意">
          <existCreativeList/>
        </el-tab-pane>
      </el-tabs>
  </div>
</template>

<script>
import CreativeCreativeCommon from './modules/CreativeNewCreative.vue'
import existCreativeList from './modules/existCreativeList.vue'
export default {
  components: {
    CreativeCreativeCommon,
    existCreativeList
  },
  data() {
    return{
      activeName: 'exist'
    }
  }
}
</script>

<style lang="scss">
  .create-creative{
    
  }
</style>