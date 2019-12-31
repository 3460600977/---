<!-- 确认投放信息楼盘列表 -->
<template>
  <div class="build-msg-list">
    <div class="build-title mid-between">
      <div>
        <span>已选择楼盘 <span class="color-main font16">{{list.length}}</span> 个</span>,
        <span> 可售设备 <span class="color-main font16">{{deviceTotal}}</span> 个</span>
      </div>
    </div>
    <ul class="build-msg-item-box">
      <li class="item mid color-text" v-for="(item, index) in list" :key="index">
        <div class="left-info">
          <p class="name">{{item.premiseName}}</p>
        </div>
        <span>{{item.deviceNum}} 部</span>
      </li>
      <!-- <li class="item clearfix">
        <el-pagination
          class="float-right"
          background
          layout="total, sizes, prev, pager, next"
          :total="20">
        </el-pagination>
      </li> -->
    </ul>
    
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => {return []}
    }
  },
  computed: {
    deviceTotal() {
      let res = 0;
      this.list.forEach(item => {
        res += +item.deviceNum;
      })
      return res;
    }
  },
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
  .build-msg-item-box{
    max-height: 482px;
    overflow-y: auto;
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
}
  
</style>