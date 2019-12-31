<template>
  <div>
    <div class="map-box">
      <div class="city-build-select">
        <div class="left-info">
          <left-info
            :isShow="isShow"
            :city="cityFilter"
            @toggle="toggle"
          ></left-info>
          <div class="city-select select-style" v-show="isShow[0]">
            <singleSelect-popup
              ref="citySelect"
              title="城市列表"
              :selectDatas="cityDatas"
              :filters="cityFilter"
              @hide="() => hide(0)"
              @returnResult="(val) => returnResult(val, 0)"
            ></singleSelect-popup>
          </div>
          <div class="filter-container select-style" v-show="isShow[1]">
            <div class="mid-start filter-popup">
              <div style="height: 100%;">
                <left-tab
                  :lineHeight="42"
                  :tabData="tabData"
                  :activeTab="10"
                ></left-tab>
              </div>
              <div class="flex1">
                <multiple-selectPopUp
                  :selectDatas="buildingDatas"
                  :filters="buildingFilter"
                  @returnResult="(val) => returnResult(val, 1)"
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
          @searchDrawTypeClick="searchDrawTypeClick"
          @drawTypeSelect="drawTypeSelect"
          @querySearchAsync="querySearchAsync"
        ></draw-type>
      </div>
      <div class="mapPopup">
        <map-popup v-if="showPathCopy"
                   @sliderChange="sliderChange"
                   @operate="operate"
                   :item="showPathCopy"
                   :style="{top: mapLocation.y+'px', left: mapLocation.x+ 'px'}"></map-popup>
      </div>
      <div class="mouseMove-text" :style="{
          'top': location.y + 10 + 'px',
          'left': location.x + 10 + 'px'
          }">
        <mouseMove-text
          v-if="currentSelectType"
          ref="mouseMoveText"
          :currentSelectType="currentSelectType">
        </mouseMove-text>
      </div>
      <div class="right-select-build">
        <select-build :selectedBuildings="selectedBuildings" :allBuildings="allBuildings" @deleteItem="deleteItem"
                      @addItem="addItem" @deleteBathItem="deleteBathItem" @addBatchItem="addBatchItem"></select-build>
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
          :buildings="points"
          :budget="budget"
          :city="cityFilter"
          :currentSelectType="currentSelectType"
          @buildingClick="buildingClick"
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
      <el-button class="map-btn" @click="hideMapPoint">取 消</el-button>
      <el-button class="map-btn" type="primary" @click="submitBuildPoint">保存</el-button>
      <!-- <el-button type="primary" @click="innerVisible = true">打开内层 Dialog</el-button> -->
    </div>
  </div>
</template>
<script>
  const CITY_MAPPING = {
    1: '一线城市:',
    2: '二线城市:',
    3: '三线城市:'
  }
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

  const NAV_HEIGHT = 76
  const ANOTHER_HEIGHT = 10
  const POPUP_WIDTH = 240

  export default {
    name: "mapChooseShow",
    props: {
      mapChooseShow: {
        type: Boolean,
        default: true,
      },
    },
    components: {
      dbMap,
      leftTab,
      addDialog,
      mapPopup,
      drawType,
      multipleSelectPopUp,
      singleSelectPopup,
      buildingDetail,
      createDialog,
      slideContainer,
      leftInfo,
      SelectBuild,
      topSelect,
      mouseMoveText
    },
    data() {
      return {
        buildingDatas: { // 楼宇标签
          title: '楼宇标签',
          options: [
            {
              title: '楼宇类型',
              key: 'buildType',
              types: [
                {label: '中高端住宅', key: 0},
                {label: '商住楼', key: 1},
                {label: '综合体', key: 2},
                {label: '写字楼', key: 3},
              ]
            },
            {
              title: '平均房价',
              key: 'premiseAvgFee',
              types: [
                {label: '1万以下', key: 0},
                {label: '1-1.5万', key: 1},
                {label: '1.5-2万', key: 2},
                {label: '2-2.5万', key: 3},
                {label: '2.5-3万', key: 4},
                {label: '3万以上', key: 5},
              ]
            },
            {
              title: '入住率(%)',
              key: 'occupancyRate',
              types: [
                {label: '70-80%', key: 0},
                {label: '80%-90%', key: 1},
                {label: '90%以上', key: 2},
              ]
            },
            {
              title: '楼龄(年)',
              key: 'buildingAge',
              types: [
                {label: '5年以内', key: 0},
                {label: '5-10年', key: 1},
                {label: '10年以上', key: 2}
              ]
            },
            {
              title: '车位数(个)',
              key: 'parkingNum',
              types: [
                {label: '低于200', key: 0},
                {label: '200-500', key: 1},
                {label: '5000-800', key: 2},
                {label: '800以上', key: 2}
              ]
            },
            {
              title: '物业费(元)',
              key: 'propertyRent',
              types: [
                {label: '2元以下', key: 0},
                {label: '2-3元', key: 1},
                {label: '3元以上', key: 2}
              ]
            },
          ]
        },
        activeTab: 0,
        tabData: [
          {name: '楼盘筛选', value: 1},
        ],
        points: [], // 当前所有的楼盘点位数据
        cityDatas: [], // 城市数据
        isShow: { // 控制左边弹出框显示
          0: false,
          1: true
        },
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
        allBuildings: []
      }
    },
    mounted() {
      this.init()
      this.bindEvent()
      this.hideAll()
    },
    watch: {
      cityFilter(val) {
        this.$refs.dbmap.setCity(val)
      },
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
    methods: {
      //隐藏地图选点页面
      hideMapPoint() {
        this.$emit("hideMapPoint", false);
      },
      //选中的楼盘数据保存
      submitBuildPoint() {
        this.$emit("submitSelectedBuildPoint", this.selectedBuildings, this.cityFilter);
        this.$emit("hideMapPoint", false);
      },
      // 添加资源包成功后触发事件
      createSuc() {
        this.$refs.dbmap.clearPathArr()
        this.$refs.dbmap.drawDevicePoints()
      },
      // 查找选点按钮点击
      searchDrawTypeClick() {
        this.currentSelectType = null
        this.hideAll()
      },
      // 热力图开关切换
      switchChange(val) {
        if (val) {
          this.$refs.dbmap.showHotMap()
        } else {
          this.$refs.dbmap.hideHotMap()
        }
      },
      // 筛选中菜单改变
      changeTab(val) {
        this.activeTab = val.value
      },
      returnResult(val, index) {
        if (index === 0) {
          this.cityFilter = val
          this.loadData()
        } else if (index === 1) {
          this.buildingFilter = val
          this.loadData()
          this.hide(index)
        }
      },
      hideAll() {
        for (let key in this.isShow) {
          this.isShow[key] = false
        }
      },
      // 当点击筛选或者选择城市的时候取消drawType中的选择
      cancleDrawType() {
        this.$refs.drawType.hide()
        this.$refs.dbmap.closeDrawingManager()
        this.currentSelectType = null
      },
      toggle(val) {
        if (this.isShow[val]) {
          this.hide(val)
        } else {
          this.cancleDrawType()
          this.hideAll()
          this.isShow[val] = true
          if (val === 1) {
            if (!this.leftShow[0]) {
              this.leftShow[0] = true
            }
          }
        }
      },
      hide(val) {
        console.log(val)
        this.isShow[val] = false
      },
      getCityFilter() {
        this.$refs.dbmap.location().then((data) => {
          this.cityFilter = Object.assign({}, this.cityFilter, {name: data.name})
        })
      },
      loadCitys() {
        new Promise((resolve, reject) => {
          this.$api.CityList.TypeList().then((data) => {
            if (data.result) {
              this.cityDatas = data.result.map((item) => {
                return {title: CITY_MAPPING[item.level], values: item.citys}
              })
            } else {
              this.cityDatas = []
            }
            this.getCityFilter()
            resolve()
          })
        })
      },
      // 左边传出信息
      leftInfoCallBak(val, type) {
        if (type === 0) {
          this.cityFilter = val
        }
      },
      loadData() {
        this.loading = true
        this.$api.cityInsight
            .getPremisesByCity({cityCode: this.cityFilter.cityCode, tag: this.buildingFilter})
            .then((data) => {
              if (data.result) {
                this.points = data.result
              } else {
                this.points = []
              }
              this.loading = false
            })
      },
      // 初始化
      init() {
        this.loadCitys()

        // this.cityFilter = this.$refs.citySelect.findItem(this.cityFilter, this.cityDatas)
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
      //增加某个楼盘
      addItem(item) {
        this.$refs.dbmap.addItem(item)
      },
      //批量删除多个楼盘
      deleteBathItem(allList) {
        this.$refs.dbmap.deleteBathItem(allList)
      },
      //批量增加多个楼盘
      addBatchItem(allList) {
        this.$refs.dbmap.addBatchItem(allList)
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
        let allPointList = []
        let allPointDiff = []
        for (let key in this.pathArr) {
          // skip loop if the property is from prototype
          if (!this.pathArr.hasOwnProperty(key)) continue;
          let obj = this.pathArr[key];
          for (let prop in obj) {
            // skip loop if the property is from prototype
            if (!obj.hasOwnProperty(prop)) continue;
            if (prop === 'buildings') {
              obj[prop].forEach(item => {
                if (!allPointDiff[item['premisesId']]) {
                  allPointList.push(item)
                  allPointDiff[item['premisesId']] = true;
                }
              })
            }
          }
        }
        this.allBuildings = allPointList
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
  .dialog-footer {
    padding-top: 10px;
    text-align: right;
    .el-button {
      width: 136px;
      height: 34px;
      border-radius: 2px;
    }
  }
  .map-choose {
    top: -10%;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 10px;
      .map-box {
        width: 100%;
        height: calc(100vh - 140px);
        position: relative;
        overflow: hidden;
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
            color: $color-text;
            font-weight: bold;
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
