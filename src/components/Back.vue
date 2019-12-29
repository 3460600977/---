<template>
  <div class="bb mid-between">
    <el-button type="primary" class="btn" @click="handleBack">返回</el-button>
  </div>
</template>

<script>
  export default {
    name: "bottomBack",
    methods: {
      handleBack() {
        this.$emit('handleBack')
      },
    }
  }
</script>

<style scoped lang='scss'>
  .bb {
    height: 120px;
    width: 100%;
    background: #fff;
    margin-top: 1.04%;
    justify-content: flex-end;
    padding-right: 60px;
    .btn {
      align-items: flex-end;
      width: 136px;
    }
  }
</style>
