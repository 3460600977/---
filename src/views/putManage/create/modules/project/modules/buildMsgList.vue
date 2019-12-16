<template>
  <div class="build-msg-list">
    <div class="build-title mid-between">
      <div>
        <span>已选择楼盘 <span class="color-main font16">3</span> 个</span>,
        <span> 可售设备 <span class="color-main font16">345</span> 个</span>
      </div>
    </div>
    <ul>
      <li class="item mid color-text" v-for="i in 10" :key="i">
        <div class="left-info">
          <p class="name">汇丰公寓</p>
        </div>
        <span>20个</span>
      </li>
      <li class="item clearfix">
        <el-pagination
          class="float-right"
          background
          layout="total, sizes, prev, pager, next"
          :total="20">
        </el-pagination>
      </li>
    </ul>
    
  </div>
</template>
<script>
import DelCirclrButton from '../../../../../../components/DelCircleButton'
export default {
  components: {
    DelCirclrButton
  }
}
</script>

<style lang="scss" scoped>
.build-msg-list{
  margin-top: 40px;
  width:538px;
  border:1px solid rgba(229,231,233,1);
  .build-title{
    height: 48px;
    padding: 0 11px;
    line-height: 44px;
    font-weight: bold;
    background:rgba(249,252,255,1);
  }
  .item{
    position: relative;
    border-top:1px solid rgba(229,231,233,1);
    padding: 14px 11px;
    .left-info{
      width: 440px;
      .name{
        height: 14px;
        line-height: 14px;
      }
    }
  }
}
  
</style>