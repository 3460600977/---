<template>
  <el-dialog 
    :visible.sync="mapChooseShow"
    width="1200px" 
    class="map-choose">
    <div class="map-box">
      地图
    </div>
    <el-dialog
      class=""
      width="30%"
      title="内层 Dialog"
      :visible.sync="innerVisible"
      append-to-body>
    </el-dialog>
    <div slot="footer" class="dialog-footer center">
      <el-button class="map-btn" @click="$emit('update:mapChooseShow', false)">取 消</el-button>
      <el-button class="map-btn" type="primary">保存</el-button>
      <!-- <el-button type="primary" @click="innerVisible = true">打开内层 Dialog</el-button> -->
    </div>
  </el-dialog>
</template>

<script>

export default {
  props: {
    mapChooseShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      innerVisible: false
    }
  },
}
</script>

<style lang="scss">
.map-choose{
  .el-dialog__header{
    display: none;
  }
  .el-dialog__body{
    padding: 25px;
    .map-box{
      background-color: red;
      width:100%;
      height:724px;
    }
  }
  .el-dialog__footer{
    padding: 12px 0 40px;
    .map-btn{
      &+.map-btn{
        margin-left: 60px;
      }
      width: 100px;
    }
  }
}
</style>