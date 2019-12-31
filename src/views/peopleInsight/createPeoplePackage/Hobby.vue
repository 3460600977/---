<template>
  <div class="container">
    <div class="mid-start">
      <p class="label">体育健身：</p>
      <el-checkbox-group v-model="checkList" class="flex1">
        <el-checkbox label="复选框 A"></el-checkbox>
        <el-checkbox label="复选框 B"></el-checkbox>
        <el-checkbox label="复选框 C"></el-checkbox>
        <el-checkbox label="复选框 A"></el-checkbox>
        <el-checkbox label="复选框 B"></el-checkbox>
        <el-checkbox label="复选框 C"></el-checkbox>
        <el-checkbox label="复选框 A"></el-checkbox>
        <el-checkbox label="复选框 B"></el-checkbox>
        <el-checkbox label="复选框 C"></el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="mid-start">
      <p class="label">体育健身：</p>
      <el-checkbox-group v-model="checkList" class="flex1">
        <el-checkbox label="复选框 A"></el-checkbox>
        <el-checkbox label="复选框 B"></el-checkbox>
        <el-checkbox label="复选框 C"></el-checkbox>
        <el-checkbox label="复选框 A"></el-checkbox>
        <el-checkbox label="复选框 B"></el-checkbox>
        <el-checkbox label="复选框 C"></el-checkbox>
        <el-checkbox label="复选框 A"></el-checkbox>
        <el-checkbox label="复选框 B"></el-checkbox>
        <el-checkbox label="复选框 C"></el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="mid-start">
      <p class="label">体育健身：</p>
      <el-checkbox-group v-model="checkList" class="flex1">
        <el-checkbox label="复选框 A"></el-checkbox>
        <el-checkbox label="复选框 B"></el-checkbox>
        <el-checkbox label="复选框 C"></el-checkbox>
        <el-checkbox label="复选框 A"></el-checkbox>
        <el-checkbox label="复选框 B"></el-checkbox>
        <el-checkbox label="复选框 C"></el-checkbox>
        <el-checkbox label="复选框 A"></el-checkbox>
        <el-checkbox label="复选框 B"></el-checkbox>
        <el-checkbox label="复选框 C"></el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Hobby",
    data() {
      return {
        checkList: ['复选框 A']
      }
    },
  }
</script>

<style scoped lang='scss'>
.label {
  align-self: flex-start;
}
.flex1 {
  & /deep/ .el-checkbox {
    color: $color-text;
    margin-bottom: 20px;
  }
}
</style>
