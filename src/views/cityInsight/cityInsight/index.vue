<template>
    <div class="container cityInsight">
      <div class="tools">
        <tools @click="click"></tools>
      </div>
      <div class="mapPopup">
        <map-popup @change="sliderChange"></map-popup>
      </div>
      <div class="map container">
        <db-map
          :pathType="pathType"
          :sliderVal="sliderVal"
        ></db-map>
      </div>
    </div>
</template>

<script>
  import dbMap from '../../../components/map/map.vue'
  import tools from "../../../components/map/tools";
  import mapPopup from "../../../components/map/mapPopup";
  export default {
    name: "index",
    components: {
      dbMap,
      tools,
      mapPopup
    },
    data() {
      return {
        pathType: '',
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
  .map {
    z-index: 1;
  }
}
</style>
