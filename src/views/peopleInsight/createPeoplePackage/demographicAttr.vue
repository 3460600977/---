<template>
  <div class="container">
    <div class="mid-start">
      <p class="label">性别：</p>
      <el-checkbox-group v-model="checkList" class="flex1">
        <el-checkbox label="男" value="19398"></el-checkbox>
        <el-checkbox label="女" value="22253"></el-checkbox>
      </el-checkbox-group>
    </div>
    <template v-if="allOptions">
      <div v-for="(demographics,index) in allOptions" class="mid-start">
        {{demographics.childTags}}
        <template v-if="demographics.name != '性别'" >
          <p class="label">{{demographics.name}}：</p>
          <el-select v-model="demographics.childTags" multiple placeholder="请选择" class="flex1 select content">
            <el-option
              v-for="item in demographics.childTags"
              :key="item.name"
              :value="item.tid"
              :label="item.name"
            >
            </el-option>
          </el-select>
        </template>

      </div>
    </template>

  </div>
</template>

<script>
  export default {
    name: "demographicAttr",
    data() {
      return {
        value: '',
        checkList: [],
        options: [],
        allOptions:[],
      }
    },

    methods:{
      getChildren(){
        this.$api.peopleInsight.getChildTags(133)
          .then(res => {
            this.allOptions = res.result;
          })
          .catch(res => {
            this.options = null
          })
      },
    },
    created() {
      this.getChildren();
    }
  }
</script>

<style scoped lang='scss'>
  .select {
    & /deep/ .el-input {
      width: 100%;
      margin-bottom: 20px;
    }
  }
  .flex1 {
    & /deep/ .el-checkbox  {
      color: $color-text;
      margin-bottom: 20px;
    }
  }
</style>
