<template>
  <div class="selected-list">
    <div class="title mid-between">
      <div>
        <span>已选择楼盘 <span class="color-main font16">3</span> 个</span>,
        <span> 可售设备 <span class="color-main font16">345</span> 个</span>
      </div>
      <el-button size="small">下载</el-button>
    </div>
    <ul>
      <li class="item mid" v-for="i in 2">
        <div class="left-info">
          <p class="name">汇丰公寓</p>
          <p class="addr font-12 color-text-1">克孜勒苏柯尔克孜自治州萨健克孜勒苏健克孜勒苏柯尔克孜自治州萨健</p>
        </div>
        <div class="account">
          <span class="font-16 number">20</span><span class="font-14">个</span>
        </div>
        <DelCirclrButton class="delete-item"/>
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
.selected-list{
  margin-top: 40px;
  width: 860px;
  border:1px solid rgba(229,231,233,1);
  .title{
    height: 44px;
    padding: 0 50px 0 20px;
    line-height: 44px;
    font-weight: bold;
    background:rgba(249,252,255,1);
  }
  .item{
    position: relative;
    border-top:1px solid rgba(229,231,233,1);
    padding: 20px 45px 17px 20px;
    .left-info{
      width: 588px;
      padding-right: 20px;
      .name{
        height: 14px;
        line-height: 14px;
        margin-bottom: 12px;
      }
      .addr{
        line-height: 12px;
      }
    }
    .account{
      .number{
        font-weight: bold;
      }
    }
    .delete-item{
      position: absolute;
      right: 72px;
    }
  }
}
  
</style>