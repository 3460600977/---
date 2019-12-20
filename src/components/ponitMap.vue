<template>
    <div
      ref="map"
      :style="{'width': width+'px', 'height': height + 'px'}"
    >
    </div>
</template>

<script>
  export default {
    name: "ponitMap",
    props: {
      width: {
        type: Number,
        default: 896
      },
      height: {
        type: Number,
        default: 604
      },
      points: {
        type: Array,
        required: true
      },
    },
    data() {
      return {
        map: null,
        zoom: 12
      }
    },
    mounted() {
      this.map = new BMap.Map(this.$refs.map, {enableMapClick: false});
      this.map.enableScrollWheelZoom();
      this.setCenter(this.points[0])
      this.drawPoints(this.points)
    },
    methods: {
      setCenter(point) {
        console.log(point)
        this.map.centerAndZoom(new BMap.Point(point.longitude, point.latitude), this.zoom);
      },
      drawPoints(points) {
        points.forEach((point) => {
          this.addMarker(point)
        })
      },
      addMarker(point){  // 创建图标对象
        var myIcon = new BMap.Icon(require('@/assets/images/icon_location.png'), new BMap.Size(12, 22), {
        });
        // 创建标注对象并添加到地图
        let marker = new BMap.Marker(new BMap.Point(point.longitude, point.latitude), {
          icon: myIcon,
          offset: new BMap.Size(6, -11),
        });
        this.map.addOverlay(marker);
      },
    },
  }
</script>

<style scoped lang='scss'>

</style>
