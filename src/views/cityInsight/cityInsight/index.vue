<template>
    <div class="container cityInsight">
      <div class="mapPopup">
        <map-popup @change="sliderChange"></map-popup>
      </div>
      <div class="left-select">
        <left-select></left-select>
      </div>
      <div class="info">
<!--        <right-info></right-info>-->
      </div>
      <div class="map container">
        <db-map
          :sliderVal="sliderVal"
        ></db-map>
      </div>
    </div>
</template>

<script>
  import dbMap from '../../../components/map/map.vue'
  import tools from "../../../components/map/tools";
  import mapPopup from "../../../components/map/mapPopup";
  import rightInfo from "./rightInfo";
  import leftSelect from "./leftSelect";

  export default {
    name: "index",
    components: {
      dbMap,
      tools,
      mapPopup,
      leftSelect,
      rightInfo
    },
    data() {
      return {
        sliderVal: 5
      }
    },
    mounted() {
    },
    methods: {
      click() {
        this.type = 'line'
      },
      sliderChange(val) {
        this.sliderVal = val
      },
    },
  }
</script>

<style scoped lang='scss'>
.cityInsight {
  position: relative;
  .tools {
    position: absolute;
    z-index: 2;
    top: 10px;
    left: 20px;
  }
  .mapPopup {
    position: absolute;
    z-index: 3;
    top: 40px;
    left: 20px;
  }
  .info {
    position: absolute;
    z-index: 3;
    top: 29px;
    background: #fff;
    right: 40px;
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
