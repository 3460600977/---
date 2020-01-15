<template>
  <div class="finance-manage">
    <left-menu-list :leftMenuList="leftMenuList"></left-menu-list>
    <div class="right-content">
      <!-- 审核管理 列表内容 -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import LeftMenuList from "../../components/LeftMenuList";
export default {
  name: "financeIndex",
  components: {
    LeftMenuList
  },
  data() {
    return {
      leftMenuList: {
        first_name: "财务管理",
        first_path: "/finance",
        menu_index: 0,
        menu_icon_show: false,
        menu_icon_list: {
          "icon-caiwuguanli": true,
          "icon-tongjibaobiao1": false
        },
        menu_icon_arrow: {
          "icon-icon-test1": true,
          "icon-icon-test2": false
        },
        menu_icon: require("../../assets/images/icons/icon_audit@2x.png"),
        menu: [
          {
            name: "财务管理",
            sub_menu: [
              {
                name: "账户流水",
                path: "/finance/flow"
              }
            ]
          }
        ]
      }
    };
  }
};
</script>

<style scoped lang="scss">
.finance-manage {
  height: 100%;
  display: flex;
  flex-direction: row;
  background-color: $color-bg;
  overflow-x: hidden;
}
.right-content {
  padding: 20px 20px 0;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  flex-grow: 1;
}
</style>
