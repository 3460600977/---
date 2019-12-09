<template>
    <div class="container cityInsight">
      <div class="mapPopup">
        <map-popup
          v-if="showPath"
          @sliderChange="sliderChange"
          :item="showPath"
          :style="{top: showPath.location.y+'px', left:showPath.location.x+ 'px'}"
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
      <div class="left-select">
        <left-select @drawTypeSelect="drawTypeSelect"></left-select>
      </div>
      <div class="info">
<!--        <right-info></right-info>-->
      </div>
      <div class="map container">
        <db-map
          ref="dbmap"
          :currentSelectType="currentSelectType"
          @activePathChange="activePathChange"
          @currentMouseLocation="currentMouseLocation"
          @drawCancle="drawCancle"
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
      mouseMoveText
    },
    data() {
      return {
        showPathCopy: null, // 用于储存经纬度计算showPath的位置
        value: 100,
        map: null,
        location: { // 鼠标当前位置
          x: 0,
          y: 0
        },
        sliderVal: 3000,
        currentSelectType: null,
        popUpHeight: {
          'polyline': 292,
          'polygon': 231,
          'circle': 377 // 355 + 22圆形时弹窗位置为弹窗高度加图标高度
        }
      }
    },
    mounted() {
      this.bindEvent()
    },
    computed: {
      showPath() { // 当前显示弹窗得path
        if (this.showPathCopy && this.showPathCopy.location) {
          let location = this.$refs.dbmap.map.pointToPixel(this.showPathCopy.location)
          return {
            ...this.showPathCopy,
            location: {
              x: location.x - POPUP_WIDTH/2,
              y: location.y - this.popUpHeight[this.showPathCopy.type] - ANOTHER_HEIGHT
            },
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
      activePathChange(val) {
        this.showPathCopy = val
      },
      sliderChange(value) {
        console.log(value)
        // this.showPathCopy.radius = value
        console.log(this.showPathCopy)
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
  .mapPopup {
    position: absolute;
    z-index: 3;
  }
  .mouseMove-text {
    position: absolute;
    z-index: 10;
  }
  .info {
    position: absolute;
    z-index: 3;
    top: 29px;
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
