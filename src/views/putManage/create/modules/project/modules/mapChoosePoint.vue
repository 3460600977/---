<template>
  <el-dialog 
    :visible.sync="mapChooseShow"
    width="1200px" 
    class="map-choose">
    <div class="map-box">
      
    </div>
    <el-dialog
      class=""
      width="30%"
      title="内层 Dialog"
      :visible.sync="innerVisible"
      append-to-body>
    </el-dialog>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:mapChooseShow', false)">取 消</el-button>
      <el-button type="primary" @click="innerVisible = true">打开内层 Dialog</el-button>
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

<style lang="scss" scoped>
.map-choose{
}
</style>