<template>
  <div class="selected-list" v-loading="loading" :class="{'big': buildingDirectionActiveType !== 'list'}">

    <!-- 选择洞察包 确认支付 -->
    <template v-if="buildingDirectionActiveType === 'exist' || buildingDirectionActiveType === 'payConfirm'">
      <ul class="selected-list-data-box">
        <noData v-if="buildsNumber <= 0 || deviceNumber <= 0">无可售数据</noData>

        <li v-else class="item mid" v-for="(item, index) in existList" :key="index">
          <div class="left-info exist" style="width: 200px;">
            <p class="name">{{item.name}}</p>
          </div>

          <div class="account">
            <span class="font-16 font-number number">&nbsp;{{$tools.toThousands(item.value, false) || 0}}</span>
            <span class="font-14" v-if="item.name === '覆盖人次'">人</span>
            <span class="font-14" v-else>个</span>
          </div>
        </li>
      </ul>
    </template>



    <!-- 地图选点列表 -->
    <template v-if="buildingDirectionActiveType === 'create'">
      <div v-if="deviceNumber > 0" class="title mid-between">
        <div>
          <span>
            已选择楼盘
            <span class="color-main font-number font-16">{{$tools.toThousands(buildsNumber, false)}}</span> 个
          </span>
          <span>
            , 可售设备
            <span class="color-main font-number font-16">{{$tools.toThousands(deviceNumber, false)}}</span> 个
          </span>
        </div>

        <el-button
          class="download-list"
          :loading="exporting"
          @click="buildsListExport"
          size="small"
        >下载</el-button>
      </div>

      <ul class="selected-list-data-box">
        <li class="item mid" v-for="(item, index) in localProject.list" :key="index">
          <div class="base">
            <div class="left-info float-left" style="width: 550px;">
              <p class="name font-14">{{item.premiseName}}</p>
              <span class="font-12 color-text-1">{{item.address}}</span>
            </div>

            <div class="account float-left mid" style="width: 100px; height: 40px;">
              <span class="font-16 number font-number">{{$tools.toThousands(item.deviceNum, false)}}</span>
              <span class="font-14">个</span>
            </div>

            <div class="float-left mid" style="height: 40px;">
              <DelCirclrButton @click.native="removeItem(localProject.list, index)"/>
            </div>
          </div>
        </li>

        <noData v-if="buildsNumber <= 0">无可售数据</noData>
      </ul>
      
      <!-- <el-pagination
        class="float-right margin-top-10"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :small="true"
        :total="1000">
      </el-pagination> -->

    </template>



    <!-- 方案 点位信息 -->
    <template v-if="buildingDirectionActiveType === 'list'">
      <div class="title mid-between">
        <div>
          <span>
            已选择楼盘
            <span class="color-main font-number font16">{{buildsNumber}}</span> 个
          </span>
          <span>
            , 可售设备
            <span class="color-main font-number font16">{{deviceNumber}}</span> 个
          </span>
        </div>

        <el-button
          :loading="exporting"
          @click="buildsListExport"
          v-show="buildsNumber > 0"
          size="small"
        >下载</el-button>
      </div>

        <ul class="selected-list-data-box">
          <li class="item" v-for="(item, index) in localProject.list" :key="index">
            <!-- 名字 -->
            <div class="clearfix base">
              <div class="left-info clearfix float-left" @click="showDevice(item.premiseId, index)">
                <p class="name float-left">{{item.premiseName}}</p>


                <div class="show-device-handle float-left">
                  <i v-if="deviceLoading.index === index && deviceLoading.status" class="el-icon-loading"></i>
                  <i v-else :class="{'active': item.active}" class="el-icon-arrow-down"></i>
                </div>
              </div>

              <div class="account float-left">
                <span class="font-16 number font-number">{{item.deviceNum || 0}}</span>
                <span class="font-14">个</span>
              </div>
            </div>

            <!-- 设备列表 -->
            <ul :style="item.active ? 'height: auto' : 'height: 0'" :class="{'active': item.active}" class="device-list-box">
              <li
                class="color-text-1 font-14 d-item"
                v-for="(itemInner, index) in item.devices"
                :key="index"
              >
                <span class="code">{{itemInner.code}}</span>
                <span>{{itemInner.name}}</span>
              </li>
            </ul>

          </li>

          <noData v-if="buildsNumber <= 0">无可售数据</noData>
        </ul>
    </template>


    
  </div>
</template>
<script>
import DelCirclrButton from "@/components/DelCircleButton";
import { mapGetters, mapState } from "vuex";
export default {
  props: {
    loading: {
      type: Boolean,
      default: true
    },

    /**
     * exist: 统计未寻量出信息
     * payConfirm: 统计出信息 确认支付
     * create: 列表 可以下载删除
     * list: 列表 向下箭头展开设备信息
     */
    buildingDirectionActiveType: {
      type: String,
      default: "exist"
    },
    projectId: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      nodataImg: require("@/assets/images/icon_no_data.png"),
      exporting: false,
      deviceLoading: {
        index: 0,
        status: false
      },
    };
  },

  components: {
    DelCirclrButton
  },

  methods: {
    // 导出列表
    buildsListExport() {
      let param = [];
      this.localProject.list.forEach(item => {
        param.push({
          address: item.address,
          deviceNum: item.deviceNum || item.signElevatorNum,
          premiseName: item.premiseName || item.premisesName
        });
      });
      this.exporting = true;

      this.$api.PutProject.ExportBuildsByMsg(param)
        .then(res => {
          this.exporting = false;
          this.$tools.downLoadFileFlow(
            res,
            `楼盘列表${this.$tools.getFormatDate("YYmmdd")}.csv`
          );
        })
        .catch(res => {
          this.exporting = false;
        });
    },

    // 显示设备列表
    showDevice(premiseId, index) {
      let old = this.localProject.list[index];
      this.localProject.list[index].active = !this.localProject.list[index].active;
      this.deviceLoading = {
        index: index,
        status: true,
      };
      if (old.devices) {
        this.deviceLoading.status = false;
        return false;
      }
      let param = {
        projectId: this.projectId,
        premiseId: premiseId
      };
      this.$api.PutProject.GetBuildDevice(param)
        .then(res => {
          this.deviceLoading.status = false;
          this.$set(this.localProject.list, index, { ...old, devices: res.result, active: true })
        })
        .catch(res => {
          this.deviceLoading.status = false;
        })
    },

    // 删除地图选点列表
    removeItem(list, index) {
      this.$emit('delMapItem', list[index])
      this.$tools.removeArrayItemByIndex(list, index)
    }
  },

  computed: {
    ...mapGetters([
      "buildsNumber", 
      "deviceNumber", 
      "peopleNumber", 
      "unitNum"
    ]),
    
    ...mapState(['putProject']),
    ...mapState({
      localProject: "putProject"
    }),

    existList() {
      let res;

      if (this.buildingDirectionActiveType === 'exist') {
        res = [
          { name: "楼盘数", value: this.putProject.statistics.premiseNum },
          { name: "单元数", value: this.putProject.statistics.unitNum },
          { name: "点位数", value: this.putProject.statistics.deviceNum },
          { name: "覆盖人数", value: this.putProject.statistics.weekForPeople }
        ];
      }

      if (this.buildingDirectionActiveType === 'payConfirm') {
        res = [
          { name: "楼盘数", value: this.buildsNumber },
          { name: "单元数", value: this.unitNum },
          { name: "点位数", value: this.deviceNumber },
          { name: "覆盖人数", value: this.peopleNumber }
        ];
      }

      return res;
    }
  }
};
</script>

<style lang="scss" scoped>
.selected-list {
  // margin-top: 30px;
  width: 540px;
  border: 1px solid rgba(229, 231, 233, 1);
  &.big{
    width: 860px;
  }
  .title {
    height: 44px;
    padding: 0 50px 0 20px;
    line-height: 44px;
    font-weight: bold;
    background: rgba(249, 252, 255, 1);
    border-bottom: 1px solid rgba(229, 231, 233, 1);
    // .download-list{
    //   align-self: flex-end;
    // }
  }
  .selected-list-data-box {
    max-height: 46vh;
    overflow-y: auto;
    .item {
      position: relative;
      padding: 20px 45px 10px 20px;
      & + .item {
        border-top: 1px solid rgba(229, 231, 233, 1);
      }
      .base{
        position: relative;
        background: #fff;
        z-index: 2;
        .left-info {
          width: 388px;
          padding-right: 20px;
          cursor: pointer;
          &.exist {
            .name {
              margin-bottom: 0;
            }
          }
          .name {
            height: 14px;
            line-height: 14px;
            margin-bottom: 12px;
          }
          .show-device-handle {
            cursor: pointer;
            padding: 0 10px;
            height: 100%;
            i {
              transition: 0.3s;
            }
            .active{
              transform: rotate(180deg);
            }
          }
          .addr {
            line-height: 12px;
          }
        }
        .account {
          color: $color-text-1;
          .number {
            font-weight: bold;
          }
        }
      }
      .device-list-box {
        position: relative;
        z-index: 1;
        overflow: hidden; 
        transition: .3s;
        .d-item{
          margin-top: 14px;
          .code{
            margin-right: 80px;
          }
        }
      }
    }
  }
}
</style>