<template>
  <div class="exist-creative-list clearfix">
    <div class="box-top">
      <div class="search-box mid">
        <el-input class="search-text" clearable v-model.trim="param.name" placeholder="输入投放计划名称"></el-input>
        <el-button @click="handleSearch" type="primary" plain>查询</el-button>
      </div>

      <div class="list-box">
        <div class="title">列表</div>
        <ul v-loading="list.loading">
          <li 
            class="item"
            :class="{'active': list.choosedIndex === index}"
            @click="list.choosedItem = item; list.choosedIndex = index; nextStep()" 
            v-for="(item, index) in list.data" :key="index"
          >{{item.name}}</li>

          <li class="item page-box clearfix">
            <el-pagination
              class="float-right"
              background
              small="true"
              layout="total, sizes, prev, pager, next"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :total="list.page.totalCount">
            </el-pagination>
          </li>
        </ul>
      </div>
    </div>

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
      list: {
        loading: false,
        choosedItem: '',
        choosedIndex: '',
        data: '',
        page: ''
      },
      param: {
        name: '', 
        pageIndex: '', 
        pageSize: 10, 
        record: 0,
        startIndex: 0, 
        startindex: 0, 
        totalPageCount: 0
      }
    }
  },

  methods: {
    handleSearch() {
      this.param.pageIndex = 1;
      this.getExistPlanList()
    },

    getExistPlanList() {
      this.list.loading = true;
      this.$api.PutPlan.PlanList(this.param)
        .then(res => {
          this.list.loading = false;
          this.list.data = res.result;
          this.list.page = res.page;
        })
        .catch(res => {
          this.list.loading = false;
          this.list.data = '';
        })
    },

    handleSizeChange(size) {
      this.param.pageSize = size;
      this.getExistPlanList()
    },

    handleCurrentChange(cur) {
      this.param.pageIndex = cur;
      this.getExistPlanList()
    },

    nextStep() {
      setTimeout(() => {
        this.$router.replace({
          path: '/putManage/create/project',
          query: {
            planId: this.list.choosedItem.id,
          }
        })
      }, 100);
    }
  },

  watch: {
    isShow: function(newVal, oldVal) {
      if (newVal) {
        this.getExistPlanList()
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
        &.active{
          background-color: $color-bg;
          color: $color-text;
        }
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