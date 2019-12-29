<template>
  <el-dialog
    :visible.sync="mapChooseShow"
    width="98%"
    class="map-choose">
    <div class="map-box">
      <div class="city-select">
        <left-info></left-info>
      </div>
      <div class="draw-select">
        <draw-type ref="drawType" @drawTypeSelect="drawTypeSelect" @querySearchAsync="querySearchAsync"></draw-type>
      </div>
      <div class="right-select-build">
        <select-build></select-build>
      </div>
      <div class="map-popup">
        <map-popup
          v-if="showPathCopy"
          @sliderChange="sliderChange"
          @operate="operate"
          :item="showPathCopy"
          :style="{top: mapLocation.y+'px', left: mapLocation.x+ 'px'}"
        ></map-popup>
      </div>
      <div class="map container">
<!--        <db-map-->
<!--          ref="dbmap"-->
<!--          :budget="budget"-->
<!--          :filters="buildingFilter"-->
<!--          :currentSelectType="currentSelectType"-->
<!--          @pathArrChange="pathArrChange"-->
<!--          @activePathChange="activePathChange"-->
<!--          @currentMouseLocation="currentMouseLocation"-->
<!--          @drawCancle="drawCancle"-->
<!--          @returnSearchResult="returnSearchResult"-->
<!--          @returnSelectedBuildings="returnSelectedBuildings"-->
<!--        ></db-map>-->
      </div>
    </div>
    <el-dialog
      class=""
      width="30%"
      title="内层 Dialog"
      :visible.sync="innerVisible"
      append-to-body>
    </el-dialog>
    <div slot="footer" class="dialog-footer right">
      <el-button class="map-btn" @click="$emit('update:mapChooseShow', false)">取 消</el-button>
      <el-button class="map-btn" type="primary">保存</el-button>
      <!-- <el-button type="primary" @click="innerVisible = true">打开内层 Dialog</el-button> -->
    </div>
  </el-dialog>
</template>

<script>

  import leftInfo from "../../../../../cityInsight/cityInsight/leftInfo";
  import drawType from "../../../../../../components/map/drawType";
  import mapPopup from "../../../../../../components/map/mapPopup";
  import dbMap from "../../../../../../components/map/map.vue";
  import SelectBuild from "../../../../../../components/SelectBuild";

  export default {
    components: {
      dbMap,
      leftInfo,
      mapPopup,
      drawType,
      SelectBuild,
    },
    props: {
      mapChooseShow: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        showPathCopy: null, // 当前显示的path
        innerVisible: false
      }
    },
    computed: {
      mapLocation() { // 当前显示弹窗得path
        if (this.showPathCopy && this.showPathCopy.location) {
          let location = this.$refs.dbmap.map.pointToPixel(this.showPathCopy.location)
          return {
            x: location.x - POPUP_WIDTH / 2,
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
  }
</script>

<style lang="scss">
  .map-choose {
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 25px;
      .map-box {
        width: 100%;
        height: 724px;
      }
    }
    .el-dialog__footer {
      padding: 12px 40px 40px 0;
      .map-btn {
        & + .map-btn {
          margin-left: 60px;
        }
        width: 100px;
      }
    }
    .city-select {
      display: inline-block;
      z-index: 999;
      position: absolute;
      left: 40px;
      top: 40px;
    }
    .draw-select {
      display: inline-block;
      z-index: 999;
      position: absolute;
      left: 280px;
      top: 40px;
    }
    .map-popup {
    }
  }
</style>
