<template>
  <div class="condition-item-box">
    <span>{{tagName}}：</span>
    <el-button v-for="(item, index) in tagValues" :key="index">{{item}}</el-button>
  </div>
</template>

<script>
    export default {
      name: "tag-list",
      props: {
        tagName: String,
        tagValues: {
          type: Array,
          default() {
            return []
          }
        }
      }
    }
</script>

<style lang="scss" scoped>
  .condition-item-box{
    float: left;
    margin-right: 30px;
    margin-top: 20px;
  }
</style>
