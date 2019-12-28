<template>
  <div>
    <div class="ul border-right hand">
      <p class="border-right ul-p">
        <span class="iconfont icon2 icon-ziyuan"></span>
        <span class="text">成都市</span>
        <span class="iconfont icon1 icon-icon-test"></span>
      </p>
      <p class="border-right ul-p">
        <span class="iconfont icon2 icon-icon-"></span>
        <span class="text">筛选</span>
        <span class="iconfont icon1 icon-icon-test"></span>
      </p>
    </div>
    <div class="city-select select-style">
      <singleSelect-popup
        v-if="cityDatas.length"
        title="城市列表"
        :selectDatas="cityDatas"
        :filters="cityFilter"
        @hide="() => hide(1)"
        @returnResult="(val) => returnResult(val, 1)"
      ></singleSelect-popup>
    </div>
  </div>
</template>

<script>
  const CITY_MAPPING = {
    1: '一线城市:',
    2: '二线城市:',
    3: '三线城市:'
  }
  import singleSelectPopup from "../../../components/map/singleSelectPopup";
  export default {
    name: "leftInfo",
    components: {
      singleSelectPopup
    },
  }
</script>

<style scoped lang='scss'>
  .ul {
    background:rgba(255,255,255,1);
    box-shadow:0px 3px 5px 0px rgba(0, 0, 0, 0.1);
    line-height: 50px;
  }
  .text {
    margin: 0 8px;
  }
  .icon1 {
    color: $color-split-line2;
  }
  .icon2 {
    color: #ACACAC;
    font-size: 12px;
  }
  .ul-p {
    line-height: 20px;
    display: inline-block;
    vertical-align: middle;
    position: relative;
    padding: 0 10px;
  }
  .select-style {
    position: absolute;
    top: 60px;
  }
  .city-select {
    left: 114px;
  }
</style>
