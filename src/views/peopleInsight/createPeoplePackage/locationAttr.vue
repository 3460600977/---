<template>
  <div class="container">
    <div class="mid-start">
      <p class="label">城市：</p>
      <el-cascader
        ref="location"
        v-model="crowdProject.tagNamesObj[crowdProject.cityTid]"
        multiple placeholder="请选择"
        class="flex1 select content"
        :options="options"
        :props="props"
        :show-all-levels="false"
        clearable
        @change="setLocation(crowdProject.cityTid,crowdProject.tagNamesObj[crowdProject.cityTid])"
      >
      </el-cascader>
    </div>
  </div>
</template>

<script>
  import {mapMutations, mapState} from "vuex";

  export default {
    name: "locationAttr",
    data() {
      return {
        props: {
          value: 'tid',
          label:'name',
          children:'childTags',
        },
        options: [],
       }
    },
    methods: {
      ...mapMutations(["setTagNamesWithUpdate","removeTagNamesByName"]),

      getChildren(){
        this.$api.peopleInsight.getChildTags(this.$parent.activeTab)
          .then(res => {
            this.options = res.result;
            this.$set(this.crowdProject.tagNamesObj, this.crowdProject.cityTid, []);
          })
          .catch(res => {
            this.options = null
          })
      },

      setLocation(tid,locationConsume){
        let tags = [];
        let tagArray = [];
        let tagObj = {'name':'城市','tid':tid};
        let cityTid = 0;
        if (locationConsume.length > 0){
          cityTid = locationConsume[locationConsume.length-1];
          let tagNameArray = this.$refs['location'].getCheckedNodes()[0].pathLabels;
          tags.push({'tid':cityTid,'name':tagNameArray[tagNameArray.length-1]});
          tagObj.tags = tags;
          tagArray.push(tagObj);
          //set方式不一样  这里是tag组只能有一个
          this.setTagNamesWithUpdate(tagArray);
        }else {
          this.removeTagNamesByName({'name':'城市'});
        }

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
</style>
