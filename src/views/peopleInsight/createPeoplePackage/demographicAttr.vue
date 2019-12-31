<template>
  <div class="container">
    <div class="mid-start">
      <p class="label">性别：</p>
      <el-checkbox-group v-model="checkList" class="flex1">
        <el-checkbox label="男"></el-checkbox>
        <el-checkbox label="女"></el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="mid-start">
      <p class="label">热门消费：</p>
      <el-select v-model="value" placeholder="请选择" class="flex1 select content">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
  export default {
    name: "demographicAttr",
    data() {
      return {
        value: '',
        checkList: [],
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
      }
    },
  }
</script>

<style scoped lang='scss'>
  .select {
    & /deep/ .el-input {
      width: 100%;
    }
  }
  .flex1 {
    & /deep/ .el-checkbox {
      color: $color-text;
      margin-bottom: 20px;
    }
  }
</style>
