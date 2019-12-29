<template>
  <!-- 选点结果列表 -->
  <div class="map-choosed-list panel panel-default animate-to-top ui-tab-container">
    <el-radio-group v-model="mapListShowType" style="margin-bottom: 30px;">
      <el-radio-button label="inCircle">圈内楼盘 {{resData.mapPointList.length || 0}}</el-radio-button>
      <el-radio-button label="inSelect">已选楼盘 {{mapCheckedListSum.list.length || 0}}</el-radio-button>
    </el-radio-group>

    <!-- 圈内列表 -->
    <div class="list-box" v-if="mapListShowType === 'inCircle'">
      <div class="top-title">
        <table class="table table-bordered" style="margin-bottom:0">
          <thead>
          <tr>
            <th style="width: 42px" class="text-center">
              <input class="redcheckbtnall" v-if="mapAllChecked" type="checkbox" @click="checkAllMapPoint()"/>
            </th>
            <th>楼盘名称</th>
          </tr>
          </thead>
        </table>
      </div>

      <div class="bottom-list" v-if="resData.mapPointList.length > 0">
        <table class="table table-hover table-bordered">
          <tbody>
          <tr v-for="(buildItem,index) in resData.mapPointList">
            <td
              style="width: 42px;"
              class="text-center"
              @click="changeMapListCheck(buildItem)">
              <input class="redcheckbtn" type="checkbox" ng-checked="buildItem.action === 1">
            </td>
            <td title="点击查看楼盘详情">
              <a @click="showBuildDetail(buildItem)" href="javascript:;">{{buildItem}}</a>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="bottom-list" v-if="resData.mapPointList.length <= 0">
        <div class="nodata text-center">
          暂无数据
        </div>
      </div>
    </div>

    <!-- 已选楼盘 -->
    <div class="list-box" v-if="mapListShowType === 'inSelect'">
      <div class="top-title">
        <table class="table table-bordered" style="margin-bottom:0">
          <thead>
          <tr>
            <!-- <th style="width: 42px" class="text-center"><input class="redcheckbtnall" type="checkbox" @click="checkAllMapPoint()"></th> -->
            <th>楼盘名称</th>
          </tr>
          </thead>
        </table>
      </div>

      <div class="bottom-list">
        <table class="table table-hover table-bordered">
          <tbody>
          <tr v-for="buildItem in mapCheckedListSum.list">
            <!-- <td
                style="width: 42px;"
                class="text-center"
                @click="dataExchange.delItemOuter($index)">
                <label class="redcheckbtnall" checked="true"></label>
            </td> -->
            <td>{{buildItem.build_name}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "SelectBuild",
    data() {
      return {
        isActive: true,
        mapAllChecked: false,
        selectedListLoading: false,
        mapListShowType: 'inCircle',
        mapCheckedListSum: {
          list: []
        },
        resData: {
          // 楼盘列表
          buildList: [],
          //buildList 分页
          buildListPage: null,
          // 楼盘详细
          buildDetail: [],
          // 地图点位
          mapPointList: [],
          // 已选点位
          selected_point:
            {
              build_num: 0,
              total_point_num: 0,
              list: []
            }
        },
      }
    },
    methods: {
      setLocalStorage: function (name, data) {
        return localStorage.setItem(name, JSON.stringify(data));
      },

      getLocalStorage: function (name) {
        return JSON.parse(localStorage.getItem(name));
      },
      changeMapListShowType: function (showType) {
        this.mapListShowType = showType;
      },
      checkAllMapPoint: function () {
        this.removeAllMapPoint();
      },
      removeAllMapPoint: function () {

      },
      changeMapListCheck: function (buildItem) {

      },
      showBuildDetail: function (buildObj) {
        // 点基础的信息
        this.resData.buildDetail.parentData = buildObj;
      }
    }
  }
</script>

<style lang="scss">
  .active {
    background: $color-bg;
    color: $color-text;
  }
  .map-choosed-list {
    position: absolute;
    top: 54px;
    right: 10px;
    width: 250px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
    background: #fff;
    height: auto;
    z-index: 1;
    transition: .35s;
    overflow: hidden;
    .title {
      user-select: none;
    }
    .redcheckbtn {
      position: relative;
      text-align: center;
      cursor: pointer;
      line-height: 18px;
      &::after {
        position: absolute;
        left: 50%;
        top: 50%;
        margin: -9px 0 0 -9px;
        display: inline-block;
        content: '';
        width: 18px;
        height: 18px;
        background: #fff;
        border: 1px solid #CBD5DD;
      }
      &:checked::after {
        position: absolute;
        left: 50%;
        top: 50%;
        margin: -9px 0 0 -9px;
        display: inline-block;
        content: '✔';
        width: 18px;
        height: 18px;
        background: $color-blue;
        color: #fff;
        border: none;
      }
    }
    .redcheckbtnall {
      position: relative;
      text-align: center;
      color: #fff;
      line-height: 20px;
      cursor: pointer;
      &::after {
        position: absolute;
        left: 50%;
        top: 50%;
        margin: -10px 0 0 -10px;
        display: inline-block;
        content: '＋';
        width: 20px;
        height: 20px;
        background: $color-blue;
      }
      &:checked::after {
        position: absolute;
        left: 50%;
        top: 50%;
        margin: -10px 0 0 -10px;
        display: inline-block;
        content: '－';
        width: 20px;
        height: 20px;
        background: $color-blue;
      }
    }
    .list-box {
      padding: 10px;
      .top-title {
        position: relative;
        background: #fff;
        z-index: 2;
        td {
          padding: 4px 10px;
        }
      }
      .bottom-list {
        position: relative;
        z-index: 1;
        margin-top: -2px;
        // height: calc(100vh - 405px);
        height: calc(100vh - 360px);
        overflow-y: auto;
        table {
          margin-bottom: 0;
          td {
            // padding: 4px 10px;
          }
        }
        .nodata {
          line-height: calc(100vh - 415px);
          border: 1px solid #ddd;
        }
      }
    }
  }
</style>
