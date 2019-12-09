<template>
    <div class="right-info-wrapper">
      <p class="font-16">投放预算</p>

      <dash-board></dash-board>
    </div>
</template>

<script>
  import DashBoard from "../../../components/chart/DashBoard";
  export default {
    name: "info",
    components: {
      DashBoard
    }
  }
</script>

<style scoped lang='scss'>
.right-info-wrapper {
  width: 312px;
  padding: 20px 20px 15px;
}
</style>
