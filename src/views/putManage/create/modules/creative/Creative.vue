<template>
  <div class="create-creative">
    <!-- 单独创建编辑 -->
    <CreativeNewCreative v-if="$route.query.createType !== 'step'"/>

    <!-- 按步骤 -->
    <el-tabs v-else v-model="activeName" class="my-tabs creative-box" type="border-card">
      <el-tab-pane name="create" label="创建新广告创意">
        <CreativeNewCreative/>
      </el-tab-pane>
      <el-tab-pane name="exist" label="选择已有广告创意">
        <ExistCreativeList :isShow="activeName==='exist'"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import CreativeNewCreative from './modules/CreativeNewCreative.vue'
import ExistCreativeList from './modules/ExistCreativeList.vue'
import { mapMutations } from 'vuex'
export default {
  components: {
    CreativeNewCreative,
    ExistCreativeList
  },
  data() {
    return{
      activeName: 'create',
      projectData: {}
    } 
  },
  
  methods: {
    ...mapMutations(['setLeftStep'])
  },
  
  beforeMount() {
    this.setLeftStep({rootActiveIndex: 2, subActiveIndex: 0})
  }
}
</script>

<style lang="scss">
  .create-creative{
    
  }
</style>