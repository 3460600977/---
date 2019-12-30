<template>
  <!-- 选点结果列表 -->
  <div class="map-choosed-list">
    <el-radio-group v-model="mapListShowType" style="margin-bottom: 10px;">
      <el-radio-button label="inCircle">圈内楼盘 {{resData.mapPointList.length || 0}}</el-radio-button>
      <el-radio-button label="inSelect">已选楼盘 {{selectedBuildings.length || 0}}</el-radio-button>
    </el-radio-group>

    <!-- 圈内列表 -->
    <div class="list-box" v-if="mapListShowType === 'inCircle'">
      <div class="top-title">
        <el-table v-if="resData.mapPointList.length > 0" border class="build-list-table"
                  ref="multipleCircleTable"
                  :data="resData.mapPointList"
                  tooltip-effect="dark"
                  style="width: 100%;max-height:100%;overflow-y: auto"
                  @select="handleSelectionChange"
                  @select-all="handleSelectionAllChange"
                  @row-click="handleCurrentChange">
          <el-table-column
            prop="id"
            type="selection"
            width="42px">
          </el-table-column>
          <el-table-column
            prop="name"
            label="楼盘名称"
            width="186px">
          </el-table-column>
        </el-table>
        <div v-if="resData.mapPointList.length <= 0" class="nodata text-center">
          暂无数据
        </div>
      </div>
    </div>

    <!-- 已选楼盘 -->
    <div class="list-box" v-if="mapListShowType === 'inSelect'">
      <div class="top-title">
        {{this.tableCheckedListSum.list}}
        <el-table v-if="this.tableCheckedListSum.list.length > 0" border class="build-list-table"
                  :data="this.tableCheckedListSum.list"
                  style="width: 100%">
          <el-table-column
            prop="name"
            label="楼盘名称"
            width="186px">
          </el-table-column>
        </el-table>
        <div v-if="this.tableCheckedListSum.list.length <= 0" class="nodata text-center">
          暂无数据{{this.tableCheckedListSum.list}}
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
      }
    },
    data() {
      return {
        localKey: 'chooseBuildList',
        isActive: true,
        mapAllChecked: false,
        selectedListLoading: false,
        mapListShowType: 'inCircle',
        //地图选点数据
        mapCheckedListSum: {
          list: []
        },
        //右侧列表选点数据
        tableCheckedListSum: {
          list: []
        },
        resData: {
          // 地图点位
          mapPointList: [
            {name: '安基大厦', id: 1},
            {name: '复兴苑', id: 2},
            {name: '中融大厦', id: 3},
            {name: '振安广场（恒安大厦）', id: 4},
            {name: '锦海大厦', id: 5},
            {name: '安基大厦', id: 6},
            {name: '复兴苑', id: 7},
            {name: '中融大厦', id: 8},
            {name: '振安广场（恒安大厦）', id: 9},
            {name: '锦海大厦', id: 10},
          ],
          //buildList 分页
          buildListPage: null,
          // 楼盘详细
          buildDetail: [],
          // 楼盘列表
          buildList: [],
          // 已选点位
          selected_point:
            {
              build_num: 0,
              total_point_num: 0,
              list: []
            }
        },
        multipleSelection: []
      }
    },
    watch: {
      selectedBuildings: {
        handler: function (newVal, oldVal) {
          //this.$refs.multipleCircleTable.toggleRowSelection(row, true)
          this.mapCheckedListSum.list = newVal
          return newVal
        },
        deep: true
      },
    },
    methods: {
      handleSelectionChange: function (selection) {
        console.log(selection)
        this.tableCheckedListSum.list = selection
      },
      handleSelectionAllChange: function (selection) {
        this.tableCheckedListSum.list = selection
      },
      handleCurrentChange(row, event, column) {
        console.log(row)
        this.$refs.multipleCircleTable.toggleRowSelection(row, true);//点击选中
      }
    }
  }
</script>

<style lang="scss">
  .map-choosed-list {
    position: absolute;
    top: 54px;
    right: 40px;
    width: 250px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
    background: #fff;
    height: auto;
    z-index: 1;
    transition: .35s;
    overflow: hidden;
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
      height: 400px;
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
</style>
