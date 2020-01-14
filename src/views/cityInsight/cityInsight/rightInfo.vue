<template>
    <div class="right-info-wrapper mid-column">
     <div class="padding current-people-insight" v-if='hotMapItem !== null'>
      <p class="bold margin1">人群精准资源推荐</p>
      <div class='mid-start'>
        <span class="color-text-1 label flex-shrink">当前定制人群包</span>
        <el-tag
          :key="hotMapItem.id"
          closable
          :disable-transitions="false"
          @close="handleClose(hotMapItem)">
          {{hotMapItem.name}}
        </el-tag>
        </div>
        <div class="switch margin1">
          <span class='color-text-1' style="margin-right: 42px">热力图开关</span>
          <el-switch
            v-model="switchValue"
            :width="30"
            @change="change"
            >
          </el-switch>
      </div>
      <p class="color-text-1 margin1">投放力度</p>
      <div class="mid-between color-text-1 margin2">
        <span>低</span>
        <el-slider
          class="flex1 slider"
          v-model="val"
          :step='10'
          :min='10'
          @change="budgetChange"
          :format-tooltip="formatTooltip"
        ></el-slider>
        <span>高</span>
      </div>
     </div>
      <div class="padding">
        <p class="margin1 bold">投放预估数</p>
        <ul class="desc">
          <li class="mid-start">
            <p class="label">楼盘数</p>
            <p class="font-number font-16">{{selectedBuildings.length | toThousands}}个</p>
          </li>
          <li class="mid-start">
            <p class="label">单元数</p>
            <p class="font-number font-16">{{unitNum | toThousands}}个</p>
          </li>
          <li class="mid-start">
            <p class="label">点位数</p>
            <p class="font-number font-16">{{deviceCount | toThousands}}个</p>
          </li>
          <li class="mid-start">
            <p class="label">覆盖人数</p>
            <p class="font-number font-16">{{coveredPeople | toThousands}}人</p>
          </li>
        </ul>

        <div class="mid-between margin1">
          <p class="bold">媒体资源</p>
          <el-button type="primary" class="ri-btn" size="mini" plain icon="el-icon-plus" @click="addBtnClick">添加</el-button>
        </div>
      </div>
      <ul class="list margin2 border-bottom flex1 customScroll">
        <li class="list-item hand" v-for="(item) in selectedBuildings" :key="item.premisesId">
          <p>{{item.premisesName}}</p>
          <div class="mid-start list-item-2">
            <p class="list-item-1">点位数：{{item.signElevatorNum | toThousands}}</p>
            <p>覆盖人数：{{item.totalPeople | toThousands}}</p>
          </div>
          <span class="iconfont icon-remove icon-error" @click="deleteItem(item)"></span>
        </li>
      </ul>
      <div style="margin-top: 14px;text-align: center" class="padding padding2">
        <el-button type="primary" class="btn" @click="createPackage">创建资源包</el-button>
      </div>
    </div>
</template>

<script>
  export default {
    name: "info",
    props: {
      selectedBuildings: {
        type: Array,
        required: true
      },
      budget: {
        type: Number,
        required: true
      },
      hotMapItem: {
        type: Object,
        default: null
      },
    },
    data() {
      return {
        switchValue: null,
        val: 0,
        maxVal: 100,
        deviceCount: 0,
        coveredPeople: 0,
        unitNum: 0,
      }
    },
    created() {
      this.renderDatas(this.selectedBuildings)
      this.val = this.budget
    },
    watch: {
      selectedBuildings(val) {
        this.renderDatas(val)
      },
      hotMapItem(val) {
        if (val !== null) {
          this.switchValue = true
        }
      },
    },
    methods: {
      change(val) {
        this.$emit('switchChange', val)
      },
      handleClose(val) {
        this.$emit('setHotMapItemNull')
      },
       /*
      * 人群精准资源推荐slider变化
      * */
      formatTooltip(val) {
        return val+'%'
      },
      budgetChange(val) {
        this.$emit('budgetChange', val)
      },
      renderDatas(arr) {
        this.deviceCount = 0
        this.coveredPeople = 0
        this.unitNum = 0
        arr.forEach((item) => {
          this.deviceCount += item.signElevatorNum
          this.coveredPeople += item.totalPeople
          this.unitNum += item.unitNum? item.unitNum: 0
        })
      },
      addBtnClick() {
        this.$emit('addBtnClick')
      },
      createPackage() {
        if (!this.selectedBuildings.length) {
          this.$message.error('没有选中的楼盘数据不能创建资源包！');
          return
        }
        this.$emit('createPackage')
      },
      deleteItem(item) {
        this.$emit('deleteItem', item)
      }
    }
  }
</script>

<style scoped lang='scss'>
  .padding {
    padding-left: 20px;
    padding-right: 20px;
  }
  .ri-btn {
    height: 26px;
    width: 64px;
  }
  .padding1 {
    padding-top: 10px;
  }
  .padding2 {
    padding-bottom: 15px;
  }
  .current-people-insight {
    transition: 0.5s;
    .label {
      padding-top: 24px;
      margin-right: 15px;
    }
    .el-tag {
      background: transparent;
      color: $color-text;
      border-color: $color-border;
      white-space: normal;
      height: auto;
      &:hover {
        color: $color-main;
        border-color: $color-main;
        .el-tag .el-tag__close {
          color: $color-main;
        }
      }
    }
    & /deep/ .el-tag .el-tag__close {
      color: $color-border;
    }
    .switch /deep/ {
      .el-switch__core:after {
        height: 14px;
        width: 14px;
        top: 0;
      }
      .el-switch__core {
        height: 16px;
      }
      .el-switch.is-checked .el-switch__core::after {
        margin-left: -14px;
      }
    }
  }
  .right-info-wrapper {
    width:352px;
    position: relative;
    height: 100%;
    background: #fff;
    line-height: 1.15;
    /*padding: 20px 20px 15px;*/
    .slider-item {
      position: absolute;
      left: -40px;
      background-color: #fff;
      width: 40px;
      top: 50%;
      transform: translateY(23px);
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      z-index: 1;
    }
    .desc {
      color: $color-text-1;
      li {
        margin-top: 20px;
      }
      .label {
        width: 178px;
      }
    }
    .btn {
      width: 194px;
    }
    .list {
      overflow-y: auto;
      position: relative;
      padding-left: 20px;
      padding-bottom: 10px;
      .list-item-1 {
        width: 122px
      }
      .list-item-2 {
        font-size: 12px;
        color: $color-text-1;
        margin-top: 10px;
      }
      .list-item {
        position: relative;
        margin-right: 20px;
        padding: 10px 20px 10px 30px;
        margin-bottom: 10px;
        border: 1px dashed $color-border;
        background:rgba(255,255,255,1);
        .icon-remove {
          font-size: 18px;
          background: #ffffff;
          position: absolute;
          top: 50%;
          color: $color-main;
          z-index: 100;
          display: none;
          transform: translateY(-50%);
          right: -9px;
        }
        &:hover {
          border: 1px dashed $color-main;
          .icon-remove {
            display: block;
          }
        }
      }
    }
    .slider {
      margin: 0 10px;
    }
    .margin1 {
      margin-top: 20px;
    }
    .margin2 {
      margin-top: 20px;
    }
  }
</style>
