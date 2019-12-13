<template>
    <div class="container cityInsight">
      <div class="top-select">
        <top-select
          :buildingFilter="buildingFilter"
          @returnBuildingTags="returnBuildingTags"
          @drawTypeSelect="drawTypeSelect"
        ></top-select>
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
<!--      <div class="left-select">-->
<!--        <left-select @drawTypeSelect="drawTypeSelect"></left-select>-->
<!--      </div>-->
      <div class="right-info">
        <right-info
          :budget="budget"
          :selectedBuildings="selectedBuildings"
          :pathArr="pathArr"
          @deletePath="deletePath"
          @budgetChange="budgetChange"
        ></right-info>
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
          @returnSelectedBuildings="returnSelectedBuildings"
        ></db-map>
      </div>
    </div>
</template>

<script>
  import dbMap from '../../../components/map/map.vue'
  import tools from "../../../components/map/tools";
  import mapPopup from "../../../components/map/mapPopup";
  import rightInfo from "./rightInfo";
  import leftSelect from "./leftSelect";
  import mouseMoveText from "./mouseMoveText";
  import topSelect from "./topSelect";

  const NAV_HEIGHT = 76,
    ANOTHER_HEIGHT = 10,
    POPUP_WIDTH = 240

  export default {
    name: "index",
    components: {
      dbMap,
      tools,
      mapPopup,
      leftSelect,
      rightInfo,
      topSelect,
      mouseMoveText
    },
    data() {
      return {
        showPathCopy: null, // 当前显示的path
        map: null,
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
      bindEvent() {
        document.documentElement.addEventListener('keydown', (e) => {
          if (e.keyCode === 27) {
            if (this.currentSelectType && this.currentSelectType.type === 'circle') {
              this.currentSelectType = null
            }
          }
        })
      },
      returnBuildingTags(val) {
        console.log(val)
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
      * */
      drawTypeSelect(location, type) {
        this.location.x = location.x
        this.location.y = location.y - NAV_HEIGHT
        this.currentSelectType = {type: type}
        if (type === 'circle') {
          this.$refs.dbmap.closeDrawingManager()
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
      },
      /*
      * 投放预算变化
      * */
      budgetChange(val) {
        this.budget = val
      },
    },
  }
</script>

<style scoped lang='scss'>
.cityInsight {
  position: relative;
  .tools {
    position: absolute;
    z-index: 2;
    top: 10px;
    left: 20px;
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
    top: 79px;
    background: #fff;
    right: 40px;
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
