<template>
    <div ref="chartBox" class="chartBox">
      <img src="@/assets/images/icon_dialplate.png" alt="" class="bg">
      <img
        src="@/assets/images/icon_pointer.png"
        alt=""
        :style="{'transform': `rotate(${rotate}deg) translateX(-50%)`}"
        class="pointer"
      >
      <div class="desc">
        <p class="font-20 font-number">{{toThousands(displayData, false)}}</p>
        <p class="color-text-1">覆盖人次</p>
      </div>
    </div>
</template>

<script>
  export default {
    name: "DashBoard",
    props: {
      total: {
        type: Number,
        required: true
      },
      value: {
        type: Number,
        required: true
      },
      // 覆盖人数
      displayData: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        rotate: 0,
        toThousands: this.$tools.toThousands,
        totalDeg: 220 // 仪表盘总共度数是220deg
      }
    },
    mounted() {
      this.getRotate()
    },
    watch: {
      value() {
        this.getRotate()
      },
    },
    methods: {
      getRotate() {
        if (this.value >= this.total) {
          this.rotate = this.totalDeg/2
          return
        }
        this.rotate = parseInt(this.value / this.total * this.totalDeg, 10) - this.totalDeg/2
      },
    }
  }
</script>

<style scoped lang='scss'>
.chartBox {
  width: 100%;
  height: 100%;
  position: relative;
  .bg {
    width: 100%;
  }
  .desc {
    position: absolute;
    bottom: 13px;
    width: 100%;
    text-align: center;
  }
  .pointer {
    position: absolute;
    height: 67px;
    left: 50%;
    transform-origin: 0px 60px;
    bottom: 59px;
    transition: 0.5s;
  }
}
</style>
