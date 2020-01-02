<template>
  <div class="container">
    <div ref="container" class="container"></div>
  </div>
</template>

<script>
  import { scaleData } from '../../utils/static'

  export default {
    name: "index",
    data() {
      return {
        isInit: true, // 控制只初始化促发事件
        labelsArr: [], // 存储label覆盖物的变量 用于清楚label
        map: null,
        points: [],
        pathArr: {},
        indexArr: [],
        pointsOverlayObj: { // 记录已选和未选海量点的对象 用于重画
          selectedOverlay: null,
          unSelectedOverlay: null
        },
        showLabel: 18,
        heatmapOverlay: null,
        activePath: null,
        defaultRadius: 3000,
        drawingManager: null,
        selectedBuildings: [], //当前选中楼盘
        unSelectedBuildings: [], // 当前未选中楼盘
        pointsOptions: {
          0: {
            shape: BMAP_POINT_SHAPE_CIRCLE,
            color: '#F44A4A'
          },
          1: {
            shape: BMAP_POINT_SHAPE_CIRCLE,
            color: 'rgba(158, 158, 158, 0.7)'
          }
        },
        styleOptions: {
          strokeColor: "red",    //边线颜色。
          fillColor: "red",      //填充颜色。当参数为空时，圆形将没有填充效果。
          strokeWeight: 3,       //边线的宽度，以像素为单位。
          strokeOpacity: 1,    //边线透明度，取值范围0 - 1。
          fillOpacity: 0.5,      //填充的透明度，取值范围0 - 1。
          strokeStyle: 'solid' //边线的样式，solid或dashed。
        }
      }
    },
    props: {
      buildings: {
        type: Array,
        required: true
      },
      city: {
        type: Object,
        required: true
      },
      sliderVal: {
        type: Number,
        default: 3000
      },
      budget: {
        type: Number,
        required: true
      },
      currentSelectType: {
        type: Object,
        default: function () {
          return {}
        }
      },
    },
    beforeDestroy() {
      this.removeEvent()
    },
    watch: {
      buildings(val) {
        // this.clearMap()
        if (val.length) {
          this.initMap(val)
        } else {
          this.clearMap()
        }
      },
      activePath(val) {
        this.$emit('activePathChange', val)
      },
      budget() {
        this.drawDevicePoints()
        if (this.activePath !== null) {
          this.$emit('activePathChange', this.activePath)
        }
      },
      selectedBuildings(val) {
        this.$emit('returnSelectedBuildings', val)
      },
      pathArr(val) {
        this.$emit('pathArrChange', val)
      },
    },
    created() {
    },
    mounted() {
      let map = new BMap.Map(this.$refs.container, {enableMapClick: false});
      this.map = map

      this.setCity({name: '成都市'})
      map.enableScrollWheelZoom();
      map.addControl(new BMap.ScaleControl());
      this.mapBindEvent()
    },
    methods: {
      //批量永久删除楼盘数据
      deleteBathItem(allList) {
        allList.forEach((item) => {
          this.points[item.premisesId].type = -3
        })
        this.drawDevicePoints()
        // allList.forEach(item => {
        //   this.unSelectedBuildings.push(item)
        // });
        // this.selectedBuildings = [];
        // this.drawPoints(this.selectedBuildings, this.unSelectedBuildings)
      },
      //批量永久增加楼盘数据
      addBatchItem(allList) {
        // allList.forEach(item => {
        //   this.selectedBuildings.push(item)
        // });
        // for (let i = 0; i < this.unSelectedBuildings.length; i++) {
        //   for (let j = 0; j < allList.length; j++) {
        //     if (allList[j].premisesId === this.unSelectedBuildings[i].premisesId) {
        //       this.unSelectedBuildings.splice(i, 1)
        //       break;
        //     }
        //   }
        // }
        let isExist = false
        allList.forEach((item) => {
          if (this.points[item.premisesId]) {
            if (this.points[item.premisesId].type >= -1) {
              this.points[item.premisesId].type = 100
              isExist = true
            } else {
              this.points[item.premisesId].type = 100
              this.drawDevicePoints()
            }
          } else {
            this.points[item.premisesId] = {point: new BMap.Point(item.lng, item.lat), ...item, type: 100}
            this.drawDevicePoints()
          }
        })
        return isExist
        // this.drawPoints(this.selectedBuildings, this.unSelectedBuildings)
      },
      // 清空pathArr数据 并且清楚覆盖物
      clearPathArr() {
        for (let key in this.pathArr) {
          this.map.removeOverlay(this.pathArr[key].overlay)
          if (this.pathArr[key].anotherOverlay) {
            this.map.removeOverlay(this.pathArr[key].anotherOverlay)
          }
        }
        this.pathArr = {}
      },
      clearMap() {
        this.activePath = null
        this.labelsArr = []
        this.selectedBuildings = [] //当前选中楼盘
        this.unSelectedBuildings = [] // 当前未选中楼盘
        this.indexArr = []
        this.pathArr = {}
        this.map.clearOverlays()
        this.pointsOverlayObj = {
          selectedOverlay: null,
          unSelectedOverlay: null
        }
      },
      initMap(val) {
        this.points = this.normalizePointsAll(val)
        if (Object.keys(this.pathArr).length) {
          for(let key in this.pathArr) {
            this.isInArea(this.pathArr[key])
          }
        }
        this.drawDevicePoints()
      },
      setCity(city) {
        this.map.centerAndZoom(city.name, 12);
      },
      initHotMap() {
        if (this.isInit) {
          let heatmapOverlay = new BMapLib.HeatmapOverlay({"radius": 20});
          this.map.addOverlay(heatmapOverlay);
          this.heatmapOverlay = heatmapOverlay
          this.isInit = false
        }
      },
      location() {
        return new Promise((resolve) => {
          let myCity = new BMap.LocalCity();
          myCity.get((result) => {
            this.initMouse()
            resolve(result)
          });
        })
        // let geolocation = new BMap.Geolocation();
        // let that = this
        // geolocation.getCurrentPosition(function(r){
        //   if(this.getStatus() == BMAP_STATUS_SUCCESS){
        //     console.log(r)
        //     that.map.centerAndZoom(r.point, 12);
        //   }
        //   else {
        //     alert('failed'+this.getStatus());
        //   }
        // });
      },
      // 添加弹窗覆盖物
      drawLabels(arr) {
        arr.forEach((item, index) => {
          this.addLabel(item)
        })
      },
      /*
       * 像已选楼盘中添加楼盘
       * */
      // addItem(item) {
      //   let isExist = false
      //   isExist = this.checkPointIsExist(item, this.selectedBuildings) !== -1 ? true : false
      //
      //   if (!isExist) { // 如果item没在当前选中的楼盘中
      //     this.addPointInSelectedBuildings(item)
      //   }
      //   setTimeout(() => {
      //     this.drawPoints(this.selectedBuildings, this.unSelectedBuildings)
      //   }, 0)
      //
      //   return isExist
      // },
      // 判断一个点是否在可视区域内
      addSigleLabel(item) {
        let bounds = this.map.getBounds()
        let isIn = bounds.containsPoint(item.point)
        if (isIn) {
          this.addLabel(item)
        }
      },
      // 像已选楼盘中加一个点，并且如果他存在在未选楼盘中将他删除
      addPointInSelectedBuildings(item) {
        let index = this.checkPointIsExist(item, this.points)
        if (index === -1) { // 如果不在当前楼盘列表中 添加他的label
          this.addSigleLabel(item)
        }
        let i = this.checkPointIsExist(item, this.unSelectedBuildings)
        if (i !== -1) { // 如果在未选中楼盘列表中 将他删除
          this.unSelectedBuildings.splice(i, 1)
        }
        this.selectedBuildings.push({point: new BMap.Point(item.lng, item.lat), ...item})
      },
      // 检测某一个点是否已存在在已选楼盘中
      checkPointIsExist(item, arr) {
        let i = arr.findIndex((val) => {
          return val.premisesId === item.premisesId
        })
        return i
      },
      /*
       * 在已选楼盘中删除选中的点
       * */
      // deleteItem(item) {
      //   // for (let i = 0; i < this.selectedBuildings.length; i++) {
      //   //   if (item.premisesId === this.selectedBuildings[i].premisesId) {
      //   //     this.selectedBuildings.splice(i, 1)
      //   //     break;
      //   //   }
      //   // }
      //   // this.unSelectedBuildings.push(item)
      //   // this.drawPoints(this.selectedBuildings, this.unSelectedBuildings)
      // },
      // 根据传入的以选中和未选中楼盘重新画数据
      drawPoints(selectP, unSelectP) {
        this.setDevicePoints(selectP, 0)
        this.setDevicePoints(unSelectP, 1)
      },
      /*
       * 根据关键字搜索
       * */
      searchByWord(keyWord) {
        let options = {
          onSearchComplete: ((results) => {
              // 判断状态是否正确
              if (local.getStatus() == BMAP_STATUS_SUCCESS) {
                this.$emit('returnSearchResult', results.Sq)
                local = null
              }
            }
          )
        };
        let local = new BMap.LocalSearch(this.map, options);
        local.search(keyWord);
      },
      /*
       * 隐藏弹窗，即设置activePath为null
       * */
      setActivePathNull() {
        this.activePath = null
      },
      // 将背景点中type为x的设置成y
      changePathPointType(x, y) {
        if (x === null) {
          Object.values(this.points).forEach((item) => {
            if (this.judgePointType(item)) {
              item.type = y
            }
          })
        } else {
          Object.values(this.points).forEach((item) => {
            if (item.type === x) {
              item.type = y
            }
          })
        }
      },
      /*
       *  删除当前选中的path
       * */
      deletePath(item) {
        this.map.removeOverlay(item.overlay)
        if (item.anotherOverlay) {
          this.map.removeOverlay(item.anotherOverlay)
        }
        delete this.pathArr[item.index]
        this.pathArr = {...this.pathArr}
        this.setActivePathNull()
        if (Object.keys(this.pathArr).length) {
          this.changePathPointType(item.index, -2)
        } else {
          this.changePathPointType(null, -1)
        }
        this.drawDevicePoints()
      },
      /*
       * 关闭DrawingManager画线方法 需要在绘画类型切换成圆形时调用
       * */
      closeDrawingManager() {
        if (this.drawingManager) {
          this.drawingManager.close()
        }
      },
      /*
       * 因为折线和多边形是依赖于开源库DrawingManager，
       * 但是元素不能显示，这里手动触发画折线和多边形方法
       * */
      triggerDraw(type) {
        let dom = document.getElementsByClassName(`BMapLib_${type}`)[0]
        dom.click()
      },
      /*
       改变当前path的radius
       */
      changeActivePathRadius(val) {
        this.activePath.radius = val
        this.zoomSinglePathChange(this.activePath)
        this.isInArea(this.activePath)
        this.pathArr[this.activePath.index] = this.activePath
        this.drawDevicePoints()
        this.activePath = Object.assign({}, this.activePath)
        this.$emit('pathArrChange', this.pathArr)
      },
      initMouse() {
        //实例化鼠标绘制工具
        let drawingManager = new BMapLib.DrawingManager(this.map, {
          isOpen: false, //是否开启绘制模式
          enableDrawingTool: true, //是否显示工具栏
          drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
            offset: new BMap.Size(5, 5), //偏离值
            drawingModes: [
              BMAP_DRAWING_POLYLINE,
              BMAP_DRAWING_POLYGON
            ]
          },
          polylineOptions: this.styleOptions, //线的样式
          polygonOptions: this.styleOptions, //多边形的样式
        });
        this.drawingManager = drawingManager
        this.drawComplete(drawingManager)
      },

      RealDistanceTranPixels(distance) {
        let zoom = this.map.getZoom();
        let pixDistance;
        for (let i = 0; i < scaleData.length; i++) {
          if (scaleData[i].zoom === zoom) {
            let scale = scaleData[i].Pixels / scaleData[i].length;
            pixDistance = scale * distance
          }
        }
        return pixDistance
      },
      /*
       画折现背景层
       */
      drawpolylineBg(path, overlay) {
        let radius = this.RealDistanceTranPixels(path.radius)
        let polyline = new BMap.Polyline(path.overlay.getPath(), {
          strokeColor: "red",    //边线颜色。
          strokeWeight: 2 * radius,       //边线的宽度，以像素为单位。
          strokeOpacity: 0.5,    //边线透明度，取值范围0 - 1。
          strokeStyle: 'solid' //边线的样式，solid或dashed。
        });
        let ol = {...path, overlay: polyline, anotherOverlay: overlay}
        this.map.addOverlay(polyline);
        this.overlayBindEvent(ol)
        this.getPopUpData(ol)
      },
      /*
       *折线和多边形画线完成回调函数
       */
      drawComplete(drawingManager) {
        drawingManager.addEventListener("overlaycomplete", (e) => {
          let location = this.map.pixelToPoint(e.currentTarget._mask._draggingMovePixel)
          let path = {
            type: e.drawingMode,
            overlay: e.overlay,
            location: location, // 结束绘制时鼠标的经纬度位置用于显示弹窗位置
            isShow: true,
            index: this.indexArr.length, // 即将是pathArr的第几个元素
            radius: this.defaultRadius, // 这里只有折线会用这个属性，折线的直径就是defaultRadius的两倍
            points: e.overlay.getPath()
          }
          if (e.drawingMode === "polyline") {
            this.drawpolylineBg(path, e.overlay)
          } else {
            this.getPopUpData(path)
            this.overlayBindEvent(path)
          }
          this.$emit('drawCancle')
        });
      },
      /*
       *给新建的Path添加显示隐藏弹窗事件
       */
      overlayBindEvent(path) {
        path.overlay.addEventListener('click', (e) => {
          this.pathArr[path.index].location = e.point
          this.activePath = this.pathArr[path.index]
        })
      },
      /*
       整理得到弹窗所需数据
       */
      getPopUpData(path) {
        this.isInArea(path)
        this.pathArr = {[path.index]: path, ...this.pathArr}
        // this.pathArr[path.index] = path
        this.indexArr[path.index] = path.index // 记录所有画过路径的index数组
        this.drawDevicePoints()
        this.activePath = this.pathArr[path.index]
      },
      /*
       根据楼盘数据 计算出楼盘数据所覆盖的设备数，设备数，预估覆盖人次
       */
      getBuildingData(path) {
        let obj = {deviceCount: 0, coveredPeople: 0}
        path.buildings.forEach((item) => {
          obj.deviceCount += item.signElevatorNum
          obj.coveredPeople += item.totalPeople
        })
        path.deviceCount = obj.deviceCount
        path.coveredPeople = obj.coveredPeople
      },
      /*
       得出在当前操作路径区域内的点
       */
      isInArea(path) {
        let arr = [], points = this.points
        if (path.type === 'polyline') {
          this.filterProjectByPolyline(this.points, path.overlay, path.radius, path.index)
        } else if (path.type === 'polygon') {
          for(let key in points) {
            if (points[key].type < 0 && this.judgePointType(points[key])) {
              let b = points[key].point;
              if (BMapLib.GeoUtils.isPointInPolygon(b, path.overlay)) {
                points[key].type = path.index
              } else {
                points[key].type = -2
              }
            }
          }
          // arr = this.points.filter((item) => {
          //   return BMapLib.GeoUtils.isPointInPolygon(item.point, path.overlay)
          // })
        } else if (path.type === 'circle') {
          for(let key in points) {
            if (points[key].type < 0 && this.judgePointType(points[key])) {
              let b = points[key].point;
              if (BMapLib.GeoUtils.isPointInCircle(b, path.overlay)) {
                points[key].type = path.index
              } else {
                points[key].type = -2
              }
            }
          }
          // arr = this.points.filter((item) => {
          //   return BMapLib.GeoUtils.isPointInCircle(item.point, path.overlay)
          // })
        }
        return arr
      },
      getDian(lan1, lon1, lan2, lon2, len) {
        // 计算矩形四个点经纬度坐标
        let point1 = new BMap.Point(lon1, lan1);
        let point2 = new BMap.Point(lon2, lan2);
        let AB = BMapLib.GeoUtils.getDistance(point1, point2);
        let AC =  Math.sqrt(AB * AB + len * len);
        let sina = (lan2 - lan1) / AB;
        let cosa = (lon2 - lon1) / AB;
        let sinb = len / AC;
        let cosb = AB / AC;
        let sinA = sina * cosb + sinb * cosa;
        let cosA = cosa * cosb - sina * sinb;
        let Ch = sinA * AC;
        let Cw = cosA * AC;
        let lon3 = lon1 + Cw;
        let lan3 = lan1 + Ch;
        return {'lan': lan3, 'lon': lon3};
      },
      getFourP(lan1, lon1, lan2, lon2, len) {
        // 返回一个计算的多边形
        let a = this.getDian(lan1, lon1, lan2, lon2, len);
        let b = this.getDian(lan1, lon1, lan2, lon2, -len);
        let c = this.getDian(lan2, lon2, lan1, lon1, len);
        let d = this.getDian(lan2, lon2, lan1, lon1, -len);
        let lists = [];
        for (let n of [a, b, c, d, a]) {
          lists.push(new BMap.Point(n.lon, n.lan));
        }
        let polygon = new BMap.Polygon(lists);
        return polygon;
      },

      /*
       数组去重
       */
      unique(arr1) {
        const res = new Map();
        let result = arr1.filter((a) => !res.has(a.premisesId) && res.set(a.premisesId, 1))
        return result
      },
      // 根据type判断当前点是否可以被改变
      judgePointType(item) {
        if (item.type !== -3 && item.type !== 100) {
          return true
        } else {
          return  false
        }
      },
      /*
       折现判断点位是否在区域内
       */
      filterProjectByPolyline(points, overlay, radius, index) {
        let polyline = overlay.getPath();
        let len = polyline.length;

        //圆形计算
        // let filterPs = [];
        for (let i in polyline) {
          let circle = new BMap.Circle(polyline[i], radius, this.styleOptions);
          for(let key in points) {
            if (points[key].type < 0 && this.judgePointType(points[key])) {
              let b = points[key].point;
              if (BMapLib.GeoUtils.isPointInCircle(b, circle)) {
                points[key].type = index
              } else {
                points[key].type = -2
              }
            }
          }
          // let filterP = points.filter((p) => {
          //   let b = p.point;
          //   return BMapLib.GeoUtils.isPointInCircle(b, circle);
          // });
          // filterPs = [...filterP, ...filterPs];
        }
        // 未选 多边形计算
        let polygons = [];
        for (let k in polyline) {
          let kk = parseInt(k);
          if (kk >= len - 1) break;
          let lat1 = polyline[kk].lat;
          let lng1 = polyline[kk].lng;
          let lat2 = polyline[parseInt(kk + 1)].lat;
          let lng2 = polyline[parseInt(kk + 1)].lng;
          // 得到折线上所有多边形集合
          polygons.push(this.getFourP(lat1, lng1, lat2, lng2, radius));
        }
        for (let j in polygons) {
          for(let key in points) {
            if (points[key].type < 0 && this.judgePointType(points[key])) {
              let b = points[key].point;
              if (BMapLib.GeoUtils.isPointInPolygon(b, polygons[j])) {
                points[key].type = index
              } else {
                points[key].type = -2
              }
            }
          }
        }
        // let result = this.unique(filterPs)
        // return result
      },

      closePathWindow(arr) {
        arr.forEach((item) => {
          item.isShow = false
        })
      },

      zoomChangeAllPath() {
        for (let key in this.pathArr) {
          if (this.pathArr[key].type === 'polyline') { // 只有折线需要在改变zoom时变半径，圆和多边形都是自动变的
            this.zoomSinglePathChange(this.pathArr[key])
          }
        }
      },

      zoomSinglePathChange(path) {
        if (path.type === 'polygon') return
        let radius = this.RealDistanceTranPixels(path.radius)
        if (path.type === 'polyline') {
          path.overlay.setStrokeWeight(2 * radius)
        } else if (path.type === 'circle') {
          path.overlay.setRadius(path.radius)
        }
      },

      getVisualPoint() {
        let bounds = this.map.getBounds()
        let arr = Object.values(this.points).filter((item) => {
          return bounds.containsPoint(item.point)
        })
        this.drawLabels(arr)
      },
      removeLabels() {
        if (!this.labelsArr.length) return
        this.labelsArr.forEach((item) => {
          this.map.removeOverlay(item.label)
        })
        this.labelsArr = []
      },
      drawLabelsByVisual() {
        let zoom = this.map.getZoom()
        if (zoom >= this.showLabel) {
          this.removeLabels()
          this.getVisualPoint()
        } else {
          this.removeLabels()
        }
      },
      removeEvent() {
        this.map.removeEventListener('dragend', this.drawLabelsByVisual)
        this.map.removeEventListener('click', this.mapLeftClick)
        this.map.removeEventListener('zoomend', this.mapZoomEnd)
        this.map.removeEventListener('mousemove', this.mapMouseMove)
        this.map.removeEventListener('rightclick', this.mapRightClick)
      },

      mapLeftClick(event) {
        if (this.currentSelectType && this.currentSelectType.type === 'circle') {
          // 地址逆解析
          new BMap.Geocoder().getLocation(event.point, (rs) => {
            this.drawCircle(event.point, rs.address)
          })
          this.$emit('drawCancle')
        }
      },
      mapZoomEnd() {
        this.drawLabelsByVisual()
        this.zoomChangeAllPath()
      },
      mapMouseMove(event) {
        if (this.currentSelectType !== null) {
          this.$emit('currentMouseLocation',  event.pixel)
        }
      },
      mapRightClick(event) {
        if (this.currentSelectType && this.currentSelectType.type === 'circle') {
          this.$emit('drawCancle')
        }
      },
      tilesloaded() {
        this.initHotMap()
      },
      mapBindEvent() {
        this.map.addEventListener('dragend', this.drawLabelsByVisual)
        this.map.addEventListener('zoomend', this.mapZoomEnd)
        this.map.addEventListener('click', this.mapLeftClick)
        this.map.addEventListener('mousemove', this.mapMouseMove)
        this.map.addEventListener('rightclick', this.mapRightClick)
        this.map.addEventListener('tilesloaded', this.tilesloaded)
      },
      drawCircle(point, info) {
        let marker = this.addMarker(point)
        let circle = new BMap.Circle(point, this.defaultRadius, this.styleOptions);
        this.map.addOverlay(circle);
        let path = {
          type: 'circle',
          overlay: circle,
          anotherOverlay: marker,
          location: point, // 结束绘制时鼠标的经纬度位置用于显示弹窗位置
          isShow: true,
          index: this.indexArr.length,
          radius: this.defaultRadius,
          points: circle.getCenter()
        }
        if (this.$tools.type(info) === 'object') {
          path.name = info.title
          path.address = info.address
        } else {
          path.address = info
        }
        this.getPopUpData(path)
        this.overlayBindEvent(path)
      },
      addMarker(point) {  // 创建图标对象
        var myIcon = new BMap.Icon(require('@/assets/images/icon_location.png'), new BMap.Size(12, 22), {});
        // 创建标注对象并添加到地图
        let marker = new BMap.Marker(point, {
          icon: myIcon,
          offset: new BMap.Size(6, -11),
        });
        this.map.addOverlay(marker);
        return marker
      },
      // 隐藏热力图
      hideHotMap() {
        if (this.heatmapOverlay) {
          this.heatmapOverlay.hide();
        }
      },
      showHotMap() {
        if (this.heatmapOverlay) {
          this.heatmapOverlay.show();
        }
      },
      // 热力图
      drawHotMap(arr) {
        this.heatmapOverlay.setDataSet({data:arr, max:100});
      },
      normalizePointsAll(arr) {
        let obj = {}
        arr.forEach((item) => {
          obj[item.premisesId] = {point: new BMap.Point(item.lng, item.lat), ...item, type: -1}
        })
        return obj
      },
      /*
       * 根据预算随机得到已选的楼盘数据
       * */
      drawDevicePoints() {
        let selectP = [], unSelectP = []

        Object.values(this.points).forEach((item) => {
          if (item.type < -1) {
            unSelectP.push(item)
          } else {
            selectP.push(item)
          }
        })

        this.drawBg(selectP, unSelectP)

        // if (!Object.keys(this.pathArr).length) {
        //   if (this.budget === 1) {
        //     this.drawBg(Object.values(this.points), [])
        //   } else {
        //     // let [selectP, unSelectP] = this.getRandomBuildings(this.points, this.budget)
        //     // this.drawBg(selectP, unSelectP)
        //   }
        // } else {
        //   let selectedBuildings = []
        //   if (this.budget === 1) {
        //     for (let key in this.pathArr) {
        //       this.pathArr[key].selectedBuildings = this.pathArr[key].buildings
        //       selectedBuildings = selectedBuildings.concat(this.pathArr[key].selectedBuildings)
        //     }
        //   } else {
            // for (let key in this.pathArr) {
            //   this.pathArr[key].selectedBuildings = this.getRandomBuildings(this.pathArr[key].buildings, this.budget)[0]
            //   selectedBuildings = selectedBuildings.concat(this.pathArr[key].selectedBuildings)
            // }
          // }
          // let result = this.unique(selectedBuildings)
          // this.separateBgPonits(result)
        // }
      },
      /*
       * 根据当前选中的点 将背景点分为已选和未选 然后分别绘画
       * */
      // separateBgPonits(arr) {
      //   let selected = {}, unSelected = {}
      //   arr.forEach((item) => {
      //     selected[item.premisesId] = item
      //   })
      //   this.points.forEach((item) => {
      //     if (!selected[item.premisesId]) {
      //       unSelected[item.premisesId] = item
      //     }
      //   })
      //   this.drawBg(Object.values(selected), Object.values(unSelected))
      // },
      /*
       * 传已选及未选的点画背景点
       * */
      /*
       * 画背景点
       * */
      drawBg(selectP, unSelectP) {
        this.selectedBuildings = selectP
        this.unSelectedBuildings = unSelectP
        this.drawPoints(selectP, unSelectP)
      },
      /*
       * 根据pointsOverlayObj里面存在的背景海量点 清空海量点图层
       * */
      clearPoints() {
        for (let key in this.pointsOverlayObj) {
          if (this.pointsOverlayObj[key]) {
            this.pointsOverlayObj[key].clear()
          }
        }
      },
      /*
       * 得到已选的楼盘数据
       * */
      getRandomBuildings(arr, percent) {
        let arrCopy = this.$tools.deepCopy(arr),
          len = arr.length,
          num = len * percent,
          result = []

        while (result.length < num) {
          let val = parseInt(Math.random() * arrCopy.length, 10)
          result.push(arrCopy[val])
          arrCopy.splice(val, 1)
        }
        return [result, arrCopy]
      },
      // 添加lable
      addLabel(point) {
        let labelStyle = {
          border: 'none',
          transform: 'translateY(-100%) translateX(-50%)'
        };
        // <i
        //   style="height: 16px;width: 16px;color: #ededed;display: block"
        // class="icon-error2 labelHide iconfont"
        //   data-point = ${point}
        // ></i>
        let content = `
          <div style="
            padding: 17px 0 21px;
            background: #fff;
            font-size:14px;
            line-height: 1.15;
            width:170px;
            border:1px solid rgba(229,231,233,1);
            box-shadow:0px 3px 5px 0px rgba(0, 0, 0, 0.1);
            border-radius:4px;"
          >
              <div style="padding: 0 15px 14px;border-bottom: 1px solid #FFE5E7E9">
                <div class="mid-between">
                  <p style="max-width: 120px;" class="text-ellipsis">${point.premisesName}</p>
                </div>
              </div>
              <div style="padding: 0 15px 0;">
                <div class="mid-between" style="color: #999999FF;margin-top: 15px">
                  <p>楼栋数</p>
                  <p class="font-number">${point.buildNum}</p>
                </div>
                <div class="mid-between" style="color: #999999FF;margin-top: 15px">
                  <p>单元数</p>
                  <p class="font-number">${point.unitNum}</p>
                </div>
                <div class="mid-between" style="color: #999999FF;margin-top: 15px">
                  <p>点位数</p>
                  <p class="font-number">${point.signElevatorNum}</p>
                </div>
                <div class="mid-between" style="color: #999999FF;margin-top: 15px">
                  <p>覆盖人数</p>
                  <p class="font-number">${point.totalPeople}</p>
                </div>
<!--                <p class="color-main text-center" style="margin-top: 34px">更多</p>-->
              </div>
            </div>
        `
        //用于设置样式
        let label = new BMap.Label(content, {
          offset: new BMap.Size(-5, -15),
          position: point.point
        });
        label.setStyle(labelStyle);

        label.addEventListener('click', (event) => {
          this.$emit('buildingClick', point)
        })
        this.labelsArr.push({label: label, isShow: true})
        this.map.addOverlay(label)
      },

      // 为海量点添加点击事件
      pointEvent(event) {
        let zoom = this.map.getZoom()
        if (zoom >= this.showLabel) {
          this.labelsArr.forEach((item, index) => {
            if (item.label.getPosition().equals(event.point.point)) {
              if (this.labelsArr[index].isShow) {
                this.labelsArr[index].label.hide()
                this.labelsArr[index].isShow = false
              } else {
                this.labelsArr[index].label.show()
                this.labelsArr[index].isShow = true
              }
            }
          })
        }
      },
      /*
       * 画背景点方法 0：已选 1：未选
       * */
      setDevicePoints(points, type) {
        let str = type === 0 ? 'selected' : 'unSelected'
        let overlay = `${str}Overlay`
        if (!this.pointsOverlayObj[overlay]) {
          let pointsOverlay = new BMap.PointCollection(points, this.pointsOptions[type]);
          this.pointsOverlayObj[overlay] = pointsOverlay
          this.map.addOverlay(pointsOverlay);
          pointsOverlay.addEventListener('click',  this.pointEvent);
        } else {
          if (points.length === 0) {
            this.pointsOverlayObj[overlay].removeEventListener('click',  this.pointEvent);
            this.pointsOverlayObj[overlay].clear()
          } else {
            this.pointsOverlayObj[overlay].clear()
            this.pointsOverlayObj[overlay].setPoints(points)
          }
        }
      },
    }
  }
</script>

<style scoped lang='scss'>
  .map-mask {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 10;
    background: #fff;
  }
</style>
