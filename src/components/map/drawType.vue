<template>
    <div class="draw-type-c">
      <div class="hand font0 font-0">
        <p class="ul-p selectType border-right"
           title="查找选点"
           @click="showSearchPop(0)"
           :class="{'active': activeIndex === 0}">
          <span class="font-22 iconfont margin2 icon-locating"></span>
          查找选点
        </p>
        <p class="ul-p selectType border-right"
           title="手动选点"
           :class="{'active': activeIndex === 1}"
           @click="(e) => drawTypeSelect(e, 'circle', 1)">
          <span class="font-22 iconfont margin2 icon-reconnaissance1"></span>
          手动选点
        </p>
        <p class="ul-p selectType border-right"
           title="折线选点"
           :class="{'active': activeIndex === 2}"
           @click="(e) => drawTypeSelect(e, 'polyline', 2)">
          <span class="font-22 iconfont margin2 icon-brokenline"></span>
          折线选点
        </p>
        <p class="ul-p selectType"
           title="多边形选点"
           :class="{'active': activeIndex === 3}"
           @click="(e) => drawTypeSelect(e, 'polygon', 3)">
          <span class="font-22 iconfont margin2 icon-polygon"></span>
          多边形选点
        </p>
      </div>
      <div class="search-popup" v-show="isShow">
        <search-popup
          title="查找选点"
          ref="searchPopup"
          @hide="hide"
          @selectLocation="selectLocation"
          @querySearchAsync="querySearchAsync"
        ></search-popup>
      </div>
    </div>
</template>

<script>
  import searchPopup from "./searchPopup";
  export default {
    name: "drawType",
    components: {
      searchPopup
    },
    data() {
      return {
        isShow: false,
        activeIndex: null
      }
    },
    methods: {
      cancleSelect() {
        this.activeIndex = null
      },
      querySearchAsync(str) {
        this.$emit('querySearchAsync', str)
      },
      selectLocation(val) {
        this.$emit('drawTypeSelect', val, 'select')
      },
      drawTypeSelect(e, type, index) {
        this.activeIndex = index
        this.$emit('drawTypeSelect', {x: e.clientX, y: e.clientY}, type)
      },
      setSearchList(list) {
        this.$refs.searchPopup.setSearchList(list)
      },
      hide() {
        this.isShow = false
        this.cancleSelect()
      },
      showSearchPop(index) {
        this.activeIndex = index
        this.isShow = true
      },
    }
  }
</script>

<style scoped lang='scss'>
  .draw-type-c {
    background: #ffffff;
    position: relative;
    line-height: 50px;
  }
  .search-popup {
    position: absolute;
    top: 60px;
  }
  .ul-p {
    font-size: 14px;
    line-height: 20px;
    display: inline-block;
    vertical-align: middle;
    position: relative;
  }
  .selectType {
    padding: 0 20px;
  }
  .margin2 {
    margin-right: 8px;
  }
  .font-22 {
    font-size: 22px;
    color: #8D8D8E;
    vertical-align: middle;
  }
  .active {
    color: $color-main;
    .font-22 {
      color: $color-main;
    }
  }
</style>
