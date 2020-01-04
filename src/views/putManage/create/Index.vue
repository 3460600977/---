<!-- 投放管理首页 -->
<template>
  <div class="put-manage clearfix">
    <LeftStep v-if="$route.query.createType !== 'single'"/>

    <!-- 投放管理 每一步内容 -->
    <div class="right-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import LeftStep from '../templates/LeftStep'
export default {
  components: {
    LeftStep
  },
};
</script>

<style lang="scss" scoped>
.put-manage {
  height: 100%;
  display: flex;
  flex-direction: row;
  background-color: $color-bg;
  .right-content {
    padding: 20px 20px 0;
    height: 100%;
    overflow-y: auto;
    flex-grow: 1;
  }
}
</style>
