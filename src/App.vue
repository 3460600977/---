<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss" scoped>
#app {
  width: 100%;
  min-width: 1200px;
  height: 100%;
  overflow: hidden;
  background: #F6F6F6;
}
</style>
