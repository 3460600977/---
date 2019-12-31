<template>
  <!-- 选点结果列表 -->
  <div class="map-choosed-list">
    <el-radio-group v-model="mapListShowType" style="margin-bottom: 10px;" @change="selectCheckedList">
      <el-radio-button label="inCircle">圈内楼盘 {{allBuildings.length || 0}}</el-radio-button>
      <el-radio-button label="inSelect">已选楼盘 {{selectedBuildings.length || 0}}</el-radio-button>
    </el-radio-group>

    <!-- 圈内列表 -->
    <div class="list-box-1" :class="{showListBox:mapListShowType === 'inSelect'}">
      <div class="top-title">
        <el-table border class="build-list-table"
                  ref="multipleCircleTable"
                  :data="tableCheckedListSum.list"
                  height="400"
                  tooltip-effect="dark"
                  style="width: 100%;max-height:100%;overflow: auto"
                  @select="handleSelectionChange"
                  @select-all="handleSelectionAllChange">
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
        <el-pagination v-if="allBuildings.length > 0 && mapListShowType === 'inCircle'"
                       background
                       layout="prev, pager, next"
                       :current-page="tableCheckedListSum.currentPage"
                       :total="allBuildings.length"
                       @current-change="handleCircleCurrentChange"
                       class="list-page"
                       :page-size="tableCheckedListSum.pageSize"
                       :pager-count="5"
        ></el-pagination>
        <div v-if="allBuildings.length <= 0" class="nodata text-center">
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
        <el-pagination v-if="selectedBuildings.length > 0 && mapListShowType === 'inSelect'"
                       background
                       layout="prev, pager, next"
                       :current-page="selectCheckedListSum.currentPage"
                       :total="selectedBuildings.length"
                       @current-change="handleCurrentChange"
                       class="list-page"
                       :page-size="selectCheckedListSum.pageSize"
                       :pager-count="5"
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
          list: [],
          init: [],
        },
        //右侧2列表选点数据=>已选楼盘
        selectCheckedListSum: {
          pageSize: 100,
          currentPage: 1,
          list: [],
          init: [],
        },
        multipleSelection: [],
        firstLoad: 0,
        deleteList: [],
      }
    },
    created() {
      this.selectCheckedList()
      this.firstLoad = 1;
    },
    watch: {
      selectedBuildings: {
        handler: function (newVal, oldVal) {
          this.selectCheckedList()
          return newVal
        }
        ,
        deep: true
      },
      allBuildings: {
        handler: function (newVal, oldVal) {
          if (newVal.length > 0) {
            this.selectTableList();
            this.firstLoad = 1
            this.$refs.multipleCircleTable.toggleAllSelection();
          }
          return newVal;
        }
        ,
        deep: true
      }
    },
    methods: {
      handleSelectionChange: function (rows, row) {
        let selected = rows.length && rows.indexOf(row) !== -1
        if (selected) {
          this.deleteList.forEach((item, index) => {
            if (item.premisesId === row.premisesId) {
              this.deleteList.splice(index, 1)
            }
          })
          this.addItem(row)
        } else {
          console.log('handleSelectionChange!~~~~~~~~~~~~~~~~~~~~~~~~~')
          this.deleteList.push(row)
          console.log(this.deleteList, row)
          this.deleteItem(row)
        }
      },
      handleSelectionAllChange: function (rows) {
        if (this.firstLoad === 1) {
          this.firstLoad++
          return false
        }
        if (rows.length === 0) {
          //取消所有选点才触发
          let deleteBatch = this.selectedBuildings
          this.deleteBathItem(deleteBatch)
        } else {
          //全选所有选点才触发
          this.deleteList = []
          let addBatch = this.allBuildings
          this.addBatchItem(addBatch)
        }
      },
      handleCircleCurrentChange(page) {
        this.tableCheckedListSum.currentPage = page
        this.selectTableList()
        this.firstLoad = 1
        this.$refs.multipleCircleTable.toggleAllSelection();
        this.deleteList.forEach((item, index) => {
          console.log('handleCircleCurrentChange~~~~~~~~~~~~~~~~~~~~~~')
          console.log(this.$refs.multipleCircleTable, item)
          //this.$refs.multipleCircleTable.toggleRowSelection(item, false);
        })
      },
      handleCurrentChange(page) {
        this.selectCheckedListSum.currentPage = page
        this.selectCheckedList()
      },
      selectCheckedList() {
        let result = this.$tools.getFrontEndPage(this.selectedBuildings, this.selectCheckedListSum.pageSize, this.selectCheckedListSum.currentPage)
        this.selectCheckedListSum.list = result.results;
      },
      selectTableList() {
        let result = this.$tools.getFrontEndPage(this.allBuildings, this.tableCheckedListSum.pageSize, this.tableCheckedListSum.currentPage)
        this.tableCheckedListSum.list = result.results;
      },
      //触发父级组件的删除某个楼盘方法
      deleteItem(item) {
        this.$emit('deleteItem', item)
      },
      //触发父级组件的增加某个楼盘方法
      addItem(item) {
        this.$emit('addItem', item)
      },
      //触发父级组件,批量删除多个楼盘
      deleteBathItem(allList) {
        this.$emit('deleteBathItem', allList)
      },
      //触发父级组件,批量增加多个楼盘
      addBatchItem(allList) {
        this.$emit('addBatchItem', allList)
      },
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
      margin-bottom: 20px;
    }
    .el-table--border {
      border-bottom: 1px solid $color-border;
    }
    .el-table__header-wrapper {
      border-bottom: 1px solid $color-border;
    }
  }
  .list-box-1 {
    .list-page {
      text-align: center;
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
