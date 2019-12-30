<template>
    <div class="left-select">
      <div style="
      padding: 17px 0 21px;
      background: #fff;
      font-size:14px;
      line-height: 1.15;
      width:170px;
      height:245px;
      border:1px solid rgba(229,231,233,1);
      box-shadow:0px 3px 5px 0px rgba(0, 0, 0, 0.1);
      border-radius:4px;"
      >
        <div style="padding: 0 15px 14px;border-bottom: 1px solid #FFE5E7E9">
          <div class="mid-between">
            <p>东郊记忆</p>
            <i style="height: 16px;width: 16px;background: #ededed;display: block"></i>
          </div>
          <div class="mid-between color-main" style="margin-top: 15px">
            <p>娱乐</p>
            <p class="font-number">98</p>
          </div>
        </div>
        <div style="padding: 0 15px 0;">
          <div class="mid-between" style="color: #999999FF;margin-top: 15px">
            <p>1.娱乐</p>
            <p class="font-number">98</p>
          </div>
          <div class="mid-between" style="color: #999999FF;margin-top: 15px">
            <p>1.娱乐</p>
            <p class="font-number">98</p>
          </div>
          <div class="mid-between" style="color: #999999FF;margin-top: 15px">
            <p>1.娱乐</p>
            <p class="font-number">98</p>
          </div>
          <p class="color-main text-center" style="margin-top: 34px">更多</p>
        </div>
      </div>
      <ul class="left-ul">
        <li>
          <span>成都市</span>
        </li>
        <li>
          <span>成都市</span>
        </li>
        <li>
          <span>查找选点</span>
        </li>
        <li>
          <span @click="(e) => drawTypeSelect(e, 'circle')">手动选点</span>
        </li>
        <li>
          <span @click="(e) => drawTypeSelect(e, 'polyline')">折线选点</span>
        </li>
        <li>
          <span @click="(e) => drawTypeSelect(e, 'polygon')">多边形选点</span>
        </li>
      </ul>
    </div>
</template>

<script>
  export default {
    name: "leftSelect",
    methods: {
      drawTypeSelect(e, type) {
        this.$emit('drawTypeSelect', {x: e.clientX, y: e.clientY}, type)
      },
    },
  }
</script>

<style scoped lang='scss'>
.left-select {
  background: #fff;
  line-height:38px;
  box-shadow:0px 3px 5px 0px rgba(0, 0, 0, 0.1);
  border-radius:2px;
  width: 778px;
  color: $color-text;
  .left-ul {
    font-size: 0;
    li {
      display: inline-block;
      font-size: 16px;
      padding: 0 12px;
      cursor: pointer;
    }
  }
}

</style>
