<template>
  <div class="container">
    <template v-if="allOptions">
      <template v-if="gender">
        <div class="mid-start">
          <!--{{gender.childTags}}-->
          <p class="label">{{gender.name}}:</p>
          <el-checkbox-group
            v-model="obj[gender.tid]"
            @change="changeSelect(gender.tid,obj[gender.tid])"
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
              v-model="obj[demographics.tid]"
              multiple
              placeholder="请选择"
              class="flex1 select content"
              @change="changeSelect(demographics.tid,obj[demographics.tid])"
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
        obj: {},
        options: [],
        allOptions:[],
        gender:[],
        everyObj:{},
        other:[],
      }
    },

    methods:{
      ...mapMutations(["setTagNames","setTagTid"]),

      getChildren(){
        this.$api.peopleInsight.getChildTags(133)
          .then(res => {
            this.allOptions = res.result;
            this.allOptions.forEach((item) => {
              if (item.name === "性别"){
                this.gender = item
              }else{
                this.other.push(item)
              }
              this.$set(this.obj, item.tid, []);
              item.childTags.pname = item.name;
              this.$set(this.everyObj, item.tid, item.childTags);
            })
          })
          .catch(res => {
            this.options = null
          })
      },
      changeSelect(tid,items){
        console.log(tid);
        console.log(items);
        console.log(this.everyObj);
        let tagNames = [];
        let tagTid = "";
        let tagValues = [];
        tagTid += "(";
        let tagObj = {'name':this.everyObj[tid].pname};
        if (items.length > 0){
          this.everyObj[tid].forEach((childTag)=>{
            items.forEach((item,index)=>{
              //拼接tagTid  格式(|)
              if (childTag.tid === item){
                tagTid += item;
                if (index < item.length-1){
                  tagTid += "|";
                }
                tagValues.push()
              }

            })
          })

        }else {
          //移除当前tag组
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
