<template>
  <div class="selected-list">
    <div class="title mid-between">

      <div>
        <span>已选择楼盘 <span class="color-main font16">{{buildsNumber}}</span> 个</span>
        <span>, 可售设备 <span class="color-main font16">{{deviceNumber}}</span> 个</span>
      </div>

      <el-button :loading="exporting" @click="buildsListExport" v-show="buildsNumber > 0" size="small">下载</el-button>

    </div>

    <ul class="selected-list-data-box" v-if="buildsNumber > 0" v-loading='loading'>
      <li class="item mid" v-for="(item, index) in putProject.list" :key="index">

        <div class="left-info">
          <p class="name">{{item.premiseName}}</p>
          <p class="addr font-12 color-text-1">{{item.address}}</p>
        </div>

        <div class="account">
          <span class="font-16 number">{{item.deviceNum || 0}}</span><span class="font-14">个</span>
        </div>

        <DelCirclrButton @click.native="$emit('update:data', $tools.removeArrayItemByIndex(putProject.list, index))" class="delete-item"/>

      </li>

      <!-- 分页 -->
      <!-- <li class="item clearfix">
        <el-pagination
          class="float-right"
          background
          layout="total, sizes, prev, pager, next"
          :total="20">
        </el-pagination>
      </li> -->
    </ul>

    <div v-if="buildsNumber <= 0" v-loading='loading' style="padding: 30px; flex-direction: column;" class="mid-center">
      <img width="70" :src="nodataImg" alt=""><br>
      <div class="color-text-2">无数据</div>
    </div>
  </div>
</template>
<script>
import DelCirclrButton from '../../../../../../components/DelCircleButton'
import { mapGetters, mapState } from 'vuex'
export default {
  props: {
    loading: {
      type: Boolean,
      default: true,
    }
  },

  data() {
    return {
      nodataImg: require('../../../../../../assets/images/icon_no_data.png'),
      exporting: false,
    }
  },

  components: {
    DelCirclrButton
  },

  methods: {
    // 导出列表
    buildsListExport() {
      let param = [];
      this.list.forEach(item => {
        param.push({
          address: item.address,
          deviceNum: item.deviceNum,
          premiseName: item.premiseName
        })
      })
      this.exporting = true;

      this.$api.PutProject.ExportBuildsByMsg(param)
        .then(res => {
          this.exporting = false;
          this.$tools.downLoadFileFlow(res, `楼盘列表${this.$tools.getFormatDate("YYmmdd")}.csv`)
        })
        .catch(res => {
          this.exporting = false;
        })
    }
  },

  computed: {
    ...mapGetters([
      'buildsNumber',
      'deviceNumber',
      'peopleNumber',
      'priceNumber'
    ]),
    ...mapState(['putProject'])
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
  .selected-list-data-box{
    max-height: 76px * 6;
    overflow-y: auto;
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
}
  
</style>