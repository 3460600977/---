<template>
  <div style="margin-bottom: 40px">
    <template v-for="(tagObj,parentIndex) in crowdProject.tagNames">
      <div class="wrapper" :key='parentIndex'>
        <div class="font-0 mid-start">
          <p class="label">{{tagObj.name}}</p>
          <div class="flex1 tags">
            <el-tag
              v-for="(tag,index) in tagObj.tags"
              :key="tag.tid"
              closable
              :disable-transitions="true"
              @close="handleClose(parentIndex,index )"
            >
              {{tag.name}}
            </el-tag>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import {mapMutations, mapState} from "vuex";
  export default {
    name: "conditions",
    data() {
      return {
        tags: [],
        inputVisible: false,
        tagNames:[],
      }
    },
    methods:{
      ...mapMutations(["removeTagNamesByIndexes"]),
      handleClose(parentIndex,index) {
        this.removeTagNamesByIndexes({parentIndex:parentIndex,index:index});
      }
    },
    computed:{
      ...mapState(["crowdProject"])
    }

  }
</script>

<style scoped lang='scss'>
  .wrapper {
    padding: 0 0 0 30px;
    & /deep/ .el-tag .el-tag__close {
      color: $color-border;
    }
  }
  .label {
    display: inline-block;
    font-size:14px;
    width: 90px;
    align-self: baseline;
  }
  .el-tag + .el-tag {
    margin-right: 0px;
  }
  .el-tag {
    margin-bottom: 20px;
    background: transparent;
    color: $color-text;
    border-color: $color-border;
    &:hover {
      color: $color-main;
      border-color: $color-main;
      .el-tag .el-tag__close {
        color: $color-main;
      }
    }
  }
  .tags .el-tag {
    margin-right: 20px;
  }
</style>
