<template>
  <div class="creative-list">
    <div class="report-top-form">
      <div class="report-divider">
        <el-divider direction="vertical"></el-divider>
        <span class="report-form-title">资源包管理</span>
      </div>
      <el-form :inline="true" :model="checkFormInline" class="report-query-form" label-width="82px">
        <el-form-item class="item-space-1" label="资源包管理">
          <el-input v-model="checkFormInline.name" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="resetLoad">查询</el-button>
        </el-form-item>
      </el-form>
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
               class="dialog-1"
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
  export default {
    name: "auditList",
    mixins: [tableMixin],
    data() {
      return {
        currentPage: 50,
        currentItem: null,
        dialogShowContent: false,
        checkFormInline: {
          name: '',
        }
      }
    },
    methods: {
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
  .dialog-1 /deep/ {
    .el-dialog__body {
        padding: 57px 30px 105px;
    }
    .el-dialog__footer {
      text-align: center;
      padding-bottom: 40px;
    }
    .el-button + .el-button {
      margin-left: 60px;
    }
    .el-dialog__header {
      border-bottom: 1px solid $color-border;
      padding: 24px 0 21px 30px;
      .el-dialog__title {
        font-size: 16px;
        color: $color-text;
      }
    }
  }
  .btn1 {
    width: 100px;
  }
  .creative-list {
    .report-top-form {
      height: 160px;
      border-radius: 4px;
      background-color: $color-bg-3;
      padding: 30px 0 37px 38px;

      .report-divider {
        .el-divider {
          background-color: $color-blue;
          border-radius: 2px;
          width: 3px;
          margin: 0 5px 0 0;
        }

        .report-form-title {
          font-size: 16px;
          font-weight: bold;
          color: $color-text;
        }
      }

      .report-query-form {
        margin-top: 41px;
        & /deep/ .el-form-item__label {
          color: $color-text;
        }

        .el-input {
          width: 200px;
        }

        .el-range-separator {
          width: 10%;
        }

        .item-space-1 {
          margin: 0 50px 0 0;
        }

        .el-select .el-input .el-select__caret {
          color: $color-blue;
        }
      }
    }

  }
</style>
