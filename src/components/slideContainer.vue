<template>
    <div class="container">
      <div class="container" ref="container">
        <slot></slot>
        <div class="slider-item" @click="togglePanel">
          <i class="iconfont color-text-1" :class="isShow?'icon-icon-test2':'icon-icon-test1'"></i>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    name: "slideContainer",
    data() {
      return {
        isShow: true
      }
    },
    methods: {
      togglePanel() {
        let width = this.$refs.container.scrollWidth
        if (!this.isShow) {
          this.$refs.container.style = `transform: translateX(0px)`
        } else {
          this.$refs.container.style = `transform: translateX(${width}px)`
        }
        this.isShow = !this.isShow
      },
    }
  }
</script>

<style scoped lang='scss'>
.container {
  position: relative;
  transition: 0.5s;
  .slider-item {
    position: absolute;
    left: -40px;
    background-color: #fff;
    width: 40px;
    top: 50%;
    transform: translateY(23px);
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    z-index: 1;
  }
}
</style>
