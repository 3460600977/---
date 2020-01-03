<template>
  <div class="report-center">
    <left-menu-list :leftMenuList="leftMenuList"></left-menu-list>
    <div class="right-content">
      <!-- 报表中心 列表内容 -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import LeftMenuList from "../../../components/LeftMenuList";

  export default {
    name: "reportIndex",
    components: {
      LeftMenuList
    },
    data() {
      return {
        leftMenuList: {
          first_name: '投放报表',
          first_path: '/reportList',
          menu_index: 0,
          menu_icon: require('../../../assets/iconImg/icon_Management@2x.png'),
          menu: [
            {
              name: '投放报表',
              sub_menu: [
                {
                  name: '投放计划报表',
                  path: '/reportList/plan',
                },
                {
                  name: '投放方案报表',
                  path: '/reportList/project',
                }
              ]
            }
          ]
        },
      }
    },
  }
</script>

<style lang="scss">
  .report-center {
    height: 100%;
    display: flex;
    flex-direction: row;
    background-color: $color-bg;
    overflow-x: hidden;
    .right-content {
      padding: 20px 20px 0;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      flex-grow: 1;
    }
  }
</style>
