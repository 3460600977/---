<template>
  <div class="people-alalysis">
    <!-- 人群分析 -->
    <headerCondition/>

    <!-- 地域分析 -->
    <!-- <arealDistribution/> -->

    <!-- 常规属性 -->
    <el-card class="box-card area-distibution">
      <div class="report-form-title">
        常规属性
      </div>

      <Histogram/>
    </el-card>
  </div>
</template>

<script>
import headerCondition from './modeles/headerCondition'
import arealDistribution from './modeles/arealDistribution'
import Histogram from '@/components/chart/Histogram.vue'

export default {
  components: {
    headerCondition,
    arealDistribution,
    Histogram
  },
  data() {
    return {
      
    }
  },
}
</script>

<style lang="scss">
  .people-alalysis{
    padding: 0 20px 20px;
  }
</style>