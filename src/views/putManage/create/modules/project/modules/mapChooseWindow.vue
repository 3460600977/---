<template>
  <div class="map-dialog-show" v-loading="loading">
    <div class="map-box">
      <div class="city-build-select">
        <div class="left-info">
          <left-info :isShow="isShow" :city="cityFilter" @toggle="toggle"></left-info>
          <div class="city-select select-style" v-show="isShow[0]">
            <singleSelect-popup
              ref="citySelect"
              title="城市列表"
              :selectDatas="cityDatas"
              :filters="cityFilter"
              :currentItem="cityFilter"
              @hide="() => hide(0)"
              @returnResult="(val) => returnResult(val, 0)"
            ></singleSelect-popup>
          </div>
          <div class="filter-container select-style" v-show="isShow[1]">
            <div class="mid-start filter-popup">
              <div style="width: 100%;height: 100%;">
                <left-tab
                  :lineHeight="42"
                  :tabData="tabData"
                  :activeTab="activeTab"
                  @changeTab="changeTab"
                ></left-tab>
              </div>
              <div class="flex1">
                <multiple-selectPopUp
                  ref="tagsSelect"
                  :selectDatas="buildingDatas"
                  :filters="buildingFilter"
                  @returnResult="(val, type) => returnResult(val, 1, type)"
                  @hide="() => hide(1)"
                ></multiple-selectPopUp>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="draw-select">
        <draw-type
          ref="drawType"
          :length="Object.keys(pathArr).length || 0"
          @searchDrawTypeClick="searchDrawTypeClick"
          @drawTypeSelect="drawTypeSelect"
          @querySearchAsync="querySearchAsync"
        ></draw-type>
      </div>
      <div class="mapPopup">
        <map-popup
          v-if="showPathCopy"
          @sliderChange="sliderChange"
          @operate="operate"
          :item="showPathCopy"
          :style="{top: mapLocation.y+'px', left: mapLocation.x+ 'px'}"
        ></map-popup>
      </div>
      <div
        class="mouseMove-text"
        :style="{
          'top': location.y + 10 + 'px',
          'left': location.x + 10 + 'px'
          }"
      >
        <mouseMove-text
          v-if="currentSelectType"
          ref="mouseMoveText"
          :currentSelectType="currentSelectType"
        ></mouseMove-text>
      </div>
      <slide-container ref="slideCon">
        <map-right-info
          v-show="rightShow === 0"
          :selectedBuildings="selectedBuildings"
          :cityFilter="cityFilter"
          @addBtnClick="addBtnClick"
          @createPackage="createPackage"
          @deleteItem="deleteItem"
          @hideMapPoint="hideMapPoint"
          @submitSelectedBuildPoint="submitSelectedBuildPoint"
        ></map-right-info>
        <building-detail v-show="rightShow === 1" @back="rightBack" ref="buildingDetail"></building-detail>
      </slide-container>
      <div class="map container">
        <db-map
          ref="dbmap"
          :buildings="points"
          :budget="budget"
          :city="cityFilter"
          :currentSelectType="currentSelectType"
          @hidePopup="hidePopup"
          @buildingClick="buildingClick"
          @pathArrChange="pathArrChange"
          @activePathChange="activePathChange"
          @currentMouseLocation="currentMouseLocation"
          @drawCancle="drawCancle"
          @returnSearchResult="returnSearchResult"
          @returnSelectedBuildings="returnSelectedBuildings"
        ></db-map>
      </div>
      <div class="add-dialog">
        <add-dialog-pro
          ref="addDialog"
          :cityCode="cityFilter.cityCode"
          @selectLocation="addLocation"
        ></add-dialog-pro>
      </div>
    </div>
  </div>
</template>
<script>
const CITY_MAPPING = {
  1: "一线城市:",
  2: "二线城市:",
  3: "三线城市:"
};
//import rightInfo from "../../../../../cityInsight/cityInsight/rightInfo";
import mapRightInfo from "./mapRightInfo";
import addDialogPro from "./addDialog";
import leftInfo from "../../../../../cityInsight/cityInsight/leftInfo";
import drawType from "../../../../../../components/map/drawType";
import mapPopup from "../../../../../../components/map/mapPopup";
import dbMap from "../../../../../../components/map/map.vue";
import leftTab from "../../../../../../components/leftTab";
import multipleSelectPopUp from "../../../../../../components/map/multipleSelectPopUp";
import singleSelectPopup from "../../../../../../components/map/singleSelectPopup";
import slideContainer from "../../../../../../components/slideContainer";
import SelectBuild from "../../../../../../components/SelectBuild";
import mouseMoveText from "../../../../../cityInsight/cityInsight/mouseMoveText";
import createDialog from "../../../../../cityInsight/cityInsight/createDialog";
import buildingDetail from "../../../../../cityInsight/cityInsight/buildingDetail";
import addDialog from "../../../../../cityInsight/cityInsight/addDialog";
import topSelect from "../../../../../cityInsight/cityInsight/topSelect";

const NAV_HEIGHT = 76;
const ANOTHER_HEIGHT = 10;
const POPUP_WIDTH = 240;

export default {
  name: "mapChooseShow",
  props: {
    mapChooseShow: {
      type: Boolean,
      default: true
    }
  },
  components: {
    dbMap,
    leftTab,
    addDialog,
    addDialogPro,
    mapPopup,
    drawType,
    multipleSelectPopUp,
    singleSelectPopup,
    buildingDetail,
    createDialog,
    slideContainer,
    leftInfo,
    mapRightInfo,
    SelectBuild,
    topSelect,
    mouseMoveText
  },
  data() {
    return {
      buildingDatas: {
        // 楼宇标签
        title: "楼宇标签",
        options: [
          {
            title: "楼宇类型",
            key: "buildType",
            types: [
              { label: "中高端住宅", key: 0 },
              { label: "商住楼", key: 1 },
              { label: "综合体", key: 2 },
              { label: "写字楼", key: 3 }
            ]
          },
          {
            title: "平均房价",
            key: "premiseAvgFee",
            types: [
              { label: "1万以下", key: 0 },
              { label: "1-1.5万", key: 1 },
              { label: "1.5-2万", key: 2 },
              { label: "2-2.5万", key: 3 },
              { label: "2.5-3万", key: 4 },
              { label: "3万以上", key: 5 }
            ]
          },
          {
            title: "入住率(%)",
            key: "occupancyRate",
            types: [
              { label: "70-80%", key: 0 },
              { label: "80%-90%", key: 1 },
              { label: "90%以上", key: 2 }
            ]
          },
          {
            title: "楼龄(年)",
            key: "buildingAge",
            types: [
              { label: "5年以内", key: 0 },
              { label: "5-10年", key: 1 },
              { label: "10年以上", key: 2 }
            ]
          },
          {
            title: "车位数(个)",
            key: "parkingNum",
            types: [
              { label: "低于200", key: 0 },
              { label: "200-500", key: 1 },
              { label: "500-800", key: 2 },
              { label: "800以上", key: 3 }
            ]
          },
          {
            title: "物业费(元)",
            key: "propertyRent",
            types: [
              { label: "2元以下", key: 0 },
              { label: "2-3元", key: 1 },
              { label: "3元以上", key: 2 }
            ]
          }
        ]
      },
      activeTab: 0,
      leftShow: [false, false], // 控制筛选弹出框的加载
      currentPonents: null,
      tabData: [{ name: "楼盘筛选", value: 1 }],
      points: [], // 当前所有的楼盘点位数据
      cityDatas: [], // 城市数据
      isShow: {
        // 控制左边弹出框显示
        0: false,
        1: false
      },
      cityFilter: {
        // 当前城市信息
        cityCode: null,
        name: "没有定位到城市！"
      },
      loading: false,
      rightShow: 0, // 空控制右边面板显示点位信息还是楼盘详情
      showPathCopy: null, // 当前显示的path
      selectedBuildings: [], // 当前选中的楼盘
      pathArr: {}, // 当前存在的画线path
      buildingFilter: {
        buildType: [],
        premiseAvgFee: [],
        occupancyRate: [],
        buildingAge: [],
        parkingNum: [],
        propertyRent: []
      },
      buildingFilterSelected: false,
      location: {
        x: 0,
        y: 0
      },
      budget: 1, // 投放预算默认值
      sliderVal: 3000,
      currentSelectType: null,
      popUpHeight: {
        polyline: 246,
        polygon: 121,
        circle: 310 // 402 + 22圆形时弹窗位置为弹窗高度加图标高度
      }
    };
  },
  created() {
    this.loading = true;
  },
  mounted() {
    this.init();
    this.bindEvent();
    this.hideAll();
  },
  watch: {
    cityFilter(val) {
      this.$refs.dbmap.setCity(val);
      this.$refs.dbmap.clearMap();
    }
  },
  computed: {
    mapLocation() {
      // 当前显示弹窗得path
      if (this.showPathCopy && this.showPathCopy.location) {
        let location = this.$refs.dbmap.map.pointToPixel(
          this.showPathCopy.location
        );
        return {
          x: location.x - POPUP_WIDTH / 2,
          y:
            location.y -
            this.popUpHeight[this.showPathCopy.type] -
            ANOTHER_HEIGHT
        };
      } else {
        return {
          x: 0,
          y: 0
        };
      }
    }
  },
  beforeDestroy() {
    document.documentElement.removeEventListener(
      "keydown",
      this.cancleCircleDrawType
    );
  },
  methods: {
    //清除选点
    clearChoosePath() {
      this.$refs.dbmap.clearPathArr();
      this.hidePopup();
      this.showPathCopy = null;
      this.currentSelectType = null;
    },
    //隐藏地图选点页面
    hideMapPoint() {
      this.$emit("hideMapPoint", false);
    },
    //选中的楼盘数据保存
    submitSelectedBuildPoint(selectedList, cityList) {
      this.$emit("submitSelectedBuildPoint", selectedList, cityList);
      this.$emit("hideMapPoint", false);
    },
    // 隐藏弹出框
    hidePopup() {
      this.hideAll();
      this.$refs.drawType.hide();
    },
    // 添加资源包成功后触发事件
    createSuc() {
      this.$refs.dbmap.clearPathArr();
    },
    // 查找选点按钮点击
    searchDrawTypeClick() {
      this.currentSelectType = null;
      this.hideAll();
    },
    // 热力图开关切换
    switchChange(val) {
      if (val) {
        this.$refs.dbmap.showHotMap();
      } else {
        this.$refs.dbmap.hideHotMap();
      }
    },
    // 筛选中菜单改变
    changeTab(val) {
      if (!this.leftShow[val.value]) {
        this.leftShow[val.value] = true;
      }
      this.activeTab = val.value;
    },
    loadHotMap(id) {
      this.hotLoading = true;
      this.$api.peopleInsight
        .getPeopleInsightHotMap({ crowdInsightId: id, max: 100, min: 0 })
        .then(data => {
          if (data.result) {
            this.$refs.dbmap.drawHotMap(data.result);
          } else {
            this.switchChange(false);
          }
          this.hotLoading = false;
        });
    },
    // 隐藏热力图
    hideHotMap() {
      this.$refs.dbmap.hideHotMap();
    },
    resetHotMap() {
      this.switchChange(false);
      this.$refs.peopleInsight.resetSelect();
    },
    resetTagsAndLoad() {
      this.buildingFilter = {
        buildType: [],
        premiseAvgFee: [],
        occupancyRate: [],
        buildingAge: [],
        parkingNum: [],
        propertyRent: []
      };
      if (this.$refs.tagsSelect) {
        this.$refs.tagsSelect.clear();
      }
      this.buildingFilterSelected = false;
      this.loadData();
    },

    resetLeftPopup(index) {
      if (index === 0) {
        this.rightShow = 0;
        this.activeTab = 0;
        this.leftShow = new Array(this.leftShow.length).fill(false);
        this.resetTagsAndLoad();
      } else if (index === 1) {
        this.resetHotMap();
      } else if (index === 2) {
        if (this.buildingFilterSelected) {
          // 如果标签选择过，则清空标签选择结果
          this.$refs.dbmap.clearMap();
          this.resetTagsAndLoad();
        } else {
          this.createSuc();
        }
      }
    },
    // 各种弹窗返回数据触发方法 type表示楼盘标签是 0清空还是2选择
    returnResult(val, index, type) {
      if (index === 0) {
        // 城市切换
        this.$confirm(
          "切换城市后，系统将清空当前城市的操作数据，是否切换？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.cityFilter = val;
            this.resetLeftPopup(index, type);
          })
          .catch(() => {});
      } else if (index === 1) {
        // 楼盘标签选择
        if (type === 0) {
          this.buildingFilterSelected = false;
        } else {
          this.buildingFilterSelected = true;
        }
        this.$refs.dbmap.setCity(this.cityFilter);
        this.buildingFilter = val;
        this.loadData();
        this.hide(1);
        this.resetLeftPopup(index, type);
      } else if (index === 2) {
        // 热力图选择
        if (!Object.keys(this.pathArr).length) {
          // this.switchChange(true)
          this.$refs.peopleInsight.setSwitchValue(true);
          this.getHotMap(val, index, type);
          return;
        }
        this.$confirm(
          "系统加载人群包，将自动清空之前的操作数据，是否清空？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.$refs.peopleInsight.setSwitchValue(true);
            // this.switchChange(true)
            this.getHotMap(val, index, type);
          })
          .catch(() => {});
      }
    },
    getHotMap(val, index, type) {
      this.loadHotMap(val);
      this.hide(1);
      this.resetLeftPopup(index, type);
    },
    hideAll() {
      for (let key in this.isShow) {
        this.isShow[key] = false;
      }
    },
    // 当点击筛选或者选择城市的时候取消drawType中的选择
    cancleDrawType() {
      this.$refs.drawType.hide();
      this.$refs.dbmap.closeDrawingManager();
      this.currentSelectType = null;
    },
    toggle(val) {
      if (this.isShow[val]) {
        this.hide(val);
      } else {
        this.cancleDrawType();
        this.hideAll();
        this.isShow[val] = true;
        if (val === 1) {
          if (!this.leftShow[0]) {
            this.leftShow[0] = true;
          }
        }
      }
    },
    hide(val) {
      this.isShow[val] = false;
    },
    findItem(val, arr) {
      let arrTotal = this.$tools.operation(arr, "values");
      let result = arrTotal.find(item => {
        return item.name == val.name;
      });
      return result;
    },
    getCityFilter() {
      this.$refs.dbmap.location().then(data => {
        if (!data || (data && data.name === "全国")) {
          this.$confirm("定位失败，将自动将城市设置为成都！", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              let result = Object.assign({}, this.cityFilter, {
                name: "成都市"
              });
              this.cityFilter = this.findItem(result, this.cityDatas);
              this.loadData();
            })
            .catch(() => {});
          return;
        }
        let result = Object.assign({}, this.cityFilter, { name: data.name });
        let result1 = this.findItem(result, this.cityDatas);
        if (result1) {
          this.cityFilter = result1;
          this.loadData();
        } else {
          this.cityFilter = result;
          this.$message.error("当前城市尚未开通，我们已在快马加鞭，敬请期待！");
          this.loading = false;
          return;
        }
      });
    },
    loadCitys() {
      new Promise((resolve, reject) => {
        this.$api.CityList.TypeList().then(data => {
          if (data.result) {
            this.cityDatas = data.result.map(item => {
              return { title: CITY_MAPPING[item.level], values: item.citys };
            });
          } else {
            this.cityDatas = [];
          }
          this.getCityFilter();
          resolve();
        });
      });
    },
    // 左边传出信息
    leftInfoCallBak(val, type) {
      if (type === 0) {
        this.cityFilter = val;
      }
    },
    loadData() {
      this.loading = true;
      this.$api.cityInsight
        .getPremisesByCity({
          cityCode: this.cityFilter.cityCode,
          tag: this.buildingFilter
        })
        .then(data => {
          if (data.result) {
            this.points = data.result;
          } else {
            this.points = [];
          }
          this.loading = false;
        });
    },
    // 初始化
    init() {
      this.loadCitys();
    },
    // 楼盘详情窗口点击返回按钮
    rightBack() {
      this.rightShow = 0;
    },
    // 某个building被点击触发事件
    buildingClick(item) {
      this.$refs.slideCon.showPanel();
      this.$refs.buildingDetail.loadData(item.premisesId);
      this.rightShow = 1;
    },
    // 添加媒体资源弹窗选择添加的楼盘
    addLocation(val) {
      let isExist = this.$refs.dbmap.addBatchItem([val]);
      this.$refs.addDialog.selectCallBack(isExist);
    },
    // 右边弹出框点击添加按钮
    addBtnClick() {
      this.$refs.addDialog.show();
    },
    // 右边弹出框点击删除某个楼盘
    deleteItem(item) {
      this.$refs.dbmap.deleteBathItem([item], -2);
    },
    // 右边弹出框点击创建资源包
    createPackage() {
      this.$refs.createDialog.show();
    },
    // 查找选点搜索地点
    querySearchAsync(str) {
      this.$refs.dbmap.searchByWord(str);
    },
    // 地图组件返回搜索结果
    returnSearchResult(result) {
      this.$refs.drawType.setSearchList(result);
    },
    cancleCircleDrawType(e) {
      if (e.keyCode === 27) {
        if (
          this.currentSelectType &&
          this.currentSelectType.type === "circle"
        ) {
          this.currentSelectType = null;
          this.$refs.drawType.cancleSelect();
        }
      }
    },
    bindEvent() {
      document.documentElement.addEventListener(
        "keydown",
        this.cancleCircleDrawType
      );
    },
    returnBuildingTags(val) {
      this.buildingFilter = this.$tools.deepCopy(val);
    },
    deletePath(item) {
      this.$refs.dbmap.deletePath(item);
    },
    pathArrChange(val) {
      this.pathArr = val;
    },
    /*
      /*
      *
      * */
    returnSelectedBuildings(val) {
      this.selectedBuildings = val;
      this.rightShow = 0;
    },
    // mapPopup里面点击删除(0)和确定按钮(1)
    operate(val, item) {
      if (val === 0) {
        this.deletePath(item);
      } else if (val === 1) {
        this.$refs.dbmap.setActivePathNull();
      }
    },
    activePathChange(val) {
      this.showPathCopy = val;
    },
    sliderChange(value) {
      this.$refs.dbmap.changeActivePathRadius(value);
    },
    /*
     * 选择画线类型后回调函数
     * type为select时 location为手动定点选择的item
     * type不为select时 location为鼠标最后的点击位置
     * */
    drawTypeSelect(location, type) {
      this.location.x = location.x;
      this.location.y = location.y - NAV_HEIGHT;
      if (type === "circle") {
        this.hideAll();
        this.currentSelectType = { type: type };
        this.$refs.dbmap.closeDrawingManager();
      } else if (type === "select") {
        this.$refs.dbmap.closeDrawingManager();
        this.$refs.dbmap.drawCircle(location.point, location);
      } else {
        this.hideAll();
        this.currentSelectType = { type: type };
        this.$refs.dbmap.triggerDraw(type);
      }
    },
    /*
     * 当前鼠标文字 用于显示提示文本位置
     * */
    currentMouseLocation(pixel) {
      this.location = pixel;
    },
    /*
     * 取消绘画或者是绘画完成 隐藏文字提示文本框
     * */
    drawCancle() {
      this.currentSelectType = null;
      this.$refs.drawType.cancleSelect();
    }
  }
};
</script>

<style scoped lang="scss">
.map-dialog-show {
  .map-box {
    width: 100%;
    height: calc(100vh - 60px);
    position: relative;
    overflow: hidden;
  }
  .map-btn {
    & + .map-btn {
      margin-left: 60px;
    }
    width: 100px;
  }
  .city-build-select {
    z-index: 3;
    position: absolute;
    left: 10px;
    top: 10px;
    .mid-start {
      display: block;
    }
  }
  .draw-select {
    z-index: 10;
    position: absolute;
    left: 240px;
    top: 10px;
  }
  .left-info {
    .filter-popup {
      /*height: 490px;*/
      background: $color-bg-3;
    }
    .filter-container {
      left: 110px;
      .lt {
        background: $color-bg-3;
        border-bottom: 1px solid $color-border;
        li {
          text-align: left;
          margin-left: 20px;
          color: $color-text-3;
        }
      }
    }
    .select-style {
      position: absolute;
      top: 60px;
      width: 500px;
    }
  }
  .mapPopup {
    position: absolute;
    z-index: 3;
  }
  .mouseMove-text {
    top: 500px;
    left: 419px;
    position: absolute;
    z-index: 10;
  }
  .map {
    z-index: 1;
  }
}
</style>
