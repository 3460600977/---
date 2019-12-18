<template>
    <div v-if="ratioArr.length" class="ratio">
      <slot name="text" :ratioArr="ratioArr">{{ratioArr}}</slot>
      <div class="mid-between">
        <div class="item" v-for="(item, index) in ratioArr" :style="item.style" :key="index"></div>
      </div>
      <slot name="bottom" :ratioArr="ratioArr">{{ratioArr}}</slot>
<!--      <div class="item" v-for="(item, index) in ratioArr" :style="{'width': item.width}" :key="index">-->
<!--        <p class="text font-number" :style="item.textStyle">{{item.width}}</p>-->
<!--        <div class="box" :style="item.style"></div>-->
<!--      </div>-->
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
        return {...item, style: `${item.style}width: ${w}%`, width: `${w}%`}
      })
      console.log(this.ratioArr)
    }
  }
</script>

<style scoped lang='scss'>
.ratio {
  width: 100%;
  .item {
    height: 25px;
  }
  .text {
    margin-bottom: 20px;
  }
  .box {
    width: 100%;
  }
}
</style>
