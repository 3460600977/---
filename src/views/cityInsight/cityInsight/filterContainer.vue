<template>
    <div class="filter-container">
      <div style="width: 200px">
        <left-tab
          :tabData="tabData"
          :activeTab="activeTab"
          @changeTab="changeTab"
        ></left-tab>
      </div>
    </div>
</template>

<script>
  import leftTab from "../../../components/leftTab";
  export default {
    name: "filterContainer",
    components: {
      leftTab
    },
    data() {
      return {
        activeTab: 0,
        tabData: [
          {name: '人群洞察', value: 0},
          {name: '楼盘筛选', value: 1},
          {name: '门店导入', value: 2},
        ]
      }
    },
    methods: {
      changeTab(val) {
        this.activeTab = val.value
      },
    },
  }
</script>

<style scoped lang='scss'>
.filter-container {
  background: #ffffff;
  width: 1000px;
}
</style>
