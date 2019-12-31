<template>
  <div class="container">
    <template v-if="allOptions.length > 0">
      <template v-if="gender.name">
        <div class="mid-start">
          <p class="label">{{gender.name}}:</p>
          <el-checkbox-group
            v-model="crowdProject.tagNamesObj[gender.tid]"
            @change="changeSelect(gender.tid,crowdProject.tagNamesObj[gender.tid])"
            class="flex1"
          >
            <el-checkbox
              v-for="item in gender.childTags"
              :key="item.tid"
              :label="item.tid"
            >
              {{item.name}}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </template>
      <div v-for="demographics in other">
        <div class="mid-start">
            <p class="label">{{demographics.name}}:</p>
            <el-select
              v-model="crowdProject.tagNamesObj[demographics.tid]"
              multiple
              placeholder="请选择"
              class="flex1 select content"
              @change="changeSelect(demographics.tid,crowdProject.tagNamesObj[demographics.tid])"
            >
              <el-option
                v-for="item in demographics.childTags"
                :key="item.tid"
                :value="item.tid"
                :label="item.name"
              >
                {{item.name}}
              </el-option>
            </el-select>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import {mapMutations, mapState} from "vuex";

  export default {
    name: "demographicAttr",
    data() {
      return {
        options: [],
        allOptions:[],
        gender:[],
        everyObj:{},
        other:[],
      }
    },
    methods:{
      ...mapMutations(["setTagNamesWithUpdate","removeTagNamesByName","setTagTid"]),

      getChildren(){
        this.$api.peopleInsight.getChildTags(this.$parent.activeTab)
          .then(res => {
            this.allOptions = res.result;
            this.allOptions.forEach((item) => {
              if (item.name === "性别"){
                this.gender = item
              }else{
                this.other.push(item)
              }
              //this.$set(this.obj, item.tid, []);
              this.$set(this.crowdProject.tagNamesObj, item.tid, []);
              item.childTags.pname = item.name;
              this.$set(this.everyObj, item.tid, item.childTags);
            })
          })
          .catch(res => {
            this.allOptions = null
          })
      },
      changeSelect(tid,items){
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

      },
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
      //margin-bottom: 20px;
    }
  }
  .flex1 {
    & /deep/ .el-checkbox  {
      color: $color-text;
      margin-bottom: 20px;
    }
  }
  .mid-start {
    margin-bottom: 20px;
  }
</style>
