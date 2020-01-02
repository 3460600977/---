<template>
    <div class="width ab" ref="container">
      <div class="width" ref="slot">
        <slot v-show="isShow"></slot>
      </div>
      <div class="slider-item hand" @click="togglePanel">
        <i class="iconfont color-text-1" :class="isShow?'icon-icon-test2':'icon-icon-test1'"></i>
      </div>
    </div>
</template>

<script>
  export default {
    name: "slideContainer",
    data() {
      return {
        isShow: true,
        width: 0,
      }
    },
    mounted() {
      this.width = this.$refs.container.style.width
    },
    methods: {
      showPanel() {
        if (!this.isShow) {
          this.isShow = true
          this.$refs.container.style = `transform: translateX(0px)`
        }
      },
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
  .width{
    width: auto;
    height: 100%;
  }
  .ab {
    position: absolute;
    height: 100%;
    right: 0;
    z-index: 99;
    transition: 0.5s;
  }
.container {
  position: absolute;
  height: 100%;
  right: 0;
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
