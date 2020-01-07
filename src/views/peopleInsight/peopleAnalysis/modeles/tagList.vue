<template>
  <div class="condition-item-box">
    <span >{{tagName}}：</span>
    <el-tag
      class="my-tag"
      v-for="(item, index) in tagValues"
      :key="index"
      type="info"
    >
      {{item}}
    </el-tag>
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
    margin-top: 10px;
  }
  .my-tag {
    margin-left: 10px;
    margin-top: 10px;
  }
</style>
