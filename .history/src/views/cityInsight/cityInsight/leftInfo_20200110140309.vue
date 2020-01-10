<template>
  <div class="ul hand">
    <p class="border-right ul-p" :class="isShow[0]?'active': ''" @click="toggle(0)">
      <span class="iconfont icon2 icon-ziyuan"></span>
      <span class="text">{{city.name}}</span>
      <span class="iconfont icon1 icon-icon-test" :class="isShow[0]?'icon-down': 'icon-up'"></span>
    </p>
    <p class="border-right ul-p" :class="isShow[1]?'active': ''" @click="toggle(1)">
      <span class="iconfont icon2 icon-icon-"></span>
      <span class="text">筛选</span>
      <span class="iconfont icon1 icon-icon-test" :class="isShow[1]?'icon-down': 'icon-up'"></span>
    </p>
  </div>
</template>

<script>
  export default {
    name: "leftInfo",
    props: {
      city: {
        type: Object,
        required: true
      },
      isShow: {
        type: Object,
        required: true
      },
    },
    data() {
      return {
      }
    },
    created() {
    },
    methods: {
      toggle(type) {
        this.$emit('toggle', type)
      },
    },
  }
</script>

<style scoped lang='scss'>
  .ul {
    background:rgba(255,255,255,1);
    box-shadow:0px 3px 5px 0px rgba(0, 0, 0, 0.1);
    line-height: 50px;
  }
  .active {
    color: $color-main;
    .iconfont {
      color: $color-main;
    }
  }
  .icon-up {
    transform: rotate(-180deg);
  }
  .icon-down {
    transform: rotate(0deg);
  }
  .text {
    margin: 0 8px;
  }
  .icon1 {
    color: $color-split-line2;
    transition: 0.5s;
    font-size: 12px;
  }
  .icon2 {
    color: #ACACAC;
    font-size: 13px;
  }
  .ul-p {
    line-height: 20px;
    display: inline-block;
    vertical-align: middle;
    position: relative;
    padding: 0 10px;
  }
</style>
