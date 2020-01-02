<template>
  <div class="list">

    <el-form :inline="true" class="list-form-inline clearfix">

      <el-form-item class="line-space" label="人群包名称">
        <div slot="label">人群包名称</div>
        <el-select
          @focus="getCrowdNameList"
          :loading="crowdNameList.loading"
          v-model="searchParam.name"
          placeholder="不限"
          filterable
          clearable>
          <el-option
            v-for="item in crowdNameList.data"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="list-query-button">
        <el-button type="primary" plain @click="search">查询</el-button>
      </el-form-item>

      <el-form-item class="list-new-button">
        <router-link to="/createPeoplePackage">
          <el-button type="primary">新建人群包</el-button>
        </router-link>
      </el-form-item>
    </el-form>

    <div class="query_result">
      <el-table v-loading="tableData.loading" :data="tableData.data" class="list_table">
        <el-table-column prop="name" label="人群包名称">
          <template slot-scope="scope">
            <span class="hand">{{scope.row.name}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="description" label="人群包描述">
          <template slot-scope="scope">
            <span>{{scope.row.description}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="city" label="城市">
          <template slot-scope="scope">
            {{scope.row.city}}
           <!-- <template v-for="item in cityList">
              <template v-if="item.cityCode === scope.row.city">{{item.name}}</template>
            </template>-->
          </template>
        </el-table-column>

        <el-table-column prop="weekForPeople" label="覆盖人数">
          <template slot-scope="scope">
            <div v-if="scope.row.status === 0">
              <span style="color: red">生成中...</span>
            </div>
            <div v-else>
              <span>{{scope.row.weekForPeople}}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="createName" label="创建人">
          <template slot-scope="scope">
            <span>{{scope.row.createName}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">
            {{$tools.getFormatDate('YY/mm/dd', scope.row.beginTime)}}
          </template>
        </el-table-column>

        <el-table-column prop="action" label="操作" fixed="right" width="400">
          <template slot-scope="scope">
              <span class="icon-space hand"
                    :class="scope.row.status?'':'color-disabled'"
                    @click="crowdAnalysis(scope.row.status)">
              <i class="iconfont icon-shuxingliebiaoxiangqing2" :class="scope.row.status ? 'icon-color' : 'color-disabled'"></i>人群分析
            </span>

            <span class="icon-space hand"
                  @click="delCrowdById(scope.row.id)">
                <i class="iconfont icon-error icon-color"></i>删除
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="tableData.page.currentPage"
        :total="tableData.page.totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="list-page"
      ></el-pagination>
    </div>
  </div>
</template>


<script>
  import { PutGoal } from '../../../../../utils/static'
  export default {
    name: "crowdList",
    data() {
      return {
        PutGoal,
        crowdNameList: {
          loading: true,
          data: []
        },

        cityList: [],

        searchParam: {
          name: '',
          pageIndex: '',
          pageSize: ''
        },

        tableData: {
          loading: true,
          data: [],
          page: {
            currentPage: 0,
            totalCount: 0
          }
        },

        detailDialog: {
          show: false,
          dataIndex: 0,
        },

      };
    },

    beforeMount() {
      this.search()
      this.getAllCity()
    },
    methods: {
      // 下拉框数据
      getCrowdNameList() {
        if (this.crowdNameList.data.length > 0) return;
        this.$api.peopleInsight.getCrowdList(this.searchParam)
          .then(res => {
            this.crowdNameList = {
              loading: false,
              data: res.result,
            }
          })
          .catch(res => {
            this.crowdNameList = {
              loading: false,
              data: []
            }
          })
      },


      // 城市列表
      getAllCity() {
        this.$api.CityList.AllList()
          .then(res => {
            this.cityList = res.result;
          })
          .catch(res => {})
      },

      // 搜索
      search() {
        this.tableData.loading = true;
        this.$api.peopleInsight.getCrowdList(this.searchParam)
          .then(res => {
            this.tableData = {
              loading: false,
              data: res.result,
              page: res.page
            }
          })
          .catch(res => {
            this.tableData = {
              loading: false,
              data: [],
              page: {
                currentPage: 0,
                totalCount: 0
              }
            }
          })
      },


      delCrowdById(crowdId) {
        this.$confirm('此操作将永久删除改数据，是否继续？','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        })
        .then(()=>{
          this.tableData.loading = true;
          this.$api.peopleInsight.deleteCrowdById({id: crowdId})
            .then(res => {
              this.tableData.loading = false;
              this.$notify({
                title: '成功',
                message: '删除创意成功',
                type: 'success'
              });
              this.search()
            })
            .catch(res => {
              this.tableData.loading = false;
            })
        })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          })
      },

      crowdAnalysis(status) {
        if (!status) return;
        this.$router.push("/peopleAnalysis")
      },


      handleSizeChange(val) {
        this.searchParam.pageSize = val;
        this.searchParam.pageIndex = 0;
        this.search()
      },

      handleCurrentChange(val) {
        this.searchParam.pageIndex = val;
        this.search()
      }
    }
  };
</script>

<style lang='scss'>
  @import '../listCommonStyle.scss';
  .color-disabled {
    margin-right: 8px;
  }
</style>
