<template>
  <div class="audit-manage">
    <left-menu-list :leftMenuList="leftMenuList"></left-menu-list>
    <div class="right-content">
      <!-- 审核管理 列表内容 -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import LeftMenuList from "../../../components/LeftMenuList";
export default {
  name: "auditIndex",
  components: {
    LeftMenuList
  },
  data() {
    return {
      leftMenuList: {
        first_name: "审核管理",
        first_path: "/auditList",
        menu_index: 0,
        menu_icon_show: true,
        menu_icon: require("../../../assets/images/icons/icon_audit@2x.png"),
        menu: [
          {
            name: "审核管理",
            sub_menu: [
              {
                name: "创意审核",
                path: "/auditList/creative"
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
.audit-manage {
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
