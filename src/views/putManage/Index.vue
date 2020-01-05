<template>
  <div class="container">
    <el-tabs @tab-click="changeTab" v-model="activeName" class="my-tabs" type="border-card">

      <el-tab-pane :lazy="true" label="投放计划" name="plan">
        <planList :active="activeName === 'plan'" />
      </el-tab-pane>

      <el-tab-pane :lazy="true" label="投放方案" name="project">
        <projectList :active="activeName === 'project'" />
      </el-tab-pane>

      <el-tab-pane :lazy="true" label="广告创意" name="creative">
        <creativeList :active="activeName === 'project'" />
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
import planList from "./list/modules/plan/List";
import creativeList from "./list/modules/creative/List";
import projectList from "./list/modules/project/List";

export default {
  components: {
    planList,
    creativeList,
    projectList
  },

  data() {
    return {
      activeName: ""
    };
  },

  watch: {
    '$route': {
      handler: function(val) {
        this.activeName = val.query.active || "plan";
        if (!val.query.active) {
          this.$router.replace('/putManage?active=plan')
        }
      },
      immediate: true
    } 
  },

  methods: {
    changeTab() {
      this.$router.replace({
        path: '/putManage',
        query: {
          active: this.activeName
        }
      })
    },
  },
};
</script>

<style scoped lang='scss'>
.container {
  height: 100%;
  width: 100%;
  padding: 20px;
  background-color: $color-bg !important;
}
</style>
