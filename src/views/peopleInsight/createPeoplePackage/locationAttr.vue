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
        cities:[],
      }
    },
    methods: {
      ...mapMutations(["setTagNamesWithUpdate","removeTagNamesByName","setTagTid","setCity","removeCity"]),

      getChildren(){
        this.$api.peopleInsight.getChildTags(this.$parent.activeTab)
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
        let tagObj = {'name':'城市'};
        if (locationConsume.length > 0){
          tagTid += "("+ locationConsume[0] + ")";
          let labels = this.$refs['location'].getCheckedNodes()[0].pathLabels;
          let cityName = labels[labels.length-1];
          tagValues.push(labels.join("/"));
          tagObj.value = tagValues;
          tagNames.push(tagObj);
          //set city
          this.setCity(cityName);
          //set方式不一样  这里是tag组只能有一个
          this.setTagNamesWithUpdate(tagNames);
          //TODO 先用push  后期优化
          this.setTagTid(tagTid);
        }else {
          //移除当前tag组
          this.removeCity();
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
