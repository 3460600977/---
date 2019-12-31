<template>
  <div class="container">
    <div class="mid-start">
      <p class="label">城市：</p>
      <el-cascader
        ref="location"
        v-model="cities"
        multiple placeholder="请选择"
        class="flex1 select content"
        :options="options"
        :props="props"
        clearable
        @change="setLocation(cities)"
      >
      </el-cascader>
    </div>
  </div>
</template>

<script>
  import {mapMutations} from "vuex";

  export default {
    name: "locationAttr",
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
        cities:[],
      }
    },
    methods: {
      ...mapMutations(["setTagNamesWithUpdate","removeTagNamesByName"]),

      getChildren(){
        this.$api.peopleInsight.getChildTags(105)
          .then(res => {
            this.options = res.result;
          })
          .catch(res => {
            this.options = null
          })
      },

      setLocation(locationConsume){
        let tagNames = [];
        let tagTid = "";
        let tagValues = [];
        tagTid += "(";
        let tagObj = {'name':'城市'};
        if (locationConsume.length > 0){
          locationConsume.forEach((item,index)=>{
            tagTid += item[item.length-1];
            if (index < locationConsume.length-1){
              tagTid += "|";
            }
            tagValues.push(this.$refs['location'].getCheckedNodes()[index].pathLabels.join("/"))
          });
          tagTid += ")";
          tagObj.value = tagValues;
          tagNames.push(tagObj);
          //set方式不一样  这里是tag组只能有一个
          this.setTagNamesWithUpdate(tagNames);
        }else {
          //移除当前tag组
          this.removeTagNamesByName({'name':'城市'});
        }

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
</style>
