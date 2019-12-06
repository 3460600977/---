import {scaleData} from '../../utils/static'
export default class MapObj {
  constructor(map, pathArr, showPath) {
    this.map = map
    this.showHotMapLevel = 12
    this.heatmapOverlay = null
    this.pathArr = pathArr
    this.activePath = null
    this.points = null // 所有的楼盘点位数据
    this.defaultRadius = 3000 // 鼠标绘制结束后线条或者圆半径默认宽度
    this.styleOptions = {
      strokeColor:"red",    //边线颜色。
      fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
      strokeWeight: 3,       //边线的宽度，以像素为单位。
      strokeOpacity: 1,    //边线透明度，取值范围0 - 1。
      fillOpacity: 0.5,      //填充的透明度，取值范围0 - 1。
      strokeStyle: 'solid' //边线的样式，solid或dashed。
    }
  }
  initMap(cityData) {
    this.initMouse()
    this.drawHotMap(cityData)
    this.points = this.normalizePointsAll(cityData)
    this.setDevicePoints(this.normalizePoints(this.points))
    this.mapBindEvent()
  }
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
    this.drawComplete(drawingManager)
  }

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
  }
  drawpolylineBg(path) {
    let radius = this.RealDistanceTranPixels(this.defaultRadius)
    let polyline = new BMap.Polyline(path.overlay.getPath(), {
      strokeColor:"red",    //边线颜色。
      strokeWeight: radius,       //边线的宽度，以像素为单位。
      strokeOpacity: 0.5,    //边线透明度，取值范围0 - 1。
      strokeStyle: 'solid' //边线的样式，solid或dashed。
    });
    this.map.addOverlay(polyline);
    this.activePath = {...path, overlay: polyline}
    this.isInArea(path)
  }
  drawComplete(drawingManager) {
    drawingManager.addEventListener("overlaycomplete", (e) => {
      this.closePathWindow(this.pathArr)
      let location = this.map.pixelToPoint(e.currentTarget._mask._draggingMovePixel)
      let path = {
        type: e.drawingMode,
        overlay: e.overlay,
        location: location, // 结束绘制时鼠标的经纬度位置
        isShow: true,
        radius: this.defaultRadius,
        points: e.overlay.getPath()
      }
      if (e.drawingMode === "polyline") {
        this.drawpolylineBg(path)
      } else {
        this.activePath = path
        this.isInArea(path)
      }
      this.pathArr.push(this.activePath)
    });
  }

  /*
  得出在当前操作路径区域内的点
   */
  isInArea(path) {
    if (path.type === 'polyline') {
      let arr = this.filterProjectByPolyline(this.points, path.overlay, path.radius)
      path.devices = arr
    } else if (path.type === 'polygon') {
      let arr = this.points.filter((item) => {
        return BMapLib.GeoUtils.isPointInPolygon(item.point, path.overlay)
      })
      path.devices = arr
    }
  }
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
  }
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
    let polygon = new BMap.Polygon(lists,
    {
      strokeColor:"#000",    //边线颜色。
      fillColor:"#000",      //填充颜色。当参数为空时，圆形将没有填充效果。
      strokeWeight: 3,       //边线的宽度，以像素为单位。
      strokeOpacity: 1,    //边线透明度，取值范围0 - 1。
      fillOpacity: 0.5,      //填充的透明度，取值范围0 - 1。
      strokeStyle: 'solid' //边线的样式，solid或dashed。
    }
    );
    return polygon;
  }

  unique(arr1) {
    const res = new Map();
    let result = arr1.filter((a) => !res.has(a.premisesId) && res.set(a.premisesId, 1))
    return result
  }
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
      let filterP = points.filter((p) => {
        let b = p.point;
        return BMapLib.GeoUtils.isPointInCircle(b, circle);
      });
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
      this.map.addOverlay(polygons[j]);
      let filterP = points.filter((p) => {
        return BMapLib.GeoUtils.isPointInPolygon(p.point, polygons[j]);
      });
      filterPs = [...filterP, ...filterPs];
    }
    let result = this.unique(filterPs)
    return result
  }

  closePathWindow(arr) {
    arr.forEach((item) => {
      item.isShow = false
    })
  }

  zoomChangeAllPath() {
    this.pathArr.forEach((item) => {
      this.zoomSinglePathChange(item)
    })
  }

  zoomSinglePathChange(path) {
    if (path.type === 'polygon') return
    let radius = this.RealDistanceTranPixels(path.radius)
    if (this.activePath.type === 'polyline') {
      path.overlay.setStrokeWeight(radius)
    }
  }

  mapBindEvent() {
    this.map.addEventListener('zoomend', (type, target) => {
      let zoom = this.map.getZoom()
      if (zoom < this.showHotMapLevel) {
        this.heatmapOverlay.show()
      } else {
        this.heatmapOverlay.hide()
      }
      this.zoomChangeAllPath()
    })
  }

  drawHotMap(arr) {
    this.heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":15});
    this.map.addOverlay(this.heatmapOverlay);
    this.heatmapOverlay.setDataSet({data:arr, max:100});
  }

  normalizePoints(arr) {
    let result = arr.map((item) => {
      return item.point
    })
    return result
  }

  normalizePointsAll(arr) {
    let result = arr.map((item) => {
      return {point: new BMap.Point(item.lng, item.lat), ...item}
    })
    return result
  }
  setDevicePoints(arrPoints) {
    let points = new BMap.PointCollection(arrPoints, {
      shape: BMAP_POINT_SHAPE_CIRCLE,
      color: 'rgba(45,90,255,0.74)'
    });
    this.map.addOverlay(points);
  }
}
