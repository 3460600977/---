<template>
  <div class="home">

    <!-- 脑壳 -->
    <TopHeader/>

    <!-- 身子 -->
    <main class="main">
      <router-view/>
    </main>
  </div>
</template>

<script>
import TopHeader from './modules/TopHeader'

export default {
  name: 'Home',
  components: {
    TopHeader
  }
}
</script>

<style scoped lang="scss">
.home{
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 1200px;
  display: flex;
  flex-direction: column;
  .main{
    flex-grow: 1;
    width: 100%;
    overflow-y: auto;
    background-color: $color-bg;
  }
}
</style>
