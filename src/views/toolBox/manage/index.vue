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
    name: "toolManageIndex",
    data() {
      return {
        leftMenuList: {
          first_name: '账号管理',
          first_path: '/toolBox/account',
          menu_index: 0,
          menu_icon_show: true,
          menu_icon: require('../../../assets/iconImg/icon_Management@2x.png'),
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
      }
    },
    components: {
      LeftMenuList
    },
  }
</script>

<style lang="scss">
  .audit-manage {
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
