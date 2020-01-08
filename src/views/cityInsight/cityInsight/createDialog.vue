<template>
    <div>
      <el-dialog
        title="创建资源包"
        class="my-dialog"
        :visible.sync="dialogVisible"
        width="1000px"
        :before-close="handleClose">
        <p class="bold title">城市：{{city.name}}</p>
        <el-table :data="resultData" class="table">
          <el-table-column property="premisesName" label="楼盘名称"></el-table-column>
          <el-table-column property="signElevatorNum" label="点位数"></el-table-column>
          <el-table-column property="totalPeople" label="覆盖人数"></el-table-column>
        </el-table>
        <div class="clearfix">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next"
            :total="totalCount"
            :page-size="pageSize"
            :page-sizes="pageSizeSelectable"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            class="list-page float-right"
          ></el-pagination>
        </div>
        <p class="title bold">汇总数</p>
        <ul class="ul mid-between">
          <li>已选楼盘数：<span class="font-number font-16 color-main">{{data.length | toThousands}}</span></li>
          <li>已选点位数：<span class="font-number font-16 color-main">{{deviceCount | toThousands}}</span></li>
          <li>覆盖人数：<span class="font-number font-16 color-main">{{coveredPeople | toThousands}}</span></li>
        </ul>
        <p class="title bold" style="margin-bottom: 10px">资源包名称</p>
        <create-form
          @hide="hide"
          @submit="submit"
        ></create-form>
        <el-dialog title="创建成功"
             append-to-body
             :visible.sync="dialogShowContent"
             width="568px"
             class="my-dialog inner-dialog"
        >
          <p>已成功创建资源包！可前往<span class="color-main">投放管理</span>创建广告计划。</p>
          <span slot="footer">
        <el-button @click="toUrl(0)" class="btn1">资源包列表</el-button>
        <el-button type="primary" class="btn1" @click="toUrl(1)">创建广告计划</el-button>
      </span>
        </el-dialog>
      </el-dialog>
    </div>
</template>

<script>
  import {tableMixin} from "../../../mixins/tableMixin";
  import createForm from "./createForm";

  export default {
    name: "createDialog",
    mixins: [tableMixin],
    components: {
      createForm
    },
    props: {
      data: {
        type: Array,
        required: true
      },
      city: {
        type: Object,
        required: true
      },
    },
    data() {
      return {
        dialogShowContent: false,
        dialogVisible: false,
        pageSize: 5,
        pageSizeSelectable: [5, 10, 15, 20],
        deviceCount: 0,
        unitNum: 0,
        coveredPeople: 0,
      };
    },
    created() {},
    methods: {
      toUrl(type) {
        if (type === 0) {
          this.$router.push('/cityInsight/list')
        } else {
          this.$router.push('/putManage/create/plan')
        }
      },
      getBuildingIds(arr) {
        return arr.map((item) => {
          return item.premisesId
        })
      },
      submit(val) {
        let ids = this.getBuildingIds(this.data).join(',')
        let param = {
          city: this.city.cityCode,
          premiseIds: ids,
          condition: '',
          deviceNum: this.deviceCount,
          premiseNum: this.data.length,
          unitNum: this.unitNum,
          weekForPeople: this.coveredPeople,
          ...val
        }
        this.$api.cityInsight.createCityInsight(param).then((data) => {
          if (data.result) {
            this.dialogShowContent = true
          }
          // if (data.result) {
          //   this.$router.push('/cityInsight/list')
          // }
        })
      },
      show() {
        this.dialogVisible = true
        this.resetLoad()
        this.renderDatas(this.data)
      },
      hide() {
        this.dialogVisible = false
      },
      renderDatas(arr) {
        this.deviceCount = 0
        this.unitNum = 0
        this.coveredPeople = 0
        arr.forEach((item) => {
          this.deviceCount += item.signElevatorNum
          this.coveredPeople += item.totalPeople
          this.unitNum += item.unitNum? item.unitNum: 0
        })
      },
      loadFunction() {
        return new Promise((resolve) => {
          let result = this.data.slice((this.pageIndex - 1)* this.pageSize, this.pageIndex* this.pageSize)
          resolve({
            result: result,
            page: {
              currentPage: this.pageIndex,
              totalCount: this.data.length
            }
          })
        });
      },
      handleClose() {
        this.dialogVisible = false
      }
    }
  }
</script>

<style scoped lang='scss'>
.my-dialog {
  & /deep/ .el-dialog {
    margin-top: 76px !important;
  }
  & /deep/ .el-dialog__body {
    color: $color-text;
    padding-top: 0;
    padding-bottom: 0;
  }
  & /deep/ .el-table thead {
    color: $color-text !important;
    & /deep/ th {
      background:rgba(248,248,248,1);
    }
  }
  & /deep/ .el-button + .el-button {
    margin-left: 50px;
  }
  & /deep/ .el-table th {
    padding: 8px 0;
  }
  & /deep/ .el-table td {
    padding: 8px 0;
  }
  & /deep/ .el-dialog__footer {
    padding-bottom: 30px;
  }
  .ul {
    padding: 0 30px;
    line-height: 50px;
    background: $color-main-lighten;
  }
  .table {
    border: 1px solid $color-border;
    margin-bottom: 20px;
    color: $color-text;
  }
  .title {
    margin-bottom: 20px;
    margin-top: 20px;
  }
}
.inner-dialog {
  & /deep/ .el-dialog__body {
    padding-top: 57px;
    padding-bottom: 105px;
  }
  .el-button + .el-button {
    margin-left: 60px;
  }
}
</style>
