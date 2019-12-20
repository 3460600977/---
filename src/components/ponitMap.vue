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
      // data: {
      //   type: Object,
      //   required: true
      // },
    },
    data() {
      return {
        map: null
      }
    },
    mounted() {
      this.map = new BMap.Map(this.$refs.map, {enableMapClick: false});
      this.map.enableScrollWheelZoom();
      let points = [
        {
          premisesId: 167921,
          premisesName: "棕榈花园",
          lng: "104.084745",
          lat: "30.626762",
          signElevatorNum: 9,
          totalPeople: 1008,
        },
        {
          premisesId: 167923,
          premisesName: "四威大厦B座",
          lng: "104.04846",
          lat: "30.69082",
          signElevatorNum: 0,
          totalPeople: 2500,
        }
      ]
      this.drawPoints(points)
    },
    methods: {
      drawPoints(points) {
        points.forEach((point) => {
          this.addMarker(point)
        })
      },
      addMarker(point){  // 创建图标对象
        var myIcon = new BMap.Icon(require('@/assets/images/icon_location.png'), new BMap.Size(12, 22), {
        });
        // 创建标注对象并添加到地图
        let marker = new BMap.Marker(new BMap.Point(point.lng, point.lat), {
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
