<template>
    <div
      class="map"
      ref="map"
    >
    </div>
</template>

<script>
  const HIDE_LABEL_ZOOM = 11
  const INIT_ZOOM = 13
  export default {
    name: "ponitMap",
    props: {
      points: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        // points: [],
        map: null,
        bounds: [],
        markerArr: [],
        pointsBak: null,
        visualPoint: [],
        currentPoint: null,
        isFirst: true
      }
    },
    mounted() {
      this.map = new BMap.Map(this.$refs.map, {enableMapClick: false});
      this.map.enableScrollWheelZoom();
      if (!this.points.length) {
        this.currentPoint = null
      } else {
        this.pointsBak = this.normalizePointsAll(this.points)
        this.currentPoint = this.pointsBak[0].point
        this.setCenter(this.pointsBak[0].point)
      }
    },
    watch: {
      currentPoint(val) {
        this.$emit('changePoint', val)
      }
    },
    methods: {
      clearMarkers() {
        this.markerArr.forEach((item) => {
          this.map.removeOverlay(item)
        })
        this.markerArr = []
      },
      normalizePointsAll(arr) {
        let result = arr.map((item) => {
          return {point: new BMap.Point(item.longitude, item.latitude), ...item}
        })
        return result
      },
      getBounds() {
        const bounds = this.map.getBounds()
        this.getPoints(bounds)
      },
      getPoints(bounds) {
        let arr = this.pointsBak.filter((item) => {
          return bounds.containsPoint(item.point)
        })
        this.drawPoints(arr)
      },
      setCenter(point) {
        this.map.centerAndZoom(point, INIT_ZOOM)
        this.map.addEventListener('tilesloaded', () => {
          if (this.isFirst) {
            this.clearMarkers()
            this.getBounds()
            this.isFirst = false
          }
        })
        this.map.addEventListener('dragend', () => {
          if (!this.isFirst) {
            this.clearMarkers()
            this.getBounds()
          }
        })
        this.map.addEventListener('zoomend', () => {
          if (!this.isFirst) {
            this.clearMarkers()
            this.getBounds()
          }
        })
      },
      drawPoints(points) {
        this.visualPoint = points
        points.forEach((point, index) => {
          this.addMarker(point, index)
        })
      },
      setLabelStyle(content, index) {
          //左偏移  右偏移
          let labelStyle = {
            color: "#222222",
            backgroundColor: "#ffffff",
            fontSize : "12px",
            verticalAlign:"center",
            border: 'none',
            borderRadius: "0px 4px 4px 0px",
            whiteSpace:"nowrap",
            padding:"0px 4px 0 4px",
            // left: '50%',
            lineHeight: '26px',
            boxShadow:'0px 3px 7px 0px rgba(244,74,74,0.2)'
          };
          //  boxShadow: '0px 3px 7px 0px rgba(45, 90, 255, 0.2)'
          //用于设置样式
          let label = new BMap.Label(content, {
            offset: new BMap.Size(35, 3)
          });
          label.setStyle(labelStyle);
          label.addEventListener('click', () => {
            this.currentPoint = this.visualPoint[index]
          })
          return label;
        },
      addMarker(point, index){  // 创建图标对象
        var myIcon = new BMap.Icon(require('@/assets/images/icon_seat.png'), new BMap.Size(41, 38), {
        });
        // 创建标注对象并添加到地图
        let marker = new BMap.Marker(point.point, {
          icon: myIcon,
          offset: new BMap.Size(0, -19),
        });
        if (this.map.getZoom() > HIDE_LABEL_ZOOM) {
          marker.setLabel(this.setLabelStyle(point.premiseName, index));
        }
        this.markerArr.push(marker)
        this.map.addOverlay(marker);
        marker.addEventListener('click', (event) => {
          this.currentPoint = this.visualPoint[index]
        })
      },
    },
  }
</script>

<style scoped lang='scss'>
.map{
  height: 100%;
  width: 100%;
}
</style>
