<template>
    <div class="container">
      <div class="mid-start">
        <p class="label">行业消费：</p>
        <el-cascader
          ref="industry"
          v-model="hotCons"
          multiple placeholder="请选择"
          class="flex1 select content"
          :options="options"
          :props="props"
          clearable>
        </el-cascader>
      </div>
      <el-button
        type="success"
        class="success-button"
        @click="setIndustryConsume(hotCons)"
      >选择</el-button>
    </div>
</template>

<script>
  import { mapMutations } from 'vuex'
  export default {
    name: "industryConsume",
    data() {
      return {
        props: {
          multiple: true,
          checkStrictly : true,
          value: 'tid',
          label:'name',
          children:'childTags',
        },
        options: [],
        hotCons:[]
      };
    },
    methods: {

      ...mapMutations(["setTagNames","setTagTid"]),

      getChildren(){
        this.$api.peopleInsight.getChildTags(this.$parent.activeTab)
          .then(res => {
            this.options = res.result;
          })
          .catch(res => {
            this.options = null
          })
      },

      setIndustryConsume(industryConsume){
        let tagNames = [];
        let tagTid = "";
        let tagValues = [];
        tagTid += "(";
        let tagObj = {'name':'行业消费'};
        industryConsume.forEach((item,index)=>{
          tagTid += item[item.length-1];
          if (index < industryConsume.length-1){
            tagTid += "|";
          }
          tagValues.push(this.$refs['industry'].getCheckedNodes()[index].pathLabels.join("/"))
        });
        tagTid += ")";
        tagObj.value = tagValues;
        tagNames.push(tagObj);
        if (tagValues.length > 0) {
          this.setTagTid(tagTid);
          this.setTagNames(tagNames);
        }
        this.hotCons = []

      }

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
  }
  & /deep/ .el-tag.el-tag--info .el-tag__close {
    color: #ffffff;
  }
}
.success-button {
  float: right;
  width: 15%;
 }
</style>
