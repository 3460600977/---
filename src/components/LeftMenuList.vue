<template>
  <div class="left-menu clearfix" :class="{'hide': !isShowReportRoute}">
    <div style="height: 300px;">
      <div class="step_arrow" @click="handleShow">
        <span>
          <span class="step_arrow_span">
            <i :class="leftMenuList.menu_icon_arrow" class="iconfont icon-color"></i>
          </span>
        </span>
      </div>
      <el-menu
        :collapse="menuCollapse"
        :default-openeds="[leftMenuList.first_name]"
        :default-active="onRoutes"
        :class="{'left-report-menu':true,'hide_font': !isShowReportRoute}"
      >
        <el-submenu
          v-for="(rootMenu, index) in leftMenuList.menu"
          :index="rootMenu.name"
          :key="index"
        >
          <template slot="title">
            <img :src="leftMenuList.menu_icon" class="menuIcon" v-if="leftMenuList.menu_icon_show" />
            <i class="iconfont menuBiao" :class="leftMenuList.menu_icon_list" v-else></i>
            <span slot="title">{{rootMenu.name}}</span>
          </template>
          <el-menu-item
            :menu_path="menu_sub.path.substr(1)"
            :index="menu_sub.path"
            v-for="(menu_sub, subIndex) in rootMenu.sub_menu"
            :key="subIndex"
            @click="handleTo(menu_sub.path, subIndex)"
            :class="{'item_active':onRoutes===menu_sub.path||
                        (subIndex===0&&onRoutes===leftMenuList.first_path)}"
          >
            <router-link :to="menu_sub.path" target="_self">{{menu_sub.name}}</router-link>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
  </div>
</template>

<script>
export default {
  name: "LeftMenuList",
  props: {
    leftMenuList: {
      type: Object,
      default: {
        first_name: "账号管理",
        first_path: "/toolBox/account",
        menu_index: 0,
        menu_icon_show: true,
        menu_icon_list: {
          "icon-caiwuguanli": false,
          "icon-tongjibaobiao1": true
        },
        menu_icon_arrow: {
          "icon-icon-test1": true,
          "icon-icon-test2": false
        },
        menu_icon: require("../assets/images/icons/icon_Management@2x.png"),
        menu: [
          {
            name: "账号管理",
            sub_menu: [
              {
                name: "账号信息",
                path: "/toolBox/account"
              }
            ]
          }
        ]
      }
    }
  },
  data() {
    return {
      isShowReportRoute: true,
      menuCollapse: false
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
      this.leftMenuList.menu_icon_arrow = {
        "icon-icon-test1": !this.leftMenuList.menu_icon_arrow[
          "icon-icon-test1"
        ],
        "icon-icon-test2": !this.leftMenuList.menu_icon_arrow["icon-icon-test2"]
      };
    }
  }
};
</script>

<style scoped lang="scss">
.left-menu {
  width: 220px;
  height: calc(100vh - 76px);
  overflow: hidden;
  flex-shrink: 0;
  background: $color-bg-3;
  transition: 0.4s;
  position: relative;
  .menuIcon {
    width: 22px;
    height: 22px;
    margin-right: 38px;
  }
  .left-report-menu {
    width: 100%;
    border: none;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
  /deep/ .el-menu-item {
    color: $color-text-1;
    padding-left: 55px !important;
    line-height: 46px;
    &.item_active {
      width: 220px;
      height: 46px;
      position: relative;
    }
    &.item_active::before {
      content: "";
      width: 4px;
      height: 46px;
      position: absolute;
      top: 0;
      right: 0;
      background: $color-main;
    }
  }
  .is-active,
  .item_active {
    background-color: $color-bg;
    color: $color-main;
  }
  /deep/ .el-submenu {
    background-color: $color-bg-3;
    i {
      margin-right: 20px;
    }
    li.el-menu-item a {
      margin-left: 30px;
    }
    .menuBiao {
      font-size: 22px;
      margin-right: 38px;
    }
  }
  &.hide {
    width: 84px;
  }
  /deep/.el-submenu__title {
    padding-left: 30px !important;
  }
  /deep/ .el-submenu__title i {
    color: $color-blue;
    &.el-submenu__icon-arrow {
      display: none;
    }
  }
  .step_arrow {
    position: relative;
    height: 31px;
    border-bottom: 1px solid $color-split-line2;
    cursor: pointer;
    .step_arrow_span {
      position: absolute;
      display: inline-block;
      top: 15%;
      right: 15px;
      i {
        color: $color-split-line2;
        font-size: 14px;
        transition: 0.3s;
        margin-top: 5px;
        &.rotate {
          transform: (180deg);
        }
      }
    }
  }
  .show_menu {
    font-size: 24px;
    position: absolute;
    top: 32px;
    left: 32px;
  }
}
.el-menu--popup-right-start {
  li {
    text-align: center;
  }
  a {
    text-decoration: none;
    color: $color-text-1;
  }
  .el-menu-item {
    color: $color-blue;
  }
  .is-active,
  .item_active {
    color: $color-main;
    background-color: $color-bg;
  }
  .item_active a {
    color: $color-main;
  }
}
</style>
