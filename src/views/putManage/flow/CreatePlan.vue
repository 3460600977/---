<template>
  <div style="height: 300px;">
    <el-steps direction="vertical" :active="1">
      <el-step title="步骤 1">
        <div slot="description">
          <div v-for="step1 in step1_des">{{ step1 }}</div>
        </div>
      </el-step>
      <el-step title="步骤 2">
        <div slot="description">
          <div v-for="step2 in step2_des">{{ step2 }}</div>
        </div>
      </el-step>
      <el-step title="步骤 3" style=" white-space: pre-line;">
        <div slot="description">
          <div v-for="step3 in step3_des">{{ step3 }}</div>
        </div>
      </el-step>
    </el-steps>
  </div>
</template>

<script>
    export default {
        name: "CreatePlan",
        data() {
            return {
                step1_des: ['投放目的', '投放计划名称'],
                step2_des: ['投放设置', '楼盘定向', '投放方案名称'],
                step3_des: ['制作创意', '创意资质', '广告创意名称'],
            };
        },
    }
</script>

<style scoped lang="scss">

</style>
