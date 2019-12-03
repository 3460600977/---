export default class Map {
  constructor(map) {
    this.map = map
    this.showHotMapLevel = 12
    this.heatmapOverlay = null
    this.styleOptions = {
      strokeColor:"red",    //边线颜色。
      fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
      strokeWeight: 3,       //边线的宽度，以像素为单位。
      strokeOpacity: 0.5,    //边线透明度，取值范围0 - 1。
      fillOpacity: 0.5,      //填充的透明度，取值范围0 - 1。
      strokeStyle: 'solid' //边线的样式，solid或dashed。
    }
  }
  initMap(cityData) {
    this.initMouse()
    this.drawHotMap(cityData)
    this.setDevicePoints(this.normalizePoints(cityData))
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
  }

  mapBindEvent() {
    this.map.addEventListener('zoomend', (type, target) => {
      let zoom = this.map.getZoom()
      if (zoom < this.showHotMapLevel) {
        this.heatmapOverlay.show()
      } else {
        this.heatmapOverlay.hide()
      }
    })
  }

  drawHotMap(arr) {
    this.heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":15});
    this.map.addOverlay(this.heatmapOverlay);
    this.heatmapOverlay.setDataSet({data:arr, max:100});
  }

  normalizePoints(arr) {
    let result = arr.map((item) => {
      return new BMap.Point(item.lng, item.lat)
    })
    return result
  }
  setDevicePoints(arrPoints) {
    let points = new BMap.PointCollection(arrPoints, {
      shape: BMAP_POINT_SHAPE_CIRCLE,
      color: 'rgba(255, 0, 0, 0.5)'
    });
    this.map.addOverlay(points);
  }
}
