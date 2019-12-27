<template>
    <div class="container cityInsight">
      <div class="draw-type">
        <draw-type
          ref="drawType"
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
      <div class="mouseMove-text" :style="{
          'top': location.y + 10 + 'px',
          'left': location.x + 10 + 'px'
          }">
        <mouseMove-text
          v-if="currentSelectType"
          ref="mouseMoveText"
          :currentSelectType="currentSelectType"
        ></mouseMove-text>
      </div>
      <div class="right-info">
        <slide-container
        >
<!--          <right-info-->
<!--            :selectedBuildings="selectedBuildings"-->
<!--            @addBtnClick="addBtnClick"-->
<!--            @createPackage="createPackage"-->
<!--            @deleteItem="deleteItem"-->
<!--          ></right-info>-->
          <building-detail
            ref="buildingDetail"
          ></building-detail>
        </slide-container>
      </div>
      <div class="map container">
        <db-map
          ref="dbmap"
          :budget="budget"
          :filters="buildingFilter"
          :currentSelectType="currentSelectType"
          @pathArrChange="pathArrChange"
          @activePathChange="activePathChange"
          @currentMouseLocation="currentMouseLocation"
          @drawCancle="drawCancle"
          @returnSearchResult="returnSearchResult"
          @returnSelectedBuildings="returnSelectedBuildings"
        ></db-map>
      </div>
      <div class="create-dialog">
        <create-dialog ref="createDialog" :data="selectedBuildings"></create-dialog>
      </div>
      <div class="add-dialog">
        <add-dialog
          ref="addDialog"
          cityCode="510100"
          @selectLocation="addLocation"
        ></add-dialog>
      </div>
    </div>
</template>

<script>
  import dbMap from '../../../components/map/map.vue'
  import mapPopup from "../../../components/map/mapPopup";
  import rightInfo from "./rightInfo";
  import drawType from "../../../components/map/drawType";
  // import leftSelect from "./leftSelect";
  import mouseMoveText from "./mouseMoveText";
  import createDialog from "./createDialog";
  import buildingDetail from "./buildingDetail";
  import slideContainer from "../../../components/slideContainer";
  import addDialog from "./addDialog";
  // import topSelect from "./topSelect";

  const NAV_HEIGHT = 76,
    ANOTHER_HEIGHT = 10,
    POPUP_WIDTH = 240

  export default {
    name: "index",
    components: {
      dbMap,
      addDialog,
      mapPopup,
      drawType,
      buildingDetail,
      createDialog,
      slideContainer,
      // leftSelect,
      rightInfo,
      // topSelect,
      mouseMoveText
    },
    data() {
      return {
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
        location: {
          x: 0,
          y: 0
        },
        budget: 1, // 投放预算默认值
        sliderVal: 3000,
        currentSelectType: null,
        popUpHeight: {
          'polyline': 329,
          'polygon': 278,
          'circle': 424 // 402 + 22圆形时弹窗位置为弹窗高度加图标高度
        }
      }
    },
    mounted() {
      this.bindEvent()
      this.$refs.buildingDetail.loadData(167921)
    },
    computed: {
      mapLocation() { // 当前显示弹窗得path
        if (this.showPathCopy && this.showPathCopy.location) {
          let location = this.$refs.dbmap.map.pointToPixel(this.showPathCopy.location)
          return {
            x: location.x - POPUP_WIDTH/2,
            y: location.y - this.popUpHeight[this.showPathCopy.type] - ANOTHER_HEIGHT
          }
        } else {
          return {
            x: 0,
            y: 0
          }
        }
      }
    },
    methods: {
      // 添加媒体资源弹窗选择添加的楼盘
      addLocation(val) {
        let isExist = this.$refs.dbmap.addItem(val)
        this.$refs.addDialog.selectCallBack(isExist)
      },
      // 右边弹出框点击添加按钮
      addBtnClick() {
        this.$refs.addDialog.show()
      },
      // 右边弹出框点击删除某个楼盘
      deleteItem(item) {
        this.$refs.dbmap.deleteItem(item)
      },
      // 右边弹出框点击创建资源包
      createPackage() {
        this.$refs.createDialog.show()
      },
      // 查找选点搜索地点
      querySearchAsync(str) {
        this.$refs.dbmap.searchByWord(str)
      },
      // 地图组件返回搜索结果
      returnSearchResult(result) {
        console.log(result)
        this.$refs.drawType.setSearchList(result)
      },
      bindEvent() {
        document.documentElement.addEventListener('keydown', (e) => {
          if (e.keyCode === 27) {
            if (this.currentSelectType && this.currentSelectType.type === 'circle') {
              this.currentSelectType = null
              this.$refs.drawType.cancleSelect()
            }
          }
        })
      },
      returnBuildingTags(val) {
        this.buildingFilter = this.$tools.deepCopy(val)
      },
      deletePath(item) {
        this.$refs.dbmap.deletePath(item)
      },
      pathArrChange(val) {
        this.pathArr = val
      },
      /*
      *
      * */
      returnSelectedBuildings(val) {
        this.selectedBuildings = val
      },
      // mapPopup里面点击删除(0)和确定按钮(1)
      operate(val, item) {
        if (val === 0) {
          this.deletePath(item)
        } else if (val === 1) {
          this.$refs.dbmap.setActivePathNull()
        }
      },
      activePathChange(val) {
        this.showPathCopy = val
      },
      sliderChange(value) {
        this.$refs.dbmap.changeActivePathRadius(value)
      },
      /*
      * 选择画线类型后回调函数
      * type为select时 location为手动定点选择的item
      * type不为select时 location为鼠标最后的点击位置
      * */
      drawTypeSelect(location, type) {
        this.location.x = location.x
        this.location.y = location.y - NAV_HEIGHT
        this.currentSelectType = {type: type}
        if (type === 'circle') {
          this.$refs.dbmap.closeDrawingManager()
        } else if (type === 'select') {
          this.$refs.dbmap.closeDrawingManager()
          this.$refs.dbmap.drawCircle(location.point)
          this.currentSelectType = null
        } else {
          this.$refs.dbmap.triggerDraw(type)
        }
      },
      /*
      * 当前鼠标文字 用于显示提示文本位置
      * */
      currentMouseLocation(pixel) {
        this.location = pixel
      },
      /*
      * 取消绘画或者是绘画完成 隐藏文字提示文本框
      * */
      drawCancle() {
        this.currentSelectType = null
        this.$refs.drawType.cancleSelect()
      },
    },
  }
</script>

<style scoped lang='scss'>
.cityInsight {
  position: relative;
  overflow: hidden;
  .tools {
    position: absolute;
    z-index: 2;
    top: 10px;
    left: 20px;
  }
  .draw-type {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
  }
  .top-select {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;
  }
  .mapPopup {
    position: absolute;
    z-index: 3;
  }
  .mouseMove-text {
    position: absolute;
    z-index: 10;
  }
  .right-info {
    position: absolute;
    z-index: 3;
    top: 0;
    height: 100%;
    right: 0;
  }
  .left-select {
    position: absolute;
    z-index: 3;
    top: 29px;
    left: 30px;
  }
  .map {
    z-index: 1;
  }
}
</style>
