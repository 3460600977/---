<template>
  <div class="exist-creative-list">
    <div class="search-box mid">
      <el-input class="search-text" v-model="search" placeholder="输入投放计划名称"></el-input>
      <el-button type="primary" plain>查询</el-button>
    </div>

    <div class="list-box">
      <div class="title">列表</div>
      <ul>
        <li class="item" v-for="i in 10" :key="i">投放计划</li>
        <li class="item page-box clearfix">
          <el-pagination
            class="float-right"
            background
            layout="total, sizes, prev, pager, next"
            :total="20">
          </el-pagination>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'existCreativeList',
  data() {
    return {
      search: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.exist-creative-list{
  padding: 30px 38px;
  background-color: #fff;
  .search-box{
    .search-text{
      width: 240px;
      margin-right: 20px;
    }
  }
  .list-box{
    margin-top: 40px;
    width:538px;
    border:1px solid rgba(229,231,233,1);
    border-radius:2px;
    .title{
      font-size:14px;
      font-weight:400;
      padding: 18px 10px;
      background:$color-bg;
    }
    .item{
      padding: 15px 40px 15px 10px;
      color: $color-text-1;
      border-top:1px solid rgba(229,231,233,1);
      &.page-box{
        padding: 20px 40px;
      }
    }
  }
}
  
</style>