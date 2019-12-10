<template>
  <div class="container" v-loading="loading">
    <div ref="container" class="container"></div>
  </div>
</template>

<script>
  import {scaleData} from '../../utils/static'
  export default {
    name: "index",
    data() {
      return {
        loading: true,
        map: null,
        pathArr: {},
        indexArr: [],
        showHotMapLevel: 12,
        heatmapOverlay: null,
        activePath: null,
        points: null, // 楼盘设备数据
        defaultRadius: 3000,
        drawingManager: null,
        circleSelectedOption: {
          shape: BMAP_POINT_SHAPE_CIRCLE,
          color: 'rgba(45,90,255,0.74)'
        },
        circleUnSelectedOption: {
          shape: BMAP_POINT_SHAPE_CIRCLE,
          color: 'rgba(158, 158, 158, 0.7)'
        },
        styleOptions: {
          strokeColor:"red",    //边线颜色。
          fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
          strokeWeight: 3,       //边线的宽度，以像素为单位。
          strokeOpacity: 1,    //边线透明度，取值范围0 - 1。
          fillOpacity: 0.5,      //填充的透明度，取值范围0 - 1。
          strokeStyle: 'solid' //边线的样式，solid或dashed。
        }
      }
    },
    props: {
      sliderVal: {
        type: Number,
        default: 3000
      },
      budget: {
        type: Number,
        required: true
      },
      showPathCopy: {
        type: Object,
        default: function () {
          return {}
        }
      },
      currentSelectType: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    watch: {
      activePath(val) {
        this.$emit('activePathChange', val)
      },
      budget(val) {
        console.log(val)
        this.drawDevicePoints()
      },
    },
    created() {
    },
    mounted() {
      let map = new BMap.Map(this.$refs.container, {enableMapClick: false});
      this.map = map
      var myCity = new BMap.LocalCity();
      myCity.get((result) => {
        map.centerAndZoom(result.name,10);
        this.loadData(map)
      });
      map.enableScrollWheelZoom();
      map.addControl(new BMap.ScaleControl());
      this.mapBindEvent()
    },
    methods:{
      loadData(map) {
        this.loading = true
        this.$api.cityInsight.getPremisesByCity({cityCode: '510100'}).then((data) => {
          this.initMouse()
          // this.drawHotMap(data.result)
          if (data.result) {
            this.points = this.normalizePointsAll(data.result)
            // this.drawDevicePoints(this.points)
            this.setDeviceSelectedPoints(this.normalizePoints(this.points))
          } else {
            console.log('没有数据')
          }

          this.loading = false
        })
      },
      /*
      * 隐藏弹窗，即设置activePath为null
      * */
      setActivePathNull() {
        this.activePath = null
      },
      /*
      *  删除当前选中的path
      * */
      deletePath() {
        this.map.removeOverlay(this.activePath.overlay)
        if (this.activePath.anotherOverlay) {
          this.map.removeOverlay(this.activePath.anotherOverlay)
        }
        delete this.pathArr[this.activePath.index]
        this.setActivePathNull()
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
        console.log(dom)
        dom.click()
      },
      /*
      改变当前path的radius
      */
      changeActivePathRadius(val) {
        this.activePath.radius = this.activePath.type === 'polyline'? 2*val: val
        this.zoomSinglePathChange(this.activePath)
        this.activePath.buildings = this.isInArea(this.activePath)
        this.getBuildingData(this.activePath)
        console.log(this.activePath)
        this.pathArr[this.activePath.index] = this.activePath
        console.log(this.pathArr)
      },
      initMouse() {
        //实例化鼠标绘制工具
        let drawingManager = new BMapLib.DrawingManager(this.map, {
          isOpen: false, //是否开启绘制模式
          enableDrawingTool: true, //是否显示工具栏
          drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
            offset: new BMap.Size(5, 5), //偏离值
            drawingModes : [
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
          strokeColor:"red",    //边线颜色。
          strokeWeight: radius,       //边线的宽度，以像素为单位。
          strokeOpacity: 0.5,    //边线透明度，取值范围0 - 1。
          strokeStyle: 'solid' //边线的样式，solid或dashed。
        });
        this.map.addOverlay(polyline);
        this.getPopUpData({...path, overlay: polyline, anotherOverlay: overlay})
        this.overlayBindEvent(path)
      },
      /*
      *折线和多边形画线完成回调函数
      */
      drawComplete(drawingManager) {
        drawingManager.addEventListener("overlaycomplete", (e) => {
          // this.closePathWindow(this.pathArr)
          let location = this.map.pixelToPoint(e.currentTarget._mask._draggingMovePixel)
          let path = {
            type: e.drawingMode,
            overlay: e.overlay,
            location: location, // 结束绘制时鼠标的经纬度位置用于显示弹窗位置
            isShow: true,
            index: this.indexArr.length, // 即将是pathArr的第几个元素
            radius: this.defaultRadius * 2, // 这里只有折线会用这个属性，折线的直径就是defaultRadius的两倍
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
          this.activePath = {...this.pathArr[path.index], location: e.point}
        })
      },
      /*
      整理得到弹窗所需数据
      */
      getPopUpData(path) {
        path.buildings = this.isInArea(path)
        console.log(path)
        this.getBuildingData(path)
        this.activePath = path
        this.pathArr[path.index] = path
        this.indexArr[path.index] = path.index // 记录所有画过路径的index数组
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
        let arr = []
        if (path.type === 'polyline') {
          arr = this.filterProjectByPolyline(this.points, path.overlay, path.radius)
        } else if (path.type === 'polygon') {
          for (let key in this.points) {
            if (BMapLib.GeoUtils.isPointInPolygon(this.points[key].point, path.overlay)) {
              arr.push(this.points[key])
            }
          }
          // arr = this.points.filter((item) => {
          //   return BMapLib.GeoUtils.isPointInPolygon(item.point, path.overlay)
          // })
        } else if (path.type === 'circle') {
          for (let key in this.points) {
            if (BMapLib.GeoUtils.isPointInCircle(this.points[key].point, path.overlay)) {
              arr.push(this.points[key])
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
      /*
      折现判断点位是否在区域内
       */
      filterProjectByPolyline(points, overlay, radius) {
        let polyline = overlay.getPath();
        let len = polyline.length;

        //圆形计算
        let filterPs = [];
        for (let i in polyline) {
          let circle = new BMap.Circle(polyline[i], radius/2, this.styleOptions);
          let filterP = []
          for (let key in points) {
            let b = points[key].point;
            if (BMapLib.GeoUtils.isPointInCircle(b, circle)) {
              filterP.push(points[key])
            }
          }
          // let filterP = points.filter((p) => {
          //   let b = p.point;
          //   return BMapLib.GeoUtils.isPointInCircle(b, circle);
          // });
          filterPs = [...filterP, ...filterPs];
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
          polygons.push(this.getFourP(lat1, lng1, lat2, lng2, radius/2));
        }
        for (let j in polygons) {

          let filterP = []
          for (let key in points) {
            let b = points[key].point;
            if (BMapLib.GeoUtils.isPointInPolygon(b, polygons[j])) {
              filterP.push(points[key])
            }
          }
          // let filterP = points.filter((p) => {
          //   return BMapLib.GeoUtils.isPointInPolygon(p.point, polygons[j]);
          // });
          filterPs = [...filterP, ...filterPs];
        }
        let result = this.unique(filterPs)
        return result
      },

      closePathWindow(arr) {
        arr.forEach((item) => {
          item.isShow = false
        })
      },

      zoomChangeAllPath() {
        // console.log(this.pathArr.getOwnPropertyNames)
        if (JSON.stringify(this.pathArr) === '{}') return
        for(let item of this.pathArr) {
          if (item.type === 'polyline') { // 只有折线需要在改变zoom时变半径，圆和多边形都是自动变的
            this.zoomSinglePathChange(item)
          }
        }
      },

      zoomSinglePathChange(path) {
        if (path.type === 'polygon') return
        let radius = this.RealDistanceTranPixels(path.radius)
        if (path.type === 'polyline') {
          path.overlay.setStrokeWeight(radius)
        } else if (path.type === 'circle') {
          path.overlay.setRadius(path.radius)
        }
      },

      mapBindEvent() {
        this.map.addEventListener('zoomend', (type, target) => {
          let zoom = this.map.getZoom()
          // if (zoom < this.showHotMapLevel) {
          //   this.heatmapOverlay.show()
          // } else {
          //   this.heatmapOverlay.hide()
          // }
          this.zoomChangeAllPath()
        })
        this.map.addEventListener('click', ({point}) => {
          console.log(point)
          if (this.currentSelectType && this.currentSelectType.type === 'circle') {
              this.drawCircle(point)
              this.$emit('drawCancle')
          }
        })
        this.map.addEventListener('mousemove', ({type, target, point, pixel, overlay}) => {
          if (this.currentSelectType !== null) {
            this.$emit('currentMouseLocation',  pixel)
          }
        })
        this.map.addEventListener('rightclick', (event) => {
          if (this.currentSelectType && this.currentSelectType.type === 'circle') {
            this.$emit('drawCancle')
          }
        })
      },
      drawCircle(point) {
        let marker = this.addMarker(point)
        let circle = new BMap.Circle(point,this.defaultRadius, this.styleOptions);
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
        this.getPopUpData(path)
        this.overlayBindEvent(path)
      },
      addMarker(point){  // 创建图标对象
        var myIcon = new BMap.Icon(require('@/assets/images/icon_location.png'), new BMap.Size(12, 22), {
        });
        // 创建标注对象并添加到地图
        let marker = new BMap.Marker(point, {
          icon: myIcon,
          offset: new BMap.Size(6, -11),
        });
        this.map.addOverlay(marker);
        return marker
      },
      drawHotMap(arr) {
        this.heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":15});
        this.map.addOverlay(this.heatmapOverlay);
        this.heatmapOverlay.setDataSet({data:arr, max:100});
      },

      normalizePoints(arr) {
        let result = arr.map((item) => {
          return item.point
        })
        return result
      },

      normalizePointsAll(arr) {
        let result = arr.map((item) => {
          return {point: new BMap.Point(item.lng, item.lat), ...item}
        })
        return result
      },
      /*
      * 根据预算随机得到已选的楼盘数据
      * */
      drawDevicePoints() {
        if (Object.is(this.pathArr, {})) {

        } else {
          if (this.budget === 1) {
            item.selectedBuildings = item.buildings
            console.log(this.budget)
          } else {
            let selectedBuildings = []
            for (let key in this.pathArr) {
              this.pathArr[key].selectedBuildings = this.getRandomBuildings(this.pathArr[key].buildings, this.budget)
              selectedBuildings = selectedBuildings.concat(this.pathArr[key].selectedBuildings)
            }
            let result = this.unique(selectedBuildings)
            console.log(result)
            this.separateBgPonits(result)
          }
        }
      },
      /*
      * 根据当前选中的点 将背景点分为已选和未选 然后分别绘画
      * */
      separateBgPonits(arr) {
        let selected = {}, unSelected = {}
        arr.forEach((item) => {
          selected[item.premisesId] = item
        })
        this.points.forEach((item) => {
          if (!selected[item.premisesId]) {
            unSelected[item.premisesId] = item
          }
        })
        this.drawBg(selected, unSelected)
      },
      /*
      * 画背景点
      * */
      drawBg(selected, unSelected) {
        let selectP = this.normalizePoints(Object.values(selected))
        let unSelectP = this.normalizePoints(Object.values(unSelected))
        this.setDeviceSelectedPoints(selectP)
        this.setDeviceUnSelectedPoints(unSelectP)
      },
      /*
      * 得到已选的楼盘数据
      * */
      getRandomBuildings(arr, percent) {
        let arrCopy = this.$tools.deepCopy(arr),
          len = arr.length,
          num = len*percent,
          result = []

        while (result.length < num) {
          let val = parseInt(Math.random()*arrCopy.length, 10)
          result.push(arrCopy[val])
          arrCopy.splice(val, 1)
        }
        return result
      },

      setDeviceSelectedPoints(arrPoints) {
        let points = new BMap.PointCollection(arrPoints, this.circleSelectedOption);
        this.map.addOverlay(points);
      },
      setDeviceUnSelectedPoints(arrPoints) {
        let points = new BMap.PointCollection(arrPoints, this.circleUnSelectedOption);
        this.map.addOverlay(points);
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
