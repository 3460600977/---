<template>
  <el-dialog
    :visible.sync="mapChooseShow"
    width="98%"
    class="map-choose">
    <div class="map-box">
      <div class="city-select">
        <left-info
          :cityFilter="cityFilter"
          @returnResult="leftInfoCallBak"></left-info>
      </div>
      <div class="draw-select">
        <draw-type ref="drawType" @drawTypeSelect="drawTypeSelect" @querySearchAsync="querySearchAsync"></draw-type>
      </div>
      <div class="right-select-build">
        <select-build :selectedBuildings="selectedBuildings"></select-build>
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
    </div>
    <div slot="footer" class="dialog-footer right">
      <el-button class="map-btn" @click="$emit('update:mapChooseShow', false)">取 消</el-button>
      <el-button class="map-btn" type="primary" @click="submitBuildPoint">保存</el-button>
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
        cityFilter: { // 当前城市信息
          cityCode: null,
          name: null
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
        },
        selectBuildPoint: null,
      }
    },
    mounted() {
      //this.init()
      this.bindEvent()
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
    watch: {
      cityFilter(val) {
        // console.log(val)
      },
    },
    methods: {
      setLocalStorage: function (name, data) {
        return localStorage.setItem(name, JSON.stringify(data));
      },
      getLocalStorage: function (name) {
        return JSON.parse(localStorage.getItem(name));
      },
      //用户选点完成，提交选点数据
      submitBuildPoint() {
        this.setLocalStorage(this.localKey, this.selectBuildPoint)
      },
      // 左边传出信息
      leftInfoCallBak(val, type) {
        console.log(val, type)
        if (type === 0) {
          this.cityFilter = val
        }
      },
      loadData() {
        this.loading = true
        this.$api.cityInsight.getPremisesByCity({cityCode: '510100', tag: this.filters}).then((data) => {
          if (data.result) {
            this.points = this.normalizePointsAll(data.result)
            if (Object.keys(this.pathArr).length) {
              for (let key in this.pathArr) {
                this.pathArr[key].buildings = this.isInArea(this.pathArr[key])
              }
            }
            // this.drawLabels(this.points)
            this.drawDevicePoints()
          } else {
            this.clearPoints()
          }
          this.loading = false
        })
      },
      // 初始化
      init() {
        this.$refs.dbmap.location().then((data) => {
          this.cityFilter = Object.assign({}, this.cityFilter.name, {name: data.name})
        })
      },
      // 楼盘详情窗口点击返回按钮
      rightBack() {
        this.rightShow = 0
      },
      // 某个building被点击触发事件
      buildingClick(item) {
        this.$refs.buildingDetail.loadData(item.premisesId)
        this.rightShow = 1
      },
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

<style lang="scss">
  .map-choose {
    top: -10%;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 25px 25px 15px 25px;
      .map-box {
        width: 100%;
        height: 564px;
      }
    }
    .el-dialog__footer {
      padding: 12px 40px 20px 0;
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
