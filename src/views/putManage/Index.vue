<!-- 投放管理首页 -->
<template>
  <div class="put-manage clearfix">
    <div class="left-step">
      step
    </div>

    <div class="right-content">
      <!-- 投放管理 每一步内容 -->
      <router-view></router-view>
    </div>
  </div>
</template>

<style lang="scss">
.put-manage{
  height: 100%;
  display: flex;
  flex-direction: row;
  background-color: $color-bg;
  .left-step{
    width: 220px;
    height: calc(100vh - 76px);
    flex-shrink: 0;
    background: #fff;
  }
  .right-content{
    padding: 20px 20px 0;
    height: 100%;
    flex-grow: 1;
  }
}
</style>