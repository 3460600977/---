<template>
  <div class="creative-list">
    <div class="report-top-form">
      <p class="db-title">资源包管理</p>
      <query-item :queryItems="queryItems" :queryFilters="checkFormInline" @handleReturnData="handleReturnData">
        <template #btn>
          <el-button type="primary">主要按钮</el-button>
        </template>
      </query-item>
<!--      <el-form :inline="true" :model="checkFormInline" class="report-query-form" label-width="82px">-->
<!--        <el-form-item class="item-space-1" label="资源包管理">-->
<!--          <el-input v-model="checkFormInline.name" clearable></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item>-->
<!--          <el-button type="primary" plain @click="resetLoad">查询</el-button>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
    </div>
    <div class="query_result" v-if="resultData !== null">
      <el-table :data="resultData" class="list_table">
        <el-table-column prop="name" label="资源包名称"></el-table-column>
        <el-table-column prop="description" label="资源包描述">
        </el-table-column>
        <el-table-column prop="city" label="城市"></el-table-column>
        <el-table-column prop="industry" label="行业标签"></el-table-column>
        <el-table-column prop="action" label="操作" fixed="right" width="400">
          <template slot-scope="scope">
            <span class="icon-space">
              <i class="el-icon-edit icon-color"></i>编辑
            </span>
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
        class="list-page"
      ></el-pagination>
    </div>
    <el-dialog title="删除城市洞察包"
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
        currentPage: 50,
        currentItem: null,
        dialogShowContent: false,
        queryItems: [
          {
            type: 'input',
            key: 'name',
            label: '资源包管理'
          },
          {
            type: 'actions',
            actions: [
              {label: '查询', key: 'search', type: 'primary', plain: true}
            ]
          }
        ],
        checkFormInline: {
          name: '',
        }
      }
    },
    methods: {
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

<style lang="scss">
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
