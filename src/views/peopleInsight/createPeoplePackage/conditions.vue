<template>
  <div style="margin-bottom: 40px">
    <div class="wrapper">
      <div class="font-0 mid-start">
        <p class="label">城市</p>
        <div class="flex1 tags" >
          <template v-for="(tagObj,parentIndex) in crowdProject.tagNames">
            <el-tag 
              v-for="(tag,index) in tagObj.tags"
              :key="index"
              closable
              :disable-transitions="true"
              @close="handleClose(parentIndex,index )"
            >
              <template v-for="(name) in tag.name">
                <template v-if="index!=(tag.name.length-1)">{{name}}/</template>
                <template v-else>{{name}}</template>
              </template>
            </el-tag>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  name: "conditions",
  data() {
    return {
      tags: [],
      inputVisible: false,
      tagNames: []
    };
  },
  methods: {
    ...mapMutations(["removeTagNamesByIndexes"]),
    handleClose(parentIndex, index) {
      this.removeTagNamesByIndexes({ parentIndex: parentIndex, index: index });
    }
  },
  computed: {
    ...mapState(["crowdProject"])
  },
};
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
  font-size: 14px;
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
