<template>
  <div class="show-tool">
    <div class="show-tool-in">
      <div class="tool-route" v-for="(routeItem,routeIndex) in toolList" :key="routeIndex">
        <p>{{routeItem.title}}</p>
        <div class="tool-route-item" v-for="(routeSubItem,routeSubIndex) in routeItem.subTool" :key="routeSubIndex">
          <router-link :to="routeSubItem.path" target="_self">
            <i :class="routeSubItem.icon"></i>
            <span>{{routeSubItem.des}}</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "toolBoxIndex",
        data() {
            return {
                toolList: [
                    {title: '账号管理', subTool: [{icon: 'el-icon-postcard', des: '账号信息', path: '/toolBox/account'}]},
                    {title: '辅助功能', subTool: [{icon: 'el-icon-wallet', des: '资源包', path: '/cityInsight/list'}]}
                ]
            }
        }
    }
</script>

<style lang="scss">
  .show-tool {
    margin: 20px;
    background-color: $color-bg-3;
    height: calc(100vh - 120px);
    display: flex;

    .show-tool-in {
      margin: 60px 0 0 140px;
    }

    .tool-route {
      font-size: 14px;
      color: $color-text;
    }

    .tool-route p {
      font-weight: bold;
    }

    .tool-route-item {
      width: 200px;
      height: 80px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(229, 231, 233, 1);
      border-radius: 4px;
      margin: 30px 0 83px 0;

      a {
        display: inline-block;
        margin: 20px 0 20px 16px;
        text-decoration: none;
      }

      span {
        color: $color-text;
        font-weight: 400;
        display: inline-block;
        margin-left: 13px;
      }

      i {
        color: $color-blue;
        padding: 10px;
        background-color: $color-bg;
        border-radius: 4px;
      }
    }
  }
</style>
