<template>
    <div class="draw-type-c">
      <div class="hand font0 font-0">
        <p class="ul-p selectType border-right"
           title="查找选点"
           @click="showSearchPop(0)"
           :class="{'active': activeIndex === 0}">
          <span class="icon1 iconfont margin2 icon-locating"></span>
          查找选点
        </p>
        <p class="ul-p selectType border-right"
           title="手动选点"
           :class="{'active': activeIndex === 1}"
           @click="(e) => drawTypeSelect(e, 'circle', 1)">
          <span class="icon1 iconfont margin2 icon-reconnaissance1"></span>
          手动选点
        </p>
        <p class="ul-p selectType border-right"
           title="折线选点"
           :class="{'active': activeIndex === 2}"
           @click="(e) => drawTypeSelect(e, 'polyline', 2)">
          <span class="icon1 iconfont margin2 icon-brokenline"></span>
          折线选点
        </p>
        <p class="ul-p selectType"
           title="多边形选点"
           :class="{'active': activeIndex === 3}"
           @click="(e) => drawTypeSelect(e, 'polygon', 3)">
          <span class="icon1 iconfont margin2 icon-polygon"></span>
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
  const MAX_COUNT = 5
  export default {
    name: "drawType",
    components: {
      searchPopup
    },
    props: {
      length: { // 当前选点的个数
        type: Number,
        required: true
      },
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
        if (this.length >= MAX_COUNT) {
          this.$message.error('最多只能进行五次选点操作！');
          return
        }
        this.activeIndex = index
        this.isShow = false
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
        if (!this.isShow) {
          if (this.length >= MAX_COUNT) {
            this.$message.error('最多只能进行五次选点操作！');
            return
          }
          this.activeIndex = index
          this.isShow = !this.isShow
          this.$emit('searchDrawTypeClick')
        } else {
          this.isShow = !this.isShow
        }
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
  .icon1 {
    font-weight: bolder;
    font-size: 15px;
    color: #8D8D8E;
    vertical-align: middle;
  }
  .active {
    color: $color-main;
    .icon1 {
      color: $color-main;
    }
  }
</style>
