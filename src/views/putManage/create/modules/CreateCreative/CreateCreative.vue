<template>
  <div class="create-creative">
      <el-tabs class="my-tabs creative-box" type="border-card">
        <el-tab-pane label="创建新广告创意">
          <CreativeCreativeCommon/>
        </el-tab-pane>
        <el-tab-pane label="选择已有广告创意">选择已有广告创意</el-tab-pane>
      </el-tabs>
    <!-- <PutMangeCard>
    </PutMangeCard> -->
  </div>
</template>

<script>
import CreativeCreativeCommon from '../../../templates/CreativeCreativeCommon.vue'
import PutMangeCard from '../../../templates/PutMangeCard.vue'
export default {
  components: {
    CreativeCreativeCommon,
    PutMangeCard
  }
}
</script>

<style lang="scss">
  .create-creative{
    
  }
</style>