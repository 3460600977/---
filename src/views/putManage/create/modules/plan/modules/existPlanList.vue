<template>
  <div class="exist-creative-list clearfix">
    <div class="box-top">
      <div class="search-box mid">
        <el-input class="search-text" clearable v-model="search" placeholder="输入投放计划名称"></el-input>
        <el-button @click="searchPlanByName" type="primary" plain>查询</el-button>
      </div>

      <div class="list-box">
        <div class="title">列表</div>
        <ul v-loading="list.loading">
          <li 
            class="item"
            :class="{'active': list.choosedIndex === index}"
            @click="list.choosedItem = item; list.choosedIndex = index; nextStep()" 
            v-for="(item, index) in list.data" :key="index">{{item.name}}</li>
          <li class="item page-box clearfix">
            <el-pagination
              class="float-right"
              background
              layout="total, sizes, prev, pager, next"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :total="list.page.totalCount">
            </el-pagination>
          </li>
        </ul>
      </div>
    </div>

    
    <!-- 保存 取消 -->
    <!-- <PutMangeCard class="save-box clearfix">
      <div class="float-right">
        <el-button @click="nextStep" style="width: 136px" type="primary">下一步</el-button>
      </div>
    </PutMangeCard> -->
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
      list: {
        loading: false,
        choosedItem: '',
        choosedIndex: '',
        data: '',
        page: ''
      },
    }
  },

  methods: {
    getExistPlanList(name, pageIndex, pageSize) {
      let param = {
        name, 
        pageIndex, 
        pageSize, 
        record: 0,
        startIndex: 0, 
        startindex: 0, 
        totalPageCount: 0
      }
      this.list.loading = true;
      this.$api.PutPlan.PlanList(param)
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
      this.getExistPlanList('', '', size)
    },

    handleCurrentChange(cur) {
      this.getExistPlanList('', cur, '')
    },

    searchPlanByName() {
      this.getExistPlanList(this.search, 0, 0)
    },

    nextStep() {
      setTimeout(() => {
        this.$router.replace({
          path: '/putManage/create/project',
          query: {
            planId: this.list.choosedItem.id,
            planName: this.list.choosedItem.name,
            beginTime: this.list.choosedItem.beginTime,
            endTime: this.list.choosedItem.endTime
          }
        })
      }, 300);
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