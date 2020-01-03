<template>
  <!-- 投放管理 列表搜索条件 -->
  <el-form :inline="true" class="list-form-inline clearfix">

    <!-- 投放计划名称 -->
    <el-form-item class="line-space" label="投放计划名称">
      <el-select 
        @focus="getPlanNameList"
        @change="changePlan"
        value-key="id"
        :loading="planNameList.loading" 
        v-model="searchParam.plan.data" 
        placeholder="不限" 
        filterable
        clearable>
        <el-option
          v-for="item in planNameList.data"
          :key="item.id"
          :label="item.name"
          :value="item"
        ></el-option>
      </el-select>
    </el-form-item>


    <!-- 投放方案名称 -->
    <el-form-item v-show="searchType !== 'plan'" class="line-space" label="投放方案名称">
      <el-select 
        @focus="getProjectNameList"
        @change="changeProject"
        :loading="projectNameList.loading"
        value-key="id" 
        v-model="searchParam.project.data" 
        placeholder="不限" 
        filterable
        clearable>
        <el-option
          v-for="item in projectNameList.data"
          :key="item.id"
          :label="item.name"
          :value="item"
        ></el-option>
      </el-select>
    </el-form-item>


    <!-- 方案状态 -->
    <el-form-item v-show="searchType === 'project'" class="line-space" label="方案状态">
      <el-select 
        @focus="getPlanNameList"
        :loading="planNameList.loading" 
        value-key="value"
        v-model="searchParam.project.status" 
        placeholder="不限" 
        filterable
        clearable>
        <el-option
          v-for="item in projectStatus"
          :key="item.value"
          :label="item.name"
          :value="item"
        ></el-option>
      </el-select>
    </el-form-item>


    <!-- 广告创意名称 -->
    <el-form-item v-show="searchType === 'creative'" class="line-space" label="广告创意名称">
      <el-select 
        @focus="getCreativeNameList"
        :loading="creativeNameList.loading" 
        value-key="id"
        v-model="searchParam.creative.data" 
        placeholder="不限" 
        filterable
        clearable>
        <el-option
          v-for="item in creativeNameList.data"
          :key="item.name"
          :label="item.name"
          :value="item"
        ></el-option>
      </el-select>
    </el-form-item>


    <!-- 创意状态 -->
    <el-form-item v-show="searchType === 'creative'" class="line-space" label="创意状态">
      <el-select 
        v-model="searchParam.creative.status" 
        placeholder="不限"
        value-key="value"
        filterable
        clearable>
        <el-option
          v-for="item in creativeStatus"
          :key="item.value"
          :label="item.name"
          :value="item"
        ></el-option>
      </el-select>
    </el-form-item>


    <!-- 查询 -->
    <el-form-item class="list-query-button">
      <el-button type="primary" plain @click="search">查询</el-button>
    </el-form-item>


    <!-- 新建 -->
    <el-form-item class="list-new-button">

      <router-link v-show="searchType === 'plan'" to="/putManage/create/plan">
        <el-button type="primary">新建投放计划</el-button>
      </router-link>

      <router-link v-show="searchType === 'project'" to="/putManage/create/plan">
        <el-button type="primary">新建投放方案</el-button>
      </router-link>

      <router-link v-show="searchType === 'creative'" to="/putManage/create/creative?createType=single">
        <el-button type="primary">新建广告创意</el-button>
      </router-link>

    </el-form-item>


  </el-form>
</template>

<script>
import { creativeStatus, projectStatus } from '@/utils/static'

export default {
  props: {
    searchType: {
      type: String,
      default: 'plan' // plan project creative
    }
  },

  data() {
    return {
      creativeStatus,
      projectStatus,


      searchParam: {
        plan: { data: '', status: '' },

        project: { data: '', status: '' },

        creative: { data: '', status: '' }
      },




      planNameList: {
        loading: true,
        data: []
      },


      projectNameList: {
        loading: true,
        data: []
      },


      creativeNameList: {
        loading: true,
        data: []
      },
    }
  },

  methods: {


    // 下拉框数据 计划名字列表
    getPlanNameList() {
      if (this.planNameList.data.length > 0) return false;
      this.planNameList.loading = true;
      this.$api.PutPlan.PlanNameList()
        .then(res => {
          this.planNameList = {
            loading: false,
            data: res.result,
          }
        })
        .catch(res => {
          this.planNameList = {
            loading: false,
            data: []
          }
        })
    },


    // 下拉框数据 方案名字列表
    getProjectNameList() {
      this.projectNameList.loading = true;
      if (this.searchParam.plan.data.id) {
        return this.$api.PutProject.ProjectNameListByCamId(+this.searchParam.plan.data.id)
          .then(res => {
            this.projectNameList = {
              loading: false,
              data: res.result,
            }
          })
          .catch(res => {
            this.projectNameList = {
              loading: false,
              data: [],
            }
          })
      }
      this.$api.PutProject.ProjectNameList()
        .then(res => {
          this.projectNameList = {
            loading: false,
            data: res.result,
          }
        })
        .catch(res => {
          this.projectNameList = {
            loading: false,
            data: []
          }
        })
    },


    // 下拉框数据 创意名字列表
    getCreativeNameList() {
      this.creativeNameList.loading = true;

      // TODO 联动方案
      if (this.searchParam.project.data.id) {
        let param = {
          projectId : this.searchParam.project.data.id
        }
      }

      this.$api.CreateCreative.CreativeNameList()
        .then(res => {
          this.creativeNameList = {
            loading: false,
            data: res.result
          };
        })
        .catch(res => {
          this.creativeNameList = {
            loading: false,
            data: []
          };
        })
    },


    // 重置翻页为1
    resetPageIndex() {
      this.searchParam.pageIndex = 1;
    },
    

    // change计划
    changePlan() {
      this.searchParam.project = { data: '', status: '' };
      this.projectNameList.data = [];
    },
    

    // change方案
    changeProject() {
      this.searchParam.creative = { data: '', status: '' };
      this.creativeNameList.data = [];
    },


    // 搜索 抛出数据
    search() {
      this.$emit('searchByCondition', this.searchParam)
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '../list/modules/listCommonStyle.scss';
</style>