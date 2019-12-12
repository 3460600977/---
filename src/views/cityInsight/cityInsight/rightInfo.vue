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
            <p class="margin-top-10"><span class="font-number font-20">{{selectedBuildings.length}}</span>个</p>
          </div>
          <div class="float-left">
            <p class="color-text-1">设备数</p>
            <p class="margin-top-10"><span class="font-number font-20">{{deviceCount}}</span>个</p>
          </div>
        </div>
      </div>
      <div class="text-center">
        <div class="chart">
          <dash-board :displayData="coveredPeople" :total="120" :value="selectedBuildings.length"></dash-board>
        </div>
      </div>
      <div class="margin1" v-show="pathArrCopy.length">
        <p>选点</p>
        <ul class="list margin2 border-bottom">
          <li class="list-item mid-between" v-for="(item, index) in pathArrCopy" :key="index">
            <p>选点{{item.index}}</p>
            <span class="iconfont icon-remove icon-error" @click="deletePath(item)"></span>
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
      },
      selectedBuildings: {
        type: Array,
        required: true
      },
      pathArr: {
        type: Object,
        required: true
      },
    },
    data() {
      return {
        val: 0,
        maxVal: 100,
        deviceCount: 0,
        coveredPeople: 0,
        pathArrCopy: [],
      }
    },
    created() {
      this.val = this.budget * this.maxVal
      this.renderDatas(this.selectedBuildings)
      this.pathArrCopy = Object.values(this.pathArr)
      console.log(this.pathArrCopy)
    },
    watch: {
      selectedBuildings(val) {
        this.renderDatas(val)
      },
      pathArr(val) {
        console.log(val)
        this.pathArrCopy = Object.values(val)
        console.log(this.pathArrCopy)
      },
    },
    methods: {
      formatTooltip(val) {
        return val+'%'
      },
      budgetChange(val) {
        this.$emit('budgetChange', val / this.maxVal)
      },
      renderDatas(arr) {
        this.deviceCount = 0
        this.coveredPeople = 0
        arr.forEach((item) => {
          this.deviceCount += item.signElevatorNum
          this.coveredPeople += item.totalPeople
        })
      },
      deletePath(key) {
        this.$emit('deletePath', key)
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
