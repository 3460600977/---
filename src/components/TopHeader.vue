<template>
  <header class="top-header">
    <div class="logo mid-center">
      <span class="color-white">新潮LOGO</span>
    </div>
    <el-menu 
      :default-active="activeIndex"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b" 
      class="header-menu" 
      mode="horizontal" 
      @select="handleSelect">
      <el-menu-item index="1">处理中心</el-menu-item>
      <el-submenu index="2" 
        :show-timeout="0"
        >
        <template slot="title">我的工作台</template>
        <el-menu-item index="2-1">选项1</el-menu-item>
        <el-menu-item index="2-2">选项2</el-menu-item>
        <el-menu-item index="2-3">选项3</el-menu-item>
        <el-submenu index="2-4">
          <template slot="title">选项4</template>
          <el-menu-item index="2-4-1">选项1</el-menu-item>
          <el-menu-item index="2-4-2">选项2</el-menu-item>
          <el-menu-item index="2-4-3">选项3</el-menu-item>
        </el-submenu>
      </el-submenu>
    </el-menu>
  </header>
</template>

<script>
export default {
  name: 'TopHeader',
  data () {
    return {
      activeIndex: '1',

    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<style scoped lang="scss">
  .top-header{
    width: 100%;
    flex-shrink: 0;
    background-color: #545c64;
    .logo{
      float: left;
      width: 120px;
    }
    .header-menu{
      float: left;
    }
  }
</style>
