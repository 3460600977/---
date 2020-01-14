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
        menu_icon_finance_show: true,
        menu_icon_bao_show: false,
        menu_icon: require("../../assets/iconImg/icon_audit@2x.png"),
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
  },
  computed: {
    onRoutes() {
      // 当前激活菜单的 index
      return this.$route.path;
    }
  },
  methods: {
    /**
     * 手动跳转
     */
    handleTo(path, index) {
      this.$router.push(path);
    },
    handleShow() {
      this.menuCollapse = !this.menuCollapse;
      this.isShowReportRoute = !this.isShowReportRoute;
    }
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
