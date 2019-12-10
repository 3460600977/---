<template>
  <el-dialog 
    :visible.sync="confirmMsgShow"
    width="1200px" 
    class="confirm-box">
    <div class="title">确认投放方案信息</div>
    <div class="confirm-content">
      <div class="sub-title">确认投放方案信息</div>
      <el-tabs class="thin-tab" v-model="activeTab">

        <el-tab-pane label="方案信息" name="plan">
          <el-form ref="form" :model="form" label-position='left' label-width="150px">
            <el-form-item label="投放方案名称">
              <span class="color-text-1">广告创意</span>
            </el-form-item>
            <el-form-item label="投放方案行业">
              <span class="color-text-1">广告创意</span>
            </el-form-item>
            <el-form-item label="投放类型">
              <span class="color-text-1">广告创意</span>
            </el-form-item>
            <el-form-item label="投放时间">
              <span class="color-text-1">广告创意</span>
            </el-form-item>
            <el-form-item label="投放方式">
              <span class="color-text-1">广告创意</span>
            </el-form-item>
            <el-form-item label="投放频次">
              <span class="color-text-1">广告创意</span>
            </el-form-item>
            <el-form-item label="投放时长">
              <span class="color-text-1">广告创意</span>
            </el-form-item>
            <el-form-item label="屏幕类型">
              <span class="color-text-1">广告创意</span>
            </el-form-item>
            <el-form-item class="bold" label="总计">
              <span class="color-red">广告创意</span>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="楼盘信息" name="build">
          <buildMsgList/>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog
      class=""
      width="30%"
      title="内层 Dialog"
      :visible.sync="innerVisible"
      append-to-body>
    </el-dialog>
    <div slot="footer" class="dialog-footer center">
      <el-button class="map-btn" @click="$emit('update:confirmMsgShow', false)">取消投放</el-button>
      <el-button class="map-btn" type="primary">确认并关闭</el-button>
      <el-button class="map-btn" type="primary">确认并编辑创意</el-button>
      <!-- <el-button type="primary" @click="innerVisible = true">打开内层 Dialog</el-button> -->
    </div>
  </el-dialog>
</template>

<script>
import buildMsgList from './buildMsgList'
export default {
  components: {
    buildMsgList
  },
  props: {
    confirmMsgShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeTab: 'build'
    }
  },
}
</script>

<style lang="scss">
.confirm-box{
  .title{
    margin: -30px -30px 0;
    padding: 23px 30px;
    font-size: 16px;
    color: $color-text;
    border-bottom: 1px solid rgba(229,231,233,1);
  }
  .el-dialog__header{
    display: none;
  }
  .el-dialog__body{
    padding: 30px;
    .confirm-content{
      width:100%;
      .sub-title{
        padding: 30px 0 17px;
        font-size:14px;
      }
      .el-tabs.thin-tab .el-tabs__active-bar{
        height: 1px;
      }
      .el-tabs__nav-wrap{
        border-bottom: 1px solid #E5E7E9;
      }
      .el-tabs.thin-tab .el-tabs__item.is-active{
        color: $color-main;
      }
      .el-form-item__label{
        color: $color-text;
      }
      .el-tabs__active-bar{
        display: none;
      }
      .el-tabs__item{
        margin-right: 93px;
        padding: 0;
        &.is-active{
          border-bottom: 1px solid $color-main;
        }
      }
    }
  }
  .el-dialog__footer{
    padding: 12px 0 40px;
    .map-btn{
      &+.map-btn{
        margin-left: 60px;
      }
      width: 136px;
    }
  }
}
</style>