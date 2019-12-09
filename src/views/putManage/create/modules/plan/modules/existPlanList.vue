<template>
  <div class="exist-creative-list clearfix">
    <div class="box-top">
      <div class="search-box mid">
        <el-input class="search-text" v-model="search" placeholder="输入投放计划名称"></el-input>
        <el-button type="primary" plain>查询</el-button>
      </div>

      <div class="list-box">
        <div class="title">列表</div>
        <ul>
          <li class="item" v-for="(item, index) in list" :key="index">{{item.name}}</li>
          <li class="item page-box clearfix" v-loading="!list">
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

    
    <!-- 保存 取消 -->
    <PutMangeCard class="save-box clearfix">
      <div class="float-right">
        <el-button @click="nextStep" style="width: 136px" type="primary">下一步</el-button>
      </div>
    </PutMangeCard>
  </div>
</template>

<script>
import PutMangeCard from '../../../../templates/PutMangeCard' 

export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  components: {
    PutMangeCard
  },
  name: 'existCreativeList',
  data() {
    return {
      search: '',
      list: ''
    }
  },

  methods: {
    getExistPlanList() {
      this.$api.PutPlan.PlanList()
        .then(res => {
          console.log(res)
        })
    },

    nextStep() {}
  },

  watch: {
    isShow: function(newVal, oldVal) {
      if (newVal && !this.list) {
        this.$api.PutPlan.PlanList()
          .then(res => {
            this.list = res.result;
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.exist-creative-list{
  .box-top{
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
        cursor: pointer;
        &.page-box{
          padding: 20px 40px;
        }
      }
    }
  }
  .save-box{
    margin-top: 40px !important;
  }
}
  
</style>