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
        <el-button
          class="success-button"
          @click="setIndustryConsume(crowdProject.industryTid,hotCons)"
        >选择</el-button>
      </div>
    </div>
</template>

<script>
  import {mapMutations, mapState} from 'vuex'
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

      ...mapMutations(["setTagNames"]),

      getChildren(){
        this.$api.peopleInsight.getChildTags(this.$parent.activeTab)
          .then(res => {
            this.options = res.result;
            this.$set(this.crowdProject.tagNamesObj, this.crowdProject.industryTid, [])
          })
          .catch(res => {
            this.options = null
          })
      },

      setNames (tagArray) {
        return tagArray.join("/");
      },

      setIndustryConsume(tid,industryConsume){

        let tagArray = [];
        let tagObj = {'name':'行业消费','tid':tid};
        let industryTid = 0;
        let tags = [];
        industryConsume.forEach((item,index)=>{
          industryTid = (item[item.length-1]);
          let tagName = this.setNames(this.$refs['industry'].getCheckedNodes()[index].pathLabels);
          tags.push({'tid':industryTid,'name':tagName});
        });
        tagObj.tags = tags;
        tagArray.push(tagObj);
        if (tagArray.length > 0) {
          this.setTagNames(tagArray);
        }
        this.hotCons = []
      }

    },
    created() {
      this.getChildren();
    },
    computed:{
      ...mapState(["crowdProject"])
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
  margin-left: 30px;
  margin-bottom: auto;
  width: 11%;
 }
</style>
