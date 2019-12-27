<template>
  <div class="container">
    <div class="mid-start">
      <p class="label">城市：</p>
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
    name: "locationAttr",
    data() {
      return {
        value: [],
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
    & /deep/ .el-tag.el-tag--info .el-tag__close {
      color: #ffffff;
    }
  }
</style>
