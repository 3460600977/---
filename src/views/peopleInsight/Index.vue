<template>
  <div class="container">
    <el-tabs @tab-click="changeTab" v-model="activeName" class="my-tabs" type="border-card">

      <el-tab-pane name="crowd">
        <p class="db-title">资源包管理</p>
        <packageList />
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
import packageList from "./list/modules/crowd/List";

export default {
  components: {
    packageList,
  },

  data() {
    return {
      activeName: ""
    };
  },

  beforeMount() {
    this.activeName = this.$route.query.active || "crowd";
  },

  methods: {
    changeTab() {
      this.$router.push({
        path: '/peopleInsight',
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
