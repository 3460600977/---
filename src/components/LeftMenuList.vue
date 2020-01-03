<template>
  <div class="left-menu clearfix" :class="{'hide': !isShowReportRoute}">
    <div style="height: 300px;">
      <div class="step_arrow">
        <a href="#" @click="handleShow">
              <span class="step_arrow_span">
                <i :class="{'rotate': !isShowReportRoute}" class="iconfont icon-icon-test2 icon-color"></i>
              </span>
        </a>
      </div>
      <el-menu :collapse="menuCollapse"
               :default-openeds="[leftMenuList.first_name]"
               :default-active="onRoutes"
               :class="{'left-report-menu':true,'hide_font': !isShowReportRoute}">
        <el-submenu v-for="(rootMenu, index) in leftMenuList.menu" :index="rootMenu.name" :key="index">
          <template slot="title">
            <img :src="leftMenuList.menu_icon" class="menuIcon">
            <span slot="title">{{rootMenu.name}}</span>
          </template>
          <el-menu-item :menu_path="menu_sub.path.substr(1)"
                        :index="menu_sub.path"
                        v-for="(menu_sub, subIndex) in rootMenu.sub_menu"
                        :key="subIndex"
                        @click="handleTo(menu_sub.path, subIndex)"
                        :class=
                          "{'item_active':onRoutes===menu_sub.path.substr(1)||
                        (subIndex===0&&onRoutes===leftMenuList.first_path)}">
            <router-link :to="menu_sub.path" target="_self"> {{menu_sub.name}}</router-link>
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
          first_name: '账号管理',
          first_path: '/toolBox/account',
          menu_index: 0,
          menu_icon: require('../assets/iconImg/icon_Management@2x.png'),
          menu: [
            {
              name: '账号管理',
              sub_menu: [
                {
                  name: '账号信息',
                  path: '/toolBox/account',
                },
              ]
            }
          ]
        }
      },
    },
    data() {
      return {
        isShowReportRoute: true,
        menuCollapse: false
      }
    },
    computed: {
      onRoutes() {
        // 当前激活菜单的 index
        return this.$route.path
      },
    },
    methods: {
      /**
       * 手动跳转
       */
      handleTo(path, index) {
        this.$router.push(path)
      },
      handleShow() {
        this.menuCollapse = !this.menuCollapse
        this.isShowReportRoute = !this.isShowReportRoute
      }
    }
  }
</script>

<style lang="scss">
  .left-menu {
    width: 220px;
    height: calc(100vh - 76px);
    overflow: hidden;
    flex-shrink: 0;
    background: $color-bg-3;
    transition: .4s;
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
    .icon-color {
      width: 12px;
      height: 16px;
      color: $color-icon;
    }
    a {
      text-decoration: none;
      color: inherit;
    }
    .el-menu-item {
      color: $color-blue;
      padding-left: 65px !important;
      &.item_active {
        border-right: 3px solid $color-main;
      }
    }
    .is-active, .item_active {
      background-color: $color-bg-4;
    }
    .el-submenu {
      background-color: $color-bg-3;
      i {
        margin-right: 20px;
      }
      li.el-menu-item a {
        margin-left: 30px;
      }
    }
    &.hide {
      width: 84px;
    }
    .el-submenu__title {
      padding-left: 30px !important;
    }
    .el-submenu__title i {
      color: $color-blue;
      &.el-submenu__icon-arrow {
        display: none;
      }
    }
    .step_arrow {
      position: relative;
      height: 31px;
      border-bottom: 1px solid $color-split-line2;
      .step_arrow_span {
        position: absolute;
        display: inline-block;
        top: 15%;
        right: 15px;
        i {
          color: $color-split-line2;
          font-size: 22px;
          cursor: pointer;
          transition: .3s;
          &.rotate {
            transform: rotate(180deg);
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
    a {
      text-decoration: none;
      color: inherit;
    }
    .el-menu-item {
      color: $color-blue;
    }
    .is-active, .item_active {
      background-color: $color-bg-4;
    }
  }
</style>
