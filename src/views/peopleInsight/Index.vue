<template>
  <div class="creative-list">
    <div class="report-top-form">
      <p class="db-title">人群包管理</p>
      <query-item :queryItems="queryItems" :queryFilters="checkFormInline" @handleReturnData="handleReturnData">
        <template #btn>
          <el-button type="primary" class="actions" @click="toCreateCrowd">新建人群包</el-button>
        </template>
      </query-item>
    </div>
    <div class="query_result" v-if="resultData !== null">
      <el-table :data="resultData" class="list_table">
        <el-table-column prop="name" min-width="120px" label="人群包名称"></el-table-column>
        <el-table-column prop="description" label="人群包描述">
        </el-table-column>
        <el-table-column prop="city" label="城市">
          <template slot-scope="scope">
            <div v-if="isNaN(scope.row.city)">
              {{scope.row.city}}
            </div>
            <div v-else>
              <template v-for="item in cityList">
                <template v-if="item.cityCode === scope.row.city">{{item.name}}</template>
              </template>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="weekForPeople" label="覆盖人数">
          <template slot-scope="scope">
            <div v-if="scope.row.status === 0">
              <span style="color: red">生成中...</span>
            </div>
            <div v-else>
              <span>{{$tools.toThousands(scope.row.weekForPeople,false)}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createName" label="创建人"></el-table-column>
        <el-table-column min-width="120px" prop="createTime" label="创建时间">
          <template slot-scope="scope">
            <span>{{formate(scope.row.createTime, 'yyyy-MM-dd hh:mm:ss')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="action" label="操作" fixed="right" width="300">
          <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                placement="top"
                :disabled="scope.row.status === 1"
                :content="scope.row.remark"
              >
                 <span class="icon-space hand"
                       :class="scope.row.status === 1?'':'color-disabled'"
                       @click="crowdAnalysis(scope.row.status,scope.row.id)">
                    <i class="iconfont icon-shuxingliebiaoxiangqing2" :class="scope.row.status === 1 ? 'icon-color' : 'color-disabled'"></i>人群分析
                  </span>
              </el-tooltip>


            <span class="icon-space hand"
                  @click="showDialog(scope.row)">
                <i class="iconfont icon-error icon-color"></i>删除
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        :page-sizes="pageSizeSelectable"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        class="my-list-page"
      ></el-pagination>
    </div>
    <el-dialog title="删除资源包"
               :visible.sync="dialogShowContent"
               width="568px"
               class="my-dialog dialog-mid"
    >
      <p>是否确认删除人群包 <span class="color-main">【{{currentItem && currentItem.name}}】？</span></p>
      <span slot="footer">
        <el-button @click="dialogShowContent = false" class="btn1">取 消</el-button>
        <el-button type="primary" class="btn1" @click="deleteItem">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {tableMixin} from '@/mixins/tableMixin'
  import QueryItem from '@/components/QueryItem'
  import {mapMutations} from "vuex";
  export default {
    name: "auditList",
    mixins: [tableMixin],
    components: {
      QueryItem
    },
    data() {
      return {
        formate: this.$tools.formatDate,
        currentPage: 50,
        currentItem: null,
        dialogShowContent: false,
        queryItems: [
          {
            type: 'input',
            key: 'name',
            label: '人群包名称'
          },
          {
            type: 'actions',
            actions: [
              {label: '查询', key: 'search', type: 'primary', plain: true},
              {type: 'slot', name: 'btn'}
            ]
          }
        ],
        checkFormInline: {
          name: '',
        },
        cityList: [],
      }
    },
    beforeMount() {
      this.getAllCity()
    },
    methods: {
      ...mapMutations(["removeAllState"]),
      // 城市列表
      getAllCity() {
        this.$api.CityList.AllList()
          .then(res => {
            this.cityList = res.result;
          })
          .catch(res => {})
      },
      toCreateCrowd() {
        //进入创建页面先清空下已选数据
        this.removeAllState();
        this.$router.push('/peopleInsight/createCrowd')
      },
      handleReturnData(val) {
        this.checkFormInline = val
        this.resetLoad()
      },
      loadFunction(param) {
        const data = { ...this.checkFormInline, ...param };
        delete data.sortList;
        return new Promise((resolve, reject) => {
          this.$api.peopleInsight.getCrowdList(data).then(res => {
            resolve(res);
          }).catch((res) => {
            reject(res)
          })
        });
      },
      showDialog(item) {
        this.currentItem = item
        this.dialogShowContent = true
      },
      deleteItem() {
        this.$api.peopleInsight.deleteCrowdById({id: this.currentItem.id}).then((data) => {
          if (data.result) {
            this._loadData(this.filterData)
            this.dialogShowContent = false
          }
        })
      },
      crowdAnalysis(status,id) {
        if (status !== 1) return;
        this.$router.push({path:"/peopleInsight/analysis", query: {id: id}})
      },
    }
  }
</script>

<style lang="scss" scoped>
  .my-dialog /deep/ {
    .el-dialog__body {
      padding-top: 57px;
      padding-bottom: 105px;
    }
    .el-button + .el-button {
      margin-left: 60px;
    }
  }
  .btn1 {
    width: 100px;
  }
  .creative-list {
    padding: 20px;
    & /deep/ .actions {
      margin-left: 10px;
      .el-button + .el-button {
        margin-left: 20px;
      }
    }
    .report-top-form {
      /*height: 160px;*/
      border-radius: 4px;
      background-color: $color-bg-3;
      padding: 30px 0 37px 38px;

      .report-divider {
        .el-divider {
          background-color: $color-blue;
          border-radius: 2px;
          width: 3px;
          height: 16px;
          margin: 0 5px 0 0;
        }

        .report-form-title {
          font-size: 16px;
          font-weight: bold;
          color: $color-text;
        }
      }

      .report-query-form {

        .el-range-separator {
          width: 10%;
        }

        .el-select .el-input .el-select__caret {
          color: $color-blue;
        }
      }
    }

    .list_table span i.color-disabled {
      margin-right: 8px;
    }

  }
</style>

