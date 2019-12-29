<template>
  <div class="selected-list">
    <template v-if="buildingDirectionActiveType === 'exist'">
      <ul class="selected-list-data-box" v-loading='loading'>
        <noData v-if="buildsNumber <= 0 || deviceNumber <= 0">无可售数据</noData>

        <li v-else class="item mid" v-for="(item, index) in existList" :key="index">

          <div class="left-info exist"><p class="name">{{item.name}}</p></div>

          <div class="account">
            <span class="font-16 number">{{item.value || 0}}</span>
            <span class="font-14" v-if="item.name === '覆盖人次'">人</span>
            <span class="font-14" v-else>个</span>
          </div>
        </li>
      </ul>
    </template>

    <template v-if="buildingDirectionActiveType === 'create'">
      <div class="title mid-between">

        <div>
          <span>已选择楼盘 <span class="color-main font16">{{buildsNumber}}</span> 个</span>
          <span>, 可售设备 <span class="color-main font16">{{deviceNumber}}</span> 个</span>
        </div>

        <el-button :loading="exporting" @click="buildsListExport" v-show="buildsNumber > 0" size="small">下载</el-button>

      </div>

      <ul class="selected-list-data-box" v-loading='loading'>
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
        <noData v-if="buildsNumber <= 0">无可售数据</noData>
      </ul>
    </template>

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
    },
    buildingDirectionActiveType: {
      type: String,
      default: 'exist',
    },
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
      'unitNum'
    ]),
    ...mapState(['putProject']),

    existList() {
      let res = [
        { name: '楼盘数',  value: this.buildsNumber},
        { name: '单元数',  value: this.unitNum},
        { name: '点位数',  value: this.deviceNumber},
        { name: '覆盖人次', value: this.peopleNumber},
      ];
      return res;
    }
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
    border-bottom: 1px solid rgba(229,231,233,1);

  }
  .selected-list-data-box{
    max-height: 76px * 6;
    overflow-y: auto;
    .item{
      position: relative;
      padding: 20px 45px 17px 20px;
      &+.item{
        border-top:1px solid rgba(229,231,233,1);
      }
      .left-info{
        width: 288px;
        padding-right: 20px;
        &.exist{
          .name{
            margin-bottom: 0;
          }
        }
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
        color: $color-text-1;
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