<template>
  <div class="create-creative">
      <el-tabs v-model="activeName" class="my-tabs creative-box" type="border-card">
        <el-tab-pane name="create" label="创建投放计划">
          <CreativeNewPlan/>
        </el-tab-pane>
        <el-tab-pane name="exist" label="选择已有投放计划">
          <ExistPlanList :isShow="activeName==='exist'"/>
        </el-tab-pane>
      </el-tabs>
  </div>
</template>

<script>
import CreativeNewPlan from './modules/CreativeNewPlan.vue'
import ExistPlanList from './modules/existPlanList.vue'
import { mapMutations } from 'vuex'
export default {
  components: {
    CreativeNewPlan,
    ExistPlanList
  },
  data() {
    return{
      activeName: 'create'
    }
  },
  
  methods: {
    ...mapMutations(['setLeftStep'])
  },
  
  beforeMount() {
    this.setLeftStep({rootActiveIndex: 0, subActiveIndex: 0})
  }
}
</script>