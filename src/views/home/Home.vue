<template>
  <div class="home">
    <TopHeader/>
    <router-view class="main"/>
  </div>
</template>

<script>
import TopHeader from '@/components/TopHeader.vue'

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
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .main{
    flex-grow: 1;
    width: 100%;
    overflow-y: auto;
  }
}
</style>
