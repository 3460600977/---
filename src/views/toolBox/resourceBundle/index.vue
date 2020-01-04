<template>
  <div class="creative-list">
    <div class="report-top-form">
      <p class="db-title">资源包管理</p>
      <query-item :queryItems="queryItems" :queryFilters="checkFormInline" @handleReturnData="handleReturnData">
        <template #btn>
          <el-button type="primary" class="actions" @click="toCityInSight">新建资源包</el-button>
        </template>
      </query-item>
    </div>
    <div class="query_result" v-if="resultData !== null">
      <el-table :data="resultData" class="list_table">
        <el-table-column prop="name" label="资源包名称"></el-table-column>
        <el-table-column prop="description" label="资源包描述">
        </el-table-column>
        <el-table-column prop="city" label="城市"></el-table-column>

        <el-table-column prop="premiseNum" label="楼盘数">
          <template slot-scope="scope">
            <span>{{scope.row.premiseNum}}个</span>
          </template>
        </el-table-column>
        <el-table-column prop="unitNum" label="单元数">
          <template slot-scope="scope">
            <span>{{scope.row.unitNum}}个</span>
          </template>
        </el-table-column>
        <el-table-column prop="deviceNum" label="点位数">
          <template slot-scope="scope">
            <span>{{scope.row.deviceNum}}个</span>
          </template>
        </el-table-column>
        <el-table-column prop="weekForPeople" label="覆盖人数">
          <template slot-scope="scope">
            <span>{{scope.row.weekForPeople}}人</span>
          </template>
        </el-table-column>

        <el-table-column prop="createName" label="创建人"></el-table-column>
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">
            <span>{{formate(scope.row.createTime, 'yyyy-MM-dd hh:mm:ss')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="action" label="操作" fixed="right" width="200">
          <template slot-scope="scope">
<!--            <span class="icon-space">-->
<!--              <i class="el-icon-edit icon-color"></i>编辑-->
<!--            </span>-->
            <span class="icon-space" @click="showDialog(scope.row)">
              <i class="el-icon-error icon-color"></i>删除
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
               class="my-dialog"
    >
      <p>是否确认删除资源包 <span class="color-main">【{{currentItem && currentItem.name}}】？</span></p>
      <span slot="footer">
        <el-button @click="dialogShowContent = false" class="btn1">取 消</el-button>
        <el-button type="primary" class="btn1" @click="deleteItem">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {tableMixin} from '../../../mixins/tableMixin'
  import QueryItem from "../../../components/QueryItem";
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
            label: '资源包名称'
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
        }
      }
    },
    methods: {
      toCityInSight() {
        this.$router.push('/cityInsight/selectPoint')
      },
      handleReturnData(val) {
        this.checkFormInline = val
        this.resetLoad()
      },
      loadFunction(param) {
        const data = { ...this.checkFormInline, ...param }
        return new Promise((resolve, reject) => {
          this.$api.toolBox.getResourceBundle(data).then(res => {
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
        this.$api.toolBox.deleteResourceBundle({id: this.currentItem.id}).then((data) => {
          if (data.result) {
            this._loadData(this.filterData)
            this.dialogShowContent = false
          }
        })
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
      margin-left: 50px;
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

  }
</style>
