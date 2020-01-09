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
        markerArr: [], // 存储marker覆盖物的变量 用于清除marker
        // isInit: true, // 控制只初始化促发事件
        labelsArr: [], // 存储label覆盖物的变量 用于清楚label
        map: null,
        points: [],
        pathArr: {},
        indexArr: [],
        pointsOverlayObj: { // 记录已选和未选海量点的对象 用于重画
          selectedOverlay: null,
          unSelectedOverlay: null,
          isShow: false
        },
        showLabel: 18,
        heatmapOverlay: null,
        activePath: null,
        defaultRadius: 3000,
        drawingManager: null,
        selectedBuildings: [], //当前选中楼盘
        pointsOptions: {
          0: {
            shape: BMAP_POINT_SHAPE_CIRCLE,
            color: '#F44A4A',
          },
          1: {
            shape: BMAP_POINT_SHAPE_CIRCLE,
            color: 'rgba(158, 158, 158, 0.7)',
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
      this.drawingManager = {}
      this.map.clearOverlays()
      this.map = null
    },
    watch: {
      buildings(val) {
        // if (val.length) {
          this.initMap(val)
        // }
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
      // this.initHotMap()
      this.mapBindEvent()
    },
    methods: {
      //批量永久删除楼盘数据
      deleteBathItem(allList, type = -3) {
        allList.forEach((item) => {
          this.points[item.premisesId].type = type
        })
        this.jugDraw()
      },
      jugDraw() {
        this.drawDevicePoints()
        if (!this.pointsOverlayObj.isShow) {
          this.drawMarkers()
        }
      },
      //批量永久增加楼盘数据
      addBatchItem(allList, type = 100) {
        let isSelected = false
        allList.forEach((item) => {
          if (this.points[item.premisesId]) {
            if (this.points[item.premisesId].type >= -1) {
              this.points[item.premisesId].type = type
              isSelected = true
            } else {
              this.points[item.premisesId].type = type
            }
          } else {
            this.points[item.premisesId] = {point: new BMap.Point(item.lng, item.lat), ...item, type: type}
          }
        })
        if (allList.length === 1) {
          if (!isSelected) {
            this.jugDraw()
          }
          return isSelected
        } else {
          this.jugDraw()
        }
      },
      // 清空pathArr数据 并且清楚覆盖物
      clearPathArr(type = 0) {
        for (let key in this.pathArr) {
          this.map.removeOverlay(this.pathArr[key].overlay)
          if (this.pathArr[key].anotherOverlay) {
            this.map.removeOverlay(this.pathArr[key].anotherOverlay)
          }
        }
        this.pathArr = {}
        if (type === 0) {
          this.changePathPointType(null, -1)
          this.jugDraw()
        }
      },
      clearMap() {
        this.activePath = null
        this.removeLabels()
        this.removeMarkers()
        this.selectedBuildings = [] //当前选中楼盘
        this.indexArr = []
        this.hideHotMap()
        this.clearPathArr(1)
        this.pointsOverlayObj.isShow = false
      },
      reGetAreaPoint() {
        if (Object.keys(this.pathArr).length) {
          for(let key in this.pathArr) {
            this.isInArea(this.pathArr[key])
          }
        }
      },
      initMap(val) {
        this.points = this.normalizePointsAll(val)
        this.pointsOverlayObj.isShow = true
        this.reGetAreaPoint()
        this.jugDraw()
      },
      setCity(city) {
        this.map.centerAndZoom(city.name, 12);
      },
      initPointOverlaySingle(type) {
        let str = type === 0 ? 'selected' : 'unSelected'
        let overlay = `${str}Overlay`
        let pointsOverlay = new BMap.PointCollection([], this.pointsOptions[type]);
        this.pointsOverlayObj[overlay] = pointsOverlay
        this.map.addOverlay(pointsOverlay);
        pointsOverlay.disableMassClear()
        pointsOverlay.addEventListener('mouseover',  this.pointEvent);
        pointsOverlay.addEventListener('mouseout',  this.pointEventOut);
        pointsOverlay.addEventListener('click',  this.pointEventClick);
      },
      initPointsOverlay() {
        this.initPointOverlaySingle(0)
        this.initPointOverlaySingle(1)
      },
      initHotMap() {
        if (this.heatmapOverlay) return;
        let heatmapOverlay = new BMapLib.HeatmapOverlay({
          "radius":20,
          gradient: {
            0:'rgb(9, 185, 253)',
            .3:'rgb(86, 255, 0)',
            .6:'rgb(255, 235, 0)',
            .8:'rgb(244, 74, 74)'
          },
          zIndex: 199,
          opacity: 0.6
        });
        this.map.addOverlay(heatmapOverlay);
        this.heatmapOverlay = heatmapOverlay
      },
      location() {
        return new Promise((resolve) => {
          let myCity = new BMap.LocalCity();
          myCity.get((result) => {
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

      // 判断一个点是否在可视区域内
      addSigleLabel(item) {
        let bounds = this.map.getBounds()
        let isIn = bounds.containsPoint(item.point)
        if (isIn) {
          this.addLabel(item)
        }
      },
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
                this.$emit('returnSearchResult', results.Tq)
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
      // 将背景点中type为x的设置成y 如果x为null则将所有可修改背景点type替换成y
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
        if (Object.keys(this.pathArr).length > 1) {
          this.changePathPointType(item.index, -2)
          delete this.pathArr[item.index]
          this.reGetAreaPoint()
        } else {
          delete this.pathArr[item.index]
          this.changePathPointType(null, -1)
        }
        this.pathArr = {...this.pathArr}
        this.setActivePathNull()
        this.jugDraw()
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
        this.jugDraw()
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
          // strokeWeight: 2 * radius,       //边线的宽度，以像素为单位。
          strokeOpacity: 0.5,    //边线透明度，取值范围0 - 1。
          strokeStyle: 'solid' //边线的样式，solid或dashed。
        });
        polyline.setStrokeWeight(2 * radius)
        let ol = {...path, overlay: polyline, anotherOverlay: overlay}
        this.map.addOverlay(polyline);
        this.overlayBindEvent(ol)
        this.getPopUpData(ol)
      },
      // 判断数组中数据是够全等
      isAllEqual(array) {
        if (array.length > 0) {
          return array.every(function(value) {
            return value.equals(array[0]);
          });
        } else {
          return true;
        }
      },
      // 当前选点不规范时提示并取消选点
      drawErrorTip(e) {
        let p = e.overlay.getPath()
        if (p.length === 1 || this.isAllEqual(p)) {
          this.$message.error('当前选点的位置太接近，无法进行地图选点！');
          this.$emit('drawCancle')
          return false
        }
        if (e.drawingMode === "polygon" && p.length === 2) {
          this.$message.error('多边形至少进行三次选点才能形成有效选点区域！');
          this.$emit('drawCancle')
          this.map.removeOverlay(e.overlay)
          return false
        }
        return  true
      },
      setSvgIndex() {
        if (this.map.getPanes().mapPane.getElementsByTagName('svg').length) {
          this.map.getPanes().mapPane.getElementsByTagName('svg')[0].style.zIndex = 1000
        }
      },
      /*
       *折线和多边形画线完成回调函数
       */
      drawComplete(drawingManager) {
        drawingManager.addEventListener("overlaycomplete", (e) => {
          if (!this.drawErrorTip(e)) return
          this.setSvgIndex()
          let location = this.map.pixelToPoint(e.currentTarget._mask._draggingMovePixel)
          let path = {
            type: e.drawingMode,
            overlay: e.overlay,
            location: location, // 结束绘制时鼠标的经纬度位置用于显示弹窗位置
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
        this.indexArr[path.index] = path.index // 记录所有画过路径的index数组
        this.jugDraw()
        this.activePath = this.pathArr[path.index]
      },
      getPointChangeAble(point, index) {
        if ((this.judgePointType(point) && point.type < 0) || point.type === index) {
          return true
        } else {
          return false
        }
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
            if (this.getPointChangeAble(points[key], path.index)) {
              let b = points[key].point;
              if (BMapLib.GeoUtils.isPointInPolygon(b, path.overlay)) {
                points[key].type = path.index
              } else {
                points[key].type = -2
              }
            }
          }
        } else if (path.type === 'circle') {
          for(let key in points) {
            let b = points[key].point;
            if (this.getPointChangeAble(points[key], path.index)) {
              if (BMapLib.GeoUtils.isPointInCircle(b, path.overlay)) {
                  points[key].type = path.index
                } else {
                points[key].type = -2
              }
            }
          }
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

        // 重置折线的点type为-2为了之后改变type值不会出错
        this.changePathPointType(index, -2)
        //圆形计算
        for (let i in polyline) {
          let circle = new BMap.Circle(polyline[i], radius, this.styleOptions);
          for(let key in points) {
            if (this.judgePointType(points[key]) && points[key].type < 0) {
              let b = points[key].point;
              if (BMapLib.GeoUtils.isPointInCircle(b, circle)) {
                points[key].type = index
              } else {
                points[key].type = -2
              }
            }
          }
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
            if (this.judgePointType(points[key]) && points[key].type < 0) {
              let b = points[key].point;
              if (BMapLib.GeoUtils.isPointInPolygon(b, polygons[j])) {
                points[key].type = index
              } else {
                points[key].type = -2
              }
            }
          }
        }
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

      // 添加marker覆盖物
      drawMarker(arr) {
        arr.forEach((item, index) => {
          this.addMarker(item, 1)
        })
      },

      // 添加zoom后的marker 1表示放大后的加图标
      addMarker(point, type = 0) {  // 创建图标对象
        let src = ''
        if (type === 0) {
          src = require('@/assets/images/icon_location2.png')
        } else {
          if (point.type >= -1) {
            src = require('@/assets/images/icon_location2.png')
          } else {
            src = require('@/assets/images/icon_ash_location.png')
          }
        }
        var myIcon = new BMap.Icon(src, new BMap.Size(26, 32), {});
        // 创建标注对象并添加到地图
        let marker = new BMap.Marker(point, {
          icon: myIcon,
          offset: new BMap.Size(0, -16),
        });
        this.map.addOverlay(marker);

        if (type === 1) {
          marker.addEventListener('mousedown', (e) => {
            if (this.currentSelectType === null) {
              this.$emit('buildingClick', point)
            }
          })
          marker.addEventListener('mouseover', (e) => {
            if (this.currentSelectType === null && this.activePath === null) {
              this.addLabel(point)
            }
          });
          marker.addEventListener('mouseout',  (e) => {
            this.removeLabels()
          });
          this.markerArr.push(marker)
        }
        return marker
      },

      getVisualPoint() {
        let bounds = this.map.getBounds()
        let arr = Object.values(this.points).filter((item) => {
          return bounds.containsPoint(item.point)
        })
        this.drawMarker(arr)
      },
      removeLabels() {
        if (!this.labelsArr.length) return
        this.labelsArr.forEach((item) => {
          this.map.removeOverlay(item.label)
        })
        this.labelsArr = []
      },
      removeMarkers() {
        if (!this.markerArr.length) return
        this.markerArr.forEach((marker) => {
          this.map.removeOverlay(marker)
        })
        this.markerArr = []
      },

      togglePoints(type) {
        if (type) {
          this.pointsOverlayObj.selectedOverlay && this.pointsOverlayObj.selectedOverlay.hide()
          this.pointsOverlayObj.unSelectedOverlay && this.pointsOverlayObj.unSelectedOverlay.hide()
        } else {
          this.pointsOverlayObj.selectedOverlay && this.pointsOverlayObj.selectedOverlay.show()
          this.pointsOverlayObj.unSelectedOverlay && this.pointsOverlayObj.unSelectedOverlay.show()
        }
        this.pointsOverlayObj.isShow = !this.pointsOverlayObj.isShow
      },
      drawMarkers() {
        this.removeMarkers()
        this.getVisualPoint()
      },
      drawMarkersByVisual() {
        let zoom = this.map.getZoom()
        if (zoom >= this.showLabel) {
          if (this.pointsOverlayObj.isShow === true) {
            this.togglePoints(this.pointsOverlayObj.isShow)
          }
          this.drawMarkers()
        } else {
          if (this.pointsOverlayObj.isShow === false) {
            this.togglePoints(this.pointsOverlayObj.isShow)
            // this.drawDevicePoints()
          }
          this.removeMarkers()
        }
      },
      removeEvent() {
        this.map.removeEventListener('dragend', this.drawMarkersByVisual)
        this.map.removeEventListener('click', this.mapLeftClick)
        this.map.removeEventListener('zoomend', this.mapZoomEnd)
        this.map.removeEventListener('mousemove', this.mapMouseMove)
        this.map.removeEventListener('rightclick', this.mapRightClick)
        this.map.removeEventListener('load', this.mapLoad)
      },

      mapLeftClick(event) {
        if (this.currentSelectType && this.currentSelectType.type === 'circle') {
          // 地址逆解析
          new BMap.Geocoder().getLocation(event.point, (rs) => {
            this.drawCircle(event.point, rs.address)
          })
          this.$emit('drawCancle')
        }
        this.$emit('hidePopup')
      },
      mapZoomEnd() {
        this.drawMarkersByVisual()
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
      // tilesloaded() {
      //   if (this.isInit) {
      //     setTimeout(() => {
      //       console.log('6666')
      //       // this.initHotMap()
      //       this.isInit = false
      //     }, 0)
      //   }
      // },
      mapLoad() {
        // this.initPointsOverlay()
        this.initHotMap()
        this.initMouse()
      },

      mapBindEvent() {
        this.map.addEventListener('dragend', this.drawMarkersByVisual)
        this.map.addEventListener('zoomend', this.mapZoomEnd)
        this.map.addEventListener('click', this.mapLeftClick)
        this.map.addEventListener('mousemove', this.mapMouseMove)
        this.map.addEventListener('rightclick', this.mapRightClick)
        this.map.addEventListener('load', this.mapLoad)
        // this.map.addEventListener('click', this.mapRightClick)
        // this.map.addEventListener('tilesloaded', this.tilesloaded)
      },
      drawCircle(point, info) {
        this.setSvgIndex()
        let marker = this.addMarkerIcon(point)
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
      addMarkerIcon(point) {  // 创建图标对象
        var myIcon = new BMap.Icon(require('@/assets/images/icon_location.png'), new BMap.Size(12, 22), {});
        // 创建标注对象并添加到地图
        let marker = new BMap.Marker(point, {
          icon: myIcon,
          offset: new BMap.Size(0, -11),
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
      // 热力图
      drawHotMap(arr) {
        this.heatmapOverlay.setDataSet({data:arr, max:100});
        this.showHotMap()
      },
      showHotMap() {
        if (this.heatmapOverlay) {
          this.heatmapOverlay.show();
        }
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
      },
      /*
       * 传已选及未选的点画背景点
       * */
      /*
       * 画背景点
       * */
      drawBg(selectP, unSelectP) {
        this.selectedBuildings = selectP
        this.drawPoints(selectP, unSelectP)
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
          offset: new BMap.Size(-5, -32),
          position: point.point
        });
        label.setStyle(labelStyle);

        this.labelsArr.push({label: label, isShow: true})
        this.map.addOverlay(label)
      },
      pointEventOut(event) {
        this.removeLabels()
      },
      // 为海量点添加点击事件
      pointEvent(event) {
        if (this.currentSelectType === null && this.activePath === null) {
          this.addLabel(event.point)
        }
      },
      pointEventClick(event) {
        if (this.currentSelectType === null) {
          this.$emit('buildingClick', event.point)
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
          pointsOverlay.disableMassClear()
          pointsOverlay.addEventListener('mouseover',  this.pointEvent);
          pointsOverlay.addEventListener('mouseout',  this.pointEventOut);
          pointsOverlay.addEventListener('click',  this.pointEventClick);
        } else {
          if (points.length === 0) {
            this.pointsOverlayObj[overlay].removeEventListener('mouseover',  this.pointEvent);
            this.pointsOverlayObj[overlay].removeEventListener('mouseout',  this.pointEventOut);
            this.pointsOverlayObj[overlay].removeEventListener('click',  this.pointEventClick);
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

<!-- -1 表示最开始进来没有做任何操作的全部选中-->

<!-- -2 选点区域计算后没选中的点（一般的未选中的点，之后可以被重新选中）-->

<!-- -3  被删除的点（永远不会被选中的点）-->

<!--index 表示当前第几个选点的选中-->

<!--100 表示不做删除操作永远都会被选中的点-->

<!-- >=-1 表示选中 <-1 表示未选中-->

<!-- <0 并且 != -3 并且 != 100 的点可以被地图选点操作选中-->
