<template>
    <div class="left-select">
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
          <span>手动选点</span>
        </li>
        <li>
          <span>折线选点</span>
        </li>
        <li>
          <span>多边形选点</span>
        </li>
      </ul>
    </div>
</template>

<script>
  export default {
    name: "leftSelect"
  }
</script>

<style scoped lang='scss'>
.left-select {
  background: #fff;
  line-height:38px;
  box-shadow:0px 3px 5px 0px rgba(0, 0, 0, 0.1);
  border-radius:2px;
  color: $color-text;
  .left-ul {
    font-size: 0;
    li {
      display: inline-block;
      font-size: 16px;
    }
  }
}
</style>
