<template>
    <div class="right-info-wrapper">
      <p class="font-16">投放预算</p>
      <div class="mid-between color-text-1 margin2">
        <span>低</span>
        <el-slider
          class="flex1 slider"
          v-model="val"
          @change="budgetChange"
          :format-tooltip="formatTooltip"
        ></el-slider>
        <span>高</span>
      </div>
      <p class="font-16 margin1">投放预估数</p>
      <div class="content">
        <div class="clearfix">
          <div class="float-left buldingNum">
            <p class="color-text-1">楼盘数</p>
            <p class="margin-top-10"><span class="font-number font-20">100</span>个</p>
          </div>
          <div class="float-left">
            <p class="color-text-1">设备数</p>
            <p class="margin-top-10"><span class="font-number font-20">100</span>个</p>
          </div>
        </div>
      </div>
      <div class="text-center">
        <div class="chart">
          <dash-board></dash-board>
        </div>
      </div>
      <div class="margin1">
        <p>选点</p>
        <ul class="list margin2 border-bottom">
          <li class="list-item mid-between">
            <p>选点1</p>
            <img src="@/assets/images/icons/icon_remove.png" alt="" class="icon-remove">
          </li>
          <li class="list-item mid-between">
            <p>选点1</p>
            <img src="@/assets/images/icons/icon_remove.png" alt="" class="icon-remove">
          </li>
          <li class="list-item mid-between">
            <p>选点1</p>
            <img src="@/assets/images/icons/icon_remove.png" alt="" class="icon-remove">
          </li>
          <li class="list-item mid-between">
            <p>选点1</p>
            <img src="@/assets/images/icons/icon_remove.png" alt="" class="icon-remove">
          </li>
          <li class="list-item mid-between">
            <p>选点1</p>
            <img src="@/assets/images/icons/icon_remove.png" alt="" class="icon-remove">
          </li>
        </ul>
      </div>
      <div style="margin-top: 14px;text-align: center">
        <el-button type="primary" class="btn">创建资源包</el-button>
      </div>
    </div>
</template>

<script>
  import DashBoard from "../../../components/chart/DashBoard";
  export default {
    name: "info",
    components: {
      DashBoard
    },
    props: {
      budget: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        val: 0,
        maxVal: 100
      }
    },
    created() {
      this.val = this.budget * this.maxVal
    },
    methods: {
      formatTooltip(val) {
        return val+'%'
      },
      budgetChange(val) {
        this.$emit('budgetChange', val / this.maxVal)
      },
    }
  }
</script>

<style scoped lang='scss'>
.right-info-wrapper {
  width: 312px;
  line-height: 1.15;
  padding: 20px 20px 15px;
  .btn {
    width: 194px;
  }
  .list {
    padding-bottom: 10px;
    .list-item {
      line-height:36px;
      color: $color-main;
      padding: 0 11px;
      margin-bottom: 12px;
      background:rgba(255,255,255,1);
      box-shadow:0px 4px 10px 0px rgba(118,118,118,0.16);
      border-radius:2px;
      .icon-remove {
        width: 18px;
      }
    }
  }
  .slider {
    margin: 0 10px;
  }
  .margin1 {
    margin-top: 20px;
  }
  .margin2 {
    margin-top: 20px;
  }
  .content {
    padding: 22px 0 29px;
    .buldingNum {
      margin-right: 113px;
    }
    .margin-top-10 {
      margin-top: 10px;
    }
  }
  .chart {
    width:154px;
    height:154px;
    display: inline-block;
  }
}
</style>
