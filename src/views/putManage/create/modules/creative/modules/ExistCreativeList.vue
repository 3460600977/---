<template>
  <div class="exist-creative-list">
    <div class="search-box mid">
      <el-input class="search-text" v-model="searchVal" placeholder="输入投广告创意名称"></el-input>
      <el-button @click="search(searchVal)" type="primary" plain>查询</el-button>
    </div>

    <div class="list-box">
      <div class="title">列表</div>
      <ul v-loading="list.loading">
        <li class="item" 
        v-for="(item, index) in list.data" 
        @click="listActiveId = item.id"
        :class="{'active': listActiveId == item.id}" 
        :key="index">{{item.name}}</li>
        <!-- 分页 -->
        <li v-if="list.data.length !== 0" class="item page-box clearfix">
          <el-pagination
            class="float-right"
            background
            layout="total, sizes, prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="list.page.currentPage"
            :total="list.page.totalCount">
          </el-pagination>
        </li>
        <noData v-if="list.data.length === 0"/>
      </ul>
    </div>

    
    <!-- 保存 取消 -->
    <PutMangeCard class="save-box creative-list-save">
      <div class="float-right">
        <el-button :disabled="listActiveId < 0" :loading="saving" style="width: 136px" @click="saveCreative" type="primary">确认</el-button>
      </div>
    </PutMangeCard>
  </div>
</template>

<script>
import PutMangeCard from '../../../../templates/PutMangeCard' 
import { mapState } from 'vuex'
export default {
  components: {
    PutMangeCard
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  name: 'existCreativeList',
  data() {
    return {
      searchVal: '',
      saving: false,
      listActiveId: -1,
      list: {
        loading: false,
        data: [],
        page: ''
      },
    }
  },

  methods: {
    // 获取创意列表
    getExistPlanList(durationType, industry, name, pageIndex, pageSize, screenType) {
      this.list.loading = true;
      this.$api.CreateCreative.ExistCreative({durationType, industry, name, pageIndex, pageSize, screenType})
        .then(res => {
          this.list = {
            loading: false,
            data: res.result,
            page: res.page
          }
        })
        .catch(res => {
          this.list = {
            loading: false,
            data: [],
            page: ''
          }
        })
    },

    // 翻页
    handleCurrentChange(pageIndex) {
      this.listActiveId = -1;
      this.getExistPlanList(this.projectData.second, this.projectData.industry, '', pageIndex, 10, this.projectData.type)
    },

    // 分页大小
    handleSizeChange(pageSize) {
      this.getExistPlanList(this.projectData.second, this.projectData.industry, '', 0, pageSize, this.projectData.type)
    },

    // 手动搜索
    search(searchVal) {
      this.getExistPlanList(this.projectData.second, this.projectData.industry, searchVal, 0, 10, this.projectData.type)
    },
     
    // 保存
    saveCreative() {
      let param = {
        "creativeId": this.listActiveId,
	      "projectId": this.projectData.projectId
      }
      this.saving = true;
      this.$api.CreateCreative.BindCreativeProject(param)
        .then(res => {
          this.saving = false;
          this.$router.push({
            path: '/putManage',
            query: {
              'active': 'project'
            }
          })
          return this.$notify({
            title: '成功',
            message: '关联创意成功',
            type: 'success'
          })
        })
        .catch(res => {
          this.saving = false;
        })
    }
  },

  computed: {
    ...mapState({
      projectData: state => state.putCreative.projectData
    })
  },

  watch: {
    isShow: function(newVal, oldVal) {
      if (newVal) {
        this.getExistPlanList(this.projectData.second, this.projectData.industry, '', 0, 10, this.projectData.type)
      }
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
      cursor: pointer;
      border-top:1px solid rgba(229,231,233,1);
      &.page-box{
        padding: 20px 40px;
      }
      &.active{
        background-color: $color-bg;
      }
    }
  }
  .creative-list-save{
    border-top: 60px solid $color-bg;
    margin: 60px -38px 0;
  }
}
</style>