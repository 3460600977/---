<template>
  <!-- 选点结果列表 -->
  <div class="map-choosed-list">
    <el-radio-group v-model="mapListShowType" style="margin-bottom: 10px;" @change="selectCheckedList">
      <el-radio-button label="inCircle">圈内楼盘 {{selectedBuildings.length || 0}}</el-radio-button>
      <el-radio-button label="inSelect">已选楼盘 {{selectedBuildings.length || 0}}</el-radio-button>
    </el-radio-group>

    <!-- 圈内列表 -->
    <div class="list-box-1" :class="{showListBox:mapListShowType === 'inSelect'}">
      <div class="top-title">
        <el-table v-if="tableCheckedListSum.list.length > 0" border class="build-list-table"
                  ref="multipleCircleTable"
                  :data="tableCheckedListSum.list"
                  height="400"
                  tooltip-effect="dark"
                  style="width: 100%;max-height:100%;overflow: auto"
                  @select="handleSelectionChange"
                  @select-all="handleSelectionAllChange"
                  @row-click="handleCurrentChange">
          <el-table-column
            type="selection"
            width="40">
          </el-table-column>
          <el-table-column
            prop="premisesName"
            label="楼盘名称"
            width="170px">
          </el-table-column>
        </el-table>
        <el-pagination v-if="selectedBuildings.length > 0"
                       background
                       layout="prev, pager, next"
                       :current-page="tableCheckedListSum.currentPage"
                       :total="selectedBuildings.length"
                       @current-change="handleCircleCurrentChange"
                       class="list-page"
                       :pager-count="3"
        ></el-pagination>
        <div v-if="selectedBuildings.length <= 0" class="nodata text-center">
          暂无数据
        </div>
      </div>
    </div>

    <!-- 已选楼盘 -->
    <div class="list-box-2" :class="{showListBox:mapListShowType === 'inCircle'}">
      <div class="top-title">
        <table v-if="selectedBuildings.length > 0" class="table table-bordered table-head" style="margin-bottom:0">
          <thead>
          <tr>
            <th>楼盘名称</th>
          </tr>
          </thead>
        </table>
        <table v-if="selectedBuildings.length > 0" class="table table-hover table-bordered"
               style="margin-bottom:20px">
          <tbody>
          <tr v-for="(buildItem,index) in selectCheckedListSum.list" :key="index">
            <td>{{buildItem['premisesName']}}</td>
          </tr>
          </tbody>
        </table>
        <el-pagination v-if="selectedBuildings.length > 0"
                       background
                       layout="prev, pager, next"
                       :current-page="selectCheckedListSum.currentPage"
                       :total="selectedBuildings.length"
                       @current-change="handleCurrentChange"
                       class="list-page"
                       :pager-count="3"
        ></el-pagination>
        <div v-if="selectedBuildings.length <= 0" class="nodata text-center">
          暂无数据
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "SelectBuild",
    props: {
      selectedBuildings: {
        type: Array,
        default: []
      },
      allBuildings: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        isActive: true,
        mapAllChecked: false,
        selectedListLoading: false,
        mapListShowType: 'inCircle',
        //右侧1列表选点数据=>圈内楼盘
        tableCheckedListSum: {
          pageSize: 100,
          currentPage: 1,
          list: []
        },
        //右侧2列表选点数据=>已选楼盘
        selectCheckedListSum: {
          pageSize: 100,
          currentPage: 1,
          list: []
        },
        multipleSelection: []
      }
    },
    created() {
      this.selectCheckedList()
    },
    watch: {
      selectedBuildings: {
        handler: function (newVal, oldVal) {
          this.selectCheckedList()
        }
        ,
        deep: true
      }
    },
    methods: {
      handleSelectionChange: function (selection) {
        this.selectedBuildings = selection
      },
      handleSelectionAllChange: function (selection) {
        this.selectedBuildings = selection
      },
      handleCircleCurrentChange(page) {
        this.tableCheckedListSum.currentPage = page
      },
      handleCurrentChange(page) {
        this.selectCheckedListSum.currentPage = page
        this.selectCheckedList()
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleCircleTable.toggleRowSelection(row);
          });
        }
      },
      selectCheckedList() {
        // 這樣就是根據 type 來過濾
        let result = this.$tools.getFrontEndPage(this.selectedBuildings, this.selectCheckedListSum.pageSize, this.selectCheckedListSum.currentPage)
        this.selectCheckedListSum.list = result.results;
      }
    }
  }
</script>

<style lang="scss">
  .map-choosed-list {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 270px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
    background: #fff;
    height: auto;
    z-index: 1;
    transition: .35s;
    .showListBox {
      display: none;
    }
    .el-radio-group {
      width: 100%;
      .el-radio-button {
        width: 50%;
        .el-radio-button__inner {
          width: 100%;
        }
      }
    }
    .top-title {
      padding: 0 10px;
      margin: 10px 0 20px 0;
    }
    .build-list-table {
      position: relative;
      z-index: 1;
      margin-top: -2px;
    }
    .el-table--border {
      border-bottom: 1px solid $color-border;
    }
    .el-table__header-wrapper {
      border-bottom: 1px solid $color-border;
    }
  }
  .list-box-2 {
    .table-bordered {
      width: 100%;
      max-width: 100%;
      border: 1px solid $color-border;
    }
    .table-bordered tbody tr td, .table-bordered thead tr th {
      border: 1px solid $color-border;
      padding: 12px 0 12px 10px;
      min-width: 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      text-overflow: ellipsis;
      vertical-align: middle;
      position: relative;
      text-align: left;
    }
    .table-bordered tbody tr td {
      border-bottom: none;
      border-left: none;
    }
    .table-hover tbody tr:first-child td {
      border-top: none;
    }
    .table-hover tbody {
      overflow-y: scroll;
      height: 360px;
      table-layout: fixed;
      border-top: none;
      display: flow-root;
    }
    .table-hover tbody tr {
      width: 100%;
      display: grid;
    }
    .table-head {
      border-bottom: none;
    }
    .list-page {
      text-align: center;
    }
  }
</style>
