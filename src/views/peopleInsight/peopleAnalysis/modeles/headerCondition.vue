<template>
  <el-card class="box-card">
    <div class="report-divider">
      <span class="report-form-title">人群分析</span>
    </div>

    <div class="condition-box">
      <div class="left-title color-text-1">人群包名称</div>
      <div class="right-content">
        {{peopleName}}
      </div>
    </div>

    <div class="condition-box">
      <div class="left-title color-text-1">人群包条件</div>
      <div class="right-content btn-list">
        <template v-for="(item,index) in headerTags" >
          <tag-list :key="index" :tagName="item.name" :tagValues="getTagArr(item.tags)"></tag-list>
        </template>


      </div>
    </div>

  </el-card>
</template>
<script>
  import TagList from './tagList'
  export default {
    props: {
      peopleName: String,
      headerTags: {
        type: Array,
        default() {
          return []
        }
      }
    },
    components: {
      TagList
    },
    methods: {
      getTagArr(list) {
        return list.map( item => item.name)
      }
    }
  }
</script>
<style lang="scss" scoped>
.box-card{
  .report-divider {
    .report-form-title {
      font-size: 16px;
      font-weight: bold;
      color: $color-text;
    }
  }
  .condition-box{
    margin-top: 30px;
    display: flex;
    .left-title{
      width: 100px;
    }
    .right-content{
      .condition-item-box{
        float: left;
        margin-right: 30px;
        margin-top: 20px;
      }
      &.btn-list{
        margin-top: -30px;
      }
    }
  }
}
</style>
