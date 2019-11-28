<template>
  <main class="home-body">
    首页
  </main>
</template>

<script>
export default {
  name: 'HomeBody',
  mounted() {
    this.$api.test()
  }
}
</script>