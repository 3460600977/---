<template>
  <div v-if="allCheckLists" class="container">
    <template v-for="(hobby) in allCheckLists">
      <div class="mid-start">
        <p class="label">{{hobby.name}}：</p>
          <div v-if="hobby.childTags !== null">
            <el-checkbox-group
              v-model="crowdProject.tagNamesObj[hobby.tid]"
              class="flex1"
              @change="changeHobby(hobby.tid,crowdProject.tagNamesObj[hobby.tid])">
              <el-checkbox
                v-for="item in hobby.childTags"
                :key="item.tid"
                :label="item.tid">
                {{item.name}}
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <!--<div v-else>
             <el-checkbox-group
               v-model="crowdProject.tagNamesObj[hobby.tid]"
               class="flex1"
               @change="changeHobby(hobby.tid,crowdProject.tagNamesObj[hobby.tid])">
               <el-checkbox
                 :key="hobby.tid"
                 :label="hobby.tid">
                 {{"有兴趣爱好"}}
               </el-checkbox>
             </el-checkbox-group>
          </div>-->
      </div>
    </template>
  </div>
</template>

<script>
  import {mapMutations, mapState} from "vuex";

  export default {
    name: "Hobby",
    data() {
      return {
        obj:{},
        checkList: [],
        allCheckLists:[],
        everyObj:{},
      }
    },
    methods: {

      ...mapMutations(["setTagNamesWithUpdate","removeTagNamesByName","setTagTid"]),

      getChildren(){
        this.$api.peopleInsight.getChildTags(this.$parent.activeTab)
          .then(res => {
            this.allCheckLists = res.result;
            this.allCheckLists.forEach((item) => {
              if (item.childTags !== null) {
                this.$set(this.crowdProject.tagNamesObj, item.tid, []);
                item.childTags.pname = item.name;
                this.$set(this.everyObj, item.tid, item.childTags);
              }
            });
          })
          .catch(res => {
            this.allCheckLists = []
          })
      },
      changeHobby(tid,items){
        let tagNames = [];
        let tagTid = "";
        let tagTidAry = [];
        let tagValues = [];
        let tagObj = {'name':this.everyObj[tid].pname,'tid':tid};
        if (items.length > 0){
          this.everyObj[tid].forEach((childTag)=>{
            items.forEach((item,index)=>{
              if (childTag.tid === item){
                tagTidAry.push(item);
                tagValues.push(childTag.name);
              }

            })
          });
          tagTid = "(" + tagTidAry.join("|") + ")";
          console.log(tagTid);
          tagObj.value = tagValues;
          tagNames.push(tagObj);
          //set方式不一样  这里是tag组只能有一个
          this.setTagNamesWithUpdate(tagNames);
          //TODO 先用push  后期优化
          this.setTagTid(tagTid);
        }else {
          //移除当前tag组
          this.removeTagNamesByName({'name':this.everyObj[tid].pname});
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
