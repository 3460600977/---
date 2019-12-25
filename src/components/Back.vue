<template>
    <div class="bb mid-between">
      <el-button type="primary" class="btn">返回</el-button>
    </div>
</template>

<script>
  export default {
    name: "bottomBack"
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
