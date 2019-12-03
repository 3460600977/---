<template>
  <div class="container" v-loading="loading">
    <div ref="container" class="container"></div>
  </div>
</template>

<script>
  import Map from "./map";
  export default {
    name: "index",
    data() {
      return {
        loading: true,
        map: null,
        cityData: null,
      }
    },
    props: {
      sliderVal: {
        type: Number,
        default: 500
      }
    },
    watch: {
      // type(val) {
      //   console.log(val)
      // },
      // sliderVal(val) {
      //   this.circle.setRadius(val)
      //   this.polyline.setStrokeWeight(val)
      // }
    },
    created() {
    },
    mounted() {
      let map = new BMap.Map(this.$refs.container);
      var myCity = new BMap.LocalCity();
      myCity.get((result) => {
        map.centerAndZoom(result.name,10);
      });
      map.enableScrollWheelZoom();
      map.addControl(new BMap.ScaleControl());
      this.$api.cityInsight.getPremisesByCity({cityCode: '510100'}).then((data) => {
        this.cityData = data.result
        this.map = new Map(map)
        this.map.initMap(this.cityData)
        this.loading = false
      })
    },
    methods:{

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
