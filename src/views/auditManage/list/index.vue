<template>
  <div class="audit-manage">
    <div class="left-menu clearfix" :class="{'hide': !isShowReportRoute}">
      <div style="height: 300px;">
        <div class="step_arrow">
          <a href="#" @click="handleShow">
              <span class="step_arrow_span">
                <i :class="{'rotate': !isShowReportRoute}" class="el-icon-d-arrow-left"></i>
              </span>
          </a>
        </div>
        <el-menu :collapse="menuCollapse"
                 :default-openeds="[report.default_name]"
                 :default-active="onRoutes"
                 :class="{'left-report-menu':true,'hide_font': !isShowReportRoute}">
          <el-submenu v-for="(rootMenu, index) in report.menu" :index="rootMenu.name" :key="index">
            <template slot="title">
              <i class="el-icon-folder-checked"></i>
              <span slot="title">{{rootMenu.name}}</span>
            </template>
            <el-menu-item :menu_path="menu_sub.path.substr(1)"
                          :index="menu_sub.path"
                          v-for="(menu_sub, subIndex) in rootMenu.sub_menu"
                          :key="subIndex"
                          @click="handleTo(menu_sub.path, subIndex)"
                          :class="{'item_active':onRoutes===menu_sub.path.substr(1)||(subIndex===0&&onRoutes===default_path)}">
              <router-link :to="menu_sub.path" target="_self">{{menu_sub.name}}</router-link>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
    </div>
    <div class="right-content">
      <!-- 审核管理 列表内容 -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: "auditIndex",
    data() {
      return {
        default_path: 'auditList',
        menuActiveIndex: 0,
        isShowReportRoute: true,
        menuCollapse: false,
        report: {
          menu_index: 0,
          default_name: '审核管理',
          menu: [
            {
              name: '审核管理',
              sub_menu: [
                {
                  name: '创意审核',
                  path: '/auditList/creative',
                },
              ]
            }
          ]
        }
      }
    },
    computed: {
      onRoutes() {
        // 当前激活菜单的 index
        return this.$route.path.replace('/', '').replace('/', '')
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
  .audit-manage {
    height: 100%;
    display: flex;
    flex-direction: row;
    background-color: $color-bg;
    overflow-x: hidden;
    .left-menu {
      width: 220px;
      height: calc(100vh - 76px);
      overflow: hidden;
      flex-shrink: 0;
      background: $color-bg-3;
      transition: .4s;
      position: relative;
      .left-report-menu {
        border: none;
      }
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
      .el-submenu {
        background-color: $color-bg-3;
        i {
          margin-right: 30px;
        }
        li.el-menu-item a {
          margin-left: 30px;
        }
      }
      /* .el-menu-item:hover {
       background-color: $color-bg-4
     }

     .el-menu-item:focus {
       background-color: $color-bg-3
     }

     .el-menu-active {
       background-color: $color-bg-4
     }*/
      &.hide {
        width: 84px;
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
          right: 0;
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
      .hide_text {
        display: none;
      }
      .hide_font {
        margin: 0;
        width: 100%;
        text-align: center;
        .el-menu--vertical {
          display: none;
        }
        .item_active {
          background-color: $color-bg-3;
        }
        .el-submenu__title {
          padding: 0 !important;
          margin: 0 !important;
        }
      }
    }
    .right-content {
      padding: 20px 20px 0;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      flex-grow: 1;
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
