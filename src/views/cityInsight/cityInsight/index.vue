<template>
    <div class="container cityInsight" v-loading="loading">
      <div class="left-info mid">
        <left-info
          :isShow="isShow"
          :city="cityFilter"
          @toggle="toggle"
        ></left-info>
        <draw-type
          ref="drawType"
          @searchDrawTypeClick="searchDrawTypeClick"
          @drawTypeSelect="drawTypeSelect"
          @querySearchAsync="querySearchAsync"
        ></draw-type>
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
          <div class="filter-popup clearfix mid">
            <div style="width: 106px;height: 100%;align-self: flex-start">
              <left-tab
                :lineHeight="42"
                :tabData="tabData"
                :activeTab="activeTab"
                @changeTab="changeTab"
              ></left-tab>
            </div>
            <div>
              <people-insight
                @hide="hide(1)"
                v-if="leftShow[0]"
                ref="peopleInsight"
                v-show="activeTab === 0"
                @switchChange="switchChange"
                @returnResult="(val) => returnResult(val, 2)"
              ></people-insight>
              <multiple-selectPopUp
                v-if="leftShow[1]"
                ref="tagsSelect"
                v-show="activeTab === 1"
                :selectDatas="buildingDatas"
                :filters="buildingFilter"
                @returnResult="(val) => returnResult(val, 1)"
                @hide="() => hide(1)"
              ></multiple-selectPopUp>
            </div>
          </div>
        </div>
      </div>
<!--      <div>-->
<!--        <top-select></top-select>-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->
<!--      <div class="draw-type">-->
<!--        -->
<!--      </div>-->
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
<!--      <div class="right-info">-->
        <slide-container
          ref="slideCon"
        >
          <right-info
            v-show="rightShow === 0"
            :selectedBuildings="selectedBuildings"
            @addBtnClick="addBtnClick"
            @createPackage="createPackage"
            @deleteItem="deleteItem"
          ></right-info>
          <building-detail
            v-show="rightShow === 1"
            @back="rightBack"
            ref="buildingDetail"
          ></building-detail>
        </slide-container>
<!--      </div>-->
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
      <div class="create-dialog">
        <create-dialog
          ref="createDialog"
          :city="cityFilter"
          :data="selectedBuildings"
          @createSuc="createSuc"
        ></create-dialog>
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
  const CITY_MAPPING = {
    1: '一线城市:',
    2: '二线城市:',
    3: '三线城市:'
  }

  import dbMap from '../../../components/map/map.vue'
  import mapPopup from "../../../components/map/mapPopup";
  import rightInfo from "./rightInfo";
  import drawType from "../../../components/map/drawType";
  import leftInfo from "./leftInfo";
  // import leftSelect from "./leftSelect";
  import mouseMoveText from "./mouseMoveText";
  import createDialog from "./createDialog";
  import buildingDetail from "./buildingDetail";
  import slideContainer from "../../../components/slideContainer";
  import addDialog from "./addDialog";
  import topSelect from "./topSelect";
  import peopleInsight from "./peopleInsight";
  import leftTab from "../../../components/leftTab";
  import multipleSelectPopUp from "../../../components/map/multipleSelectPopUp";
  import singleSelectPopup from "../../../components/map/singleSelectPopup";

  const NAV_HEIGHT = 76,
    ANOTHER_HEIGHT = 10,
    POPUP_WIDTH = 240

  export default {
    name: "index",
    components: {
      dbMap,
      leftTab,
      addDialog,
      mapPopup,
      drawType,
      peopleInsight,
      multipleSelectPopUp,
      singleSelectPopup,
      buildingDetail,
      createDialog,
      slideContainer,
      leftInfo,
      // leftSelect,
      rightInfo,
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
                {label: '800以上', key: 3}
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
        leftShow: [false, false], // 控制筛选弹出框的加载
        currentPonents: null,
        tabData: [
          {name: '人群洞察', value: 0},
          {name: '楼盘筛选', value: 1},
          // {name: '门店导入', value: 2},
        ],
        points: [], // 当前所有的楼盘点位数据
        cityDatas: [], // 城市数据
        isShow: { // 控制左边弹出框显示
          0: false,
          1: false
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
          'polyline': 246,
          'polygon': 121,
          'circle': 310 // 402 + 22圆形时弹窗位置为弹窗高度加图标高度
        }
      }
    },
    created() {
      this.loading = true
    },
    mounted() {
      this.init()
      this.bindEvent()
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
        if(!this.leftShow[val.value]) {
          this.leftShow[val.value] = true
        }
        this.activeTab = val.value
      },
      loadHotMap(id) {
        this.$api.peopleInsight.getPeopleInsightHotMap({id: id}).then((data) => {
          if (data.result) {
            this.$refs.dbmap.drawHotMap(data.result)
          } else {
            this.switchChange(false)
          }
        })
      },
      // 隐藏热力图
      hideHotMap() {
        this.$refs.dbmap.hideHotMap()
      },
      resetHotMap() {
        this.switchChange(false)
        this.$refs.peopleInsight.resetSelect()
      },
      resetTags() {
        if (this.buildingFilter.isSelected) { // 如果标签选择过，则清空标签选择结果
          this.$refs.tagsSelect.operate(0)
        }
      },
      resetLeftPopup(index) {
        if (index === 0) {
          this.buildingFilter.isSelected = false
          this.buildingFilter = {
            buildType: [],
            premiseAvgFee: [],
            occupancyRate: [],
            buildingAge: [],
            parkingNum: [],
            propertyRent: []
          }
          this.rightShow = 0
          this.activeTab = 0
          this.leftShow = new Array(this.leftShow.length).fill(false)
          this.loadData()
        } else if (index === 1) {
          this.resetHotMap()
        } else if (index === 2) {
          this.resetTags()
        }
      },
      // 各种弹窗返回数据触发方法 type表示楼盘标签是 false清空还是true选择
      returnResult(val, index, type) {
        console.log(val, index, type)
        if (index === 0) { // 城市切换
          this.cityFilter = val
        } else if (index === 1) { // 楼盘标签选择
          if (type === 0) {
            this.buildingFilter.isSelected = false
          } else {
            this.buildingFilter.isSelected = true
          }
          this.$refs.dbmap.setCity(this.cityFilter)
          this.buildingFilter = val
          this.loadData()
          this.hide(1)
        } else if (index === 2) { // 热力图选择
          this.loadHotMap(val)
          this.hide(1)
        }
        this.resetLeftPopup(index, type)
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
          // this.cityFilter = Object.assign({}, this.cityFilter, {name: '北京市'})
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
        console.log(val, type)
        if (type === 0) {
          this.cityFilter = val
        }
      },
      loadData() {
        this.loading = true
        this.$api.cityInsight.getPremisesByCity({cityCode: this.cityFilter.cityCode, tag: this.buildingFilter}).then((data) => {
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
      },
      // 楼盘详情窗口点击返回按钮
      rightBack() {
        this.rightShow = 0
      },
      // 某个building被点击触发事件
      buildingClick(item) {
        this.$refs.slideCon.showPanel()
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
        if (type === 'circle') {
          this.hideAll()
          this.currentSelectType = {type: type}
          this.$refs.dbmap.closeDrawingManager()
        } else if (type === 'select') {
          console.log(location)
          this.$refs.dbmap.closeDrawingManager()
          this.$refs.dbmap.drawCircle(location.point, location)
        } else {
          this.hideAll()
          this.currentSelectType = {type: type}
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
    top: 20px;
    left: 258px;
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
    /*position: absolute;*/
    z-index: 3;
    /*top: 0;*/
    height: 100%;
    /*right: 0;*/
  }
  .left-info {
    position: absolute;
    z-index: 3;
    top: 20px;
    left: 36px;
    .filter-popup {
      /*height: 490px;*/
      background: #ffffff;
    }
    .select-style {
      position: absolute;
      top: 60px;
    }
    .city-select {
      left: 0px;
    }
    .filter-container {
      left: 113px;
    }
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
