<template>
  <el-tabs class="my-tabs" v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="投放计划" name="plan">投放计划</el-tab-pane>
    <el-tab-pane label="投放方案" name="project">投放方案</el-tab-pane>
    <el-tab-pane label="广告创意" name="creative">广告创意</el-tab-pane>
  </el-tabs>
</template>

<script>
    export default {
        name: "topTabs",
        data() {
            return {
                activeName: 'second'
            };
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
            }
        }
    }
</script>

<style scoped>

</style>
