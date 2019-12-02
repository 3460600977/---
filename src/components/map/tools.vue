<template>
    <div class="tools">
        <div @click="click">点击</div>
    </div>
</template>

<script>
  export default {
    name: "tools",
    methods: {
      click() {
        this.$emit('click')
      }
    }
  }
</script>

<style scoped lang='scss'>
.tools {
  width: 200px;
  background: red;
}
</style>
