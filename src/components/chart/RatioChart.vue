<template>
    <div v-if="ratioArr.length" class="ratio mid-row">
      <div class="item" v-for="(item, index) in ratioArr" :style="{'width': item.width}" :key="index">
        <p class="text font-number" :style="item.textStyle">{{item.width}}</p>
        <div class="box" :style="item.style"></div>
      </div>
    </div>
</template>

<script>
  export default {
    name: "RatioChart",
    props: {
      height: {
        type: Number,
        required: true
      },
      dataArr: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        total: 0,
        ratioArr: []
      }
    },
    created() {
      this.total = this.$tools.operation(this.dataArr, 'value', 'sum')
      this.ratioArr = this.dataArr.map((item) => {
        let w = (item.value / this.total * 100).toFixed(2)
        return {textStyle: item.textStyle, width: `${w}%`,style: `${item.style}height: ${this.height}px`}
      })
    }
  }
</script>

<style scoped lang='scss'>
.ratio {
  width: 100%;
  .text {
    margin-bottom: 20px;
  }
  .box {
    width: 100%;
  }
}
</style>
