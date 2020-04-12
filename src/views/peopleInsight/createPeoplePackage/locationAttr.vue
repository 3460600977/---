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
           collapse-tags
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
          multiple :true,
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
            this.options = res.result;//拿到的是联动菜单中的各个城市 
            this.$set(this.crowdProject.tagNamesObj, this.crowdProject.cityTid, []);
          })
          .catch(res => {
            this.options = null
          })
      },

      setLocation(tid,locationConsume,e){
      
        let tags = [];
        let tagArray = [];
        let tagObj = {'name':'城市','tid':tid};
        let cityTid = 0;
        if (locationConsume.length > 0){
          for(let i=0;i<locationConsume.length;i++){
            cityTid=locationConsume[i]
          }
        
      
          let checkedNodes = this.$refs['location'].getCheckedNodes()
          if(checkedNodes[0].pathLabels.length===2){ // 清除自动记录的非叶子数据
            checkedNodes.shift();
          }
         
          let tagNameArray = null;
          if(checkedNodes[0].pathLabels.length===1){
            tagNameArray = checkedNodes[0].pathLabels;
          }else{
            tagNameArray = checkedNodes[checkedNodes.length-1].pathLabels;//这是点击拿到的城市，是一个数组
          }
         
          console.log(tagNameArray);
          
          tags.push({'tid':cityTid,'name':[...tagNameArray]});//这不操作是把数组中的名字取出来
          tagObj.tags = tags;
          tagArray.push(tagObj);

          console.log(tagObj); // 新增tag内容
          
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
