<template>
  <div v-if="allCheckLists.length > 0" class="container">
    <template v-for="(hobby) in allCheckLists">
      <div class="mid-start">
        <p class="label">{{hobby.name}}：</p>


          <div v-if="hobby.childTags !== null">
            <el-checkbox-group
              v-model="checkList"
              class="flex1">
              <el-checkbox
                v-for="item in hobby.childTags"
                :key="item.tid"
                :label="item.tid">
                {{item.name}}
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <div v-else>
            <el-checkbox-group
              v-model="checkList"
              class="flex1">
              <el-checkbox
                :key="hobby.tid"
                :label="hobby.tid">
                {{"有兴趣爱好"}}
              </el-checkbox>
            </el-checkbox-group>
          </div>


      </div>
    </template>
  </div>
</template>

<script>
  export default {
    name: "Hobby",
    data() {
      return {
        checkList: [],
        allCheckLists:[],
      }
    },
    methods: {
      getChildren(){
        this.$api.peopleInsight.getChildTags(42)
          .then(res => {
            this.allCheckLists = res.result;
          })
          .catch(res => {
            this.options = null
          })
      },
    },
    created() {
      this.getChildren();
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
