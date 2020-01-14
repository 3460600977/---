<template>
  <div class="left-steps" :class="{'hide': !isShowSteps}">
    <div style="height: 300px;">
      <div @click="isShowSteps = !isShowSteps" class="step_arrow mid">
        <span class="step_arrow_span">
          <i :class="{'rotate': !isShowSteps}" class="iconfont icon-icon-test1 font-16"></i>
        </span>
      </div>
      <el-steps direction="vertical" :active="leftStep.rootActiveIndex" finish-status="success">
        <el-step v-for="(step_item, rootIndex) in step.content" :key="rootIndex">
          <div slot="title">{{step_item.name}}</div>
          <div
            slot="description"
            v-for="(steps_sub, subIndex) in step_item.sub"
            :key="subIndex"
            :class="{'step_des':true,'text_active': leftStep.rootActiveIndex == rootIndex && subIndex == leftStep.subActiveIndex}"
          >{{steps_sub}}</div>
        </el-step>
      </el-steps>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  data() {
    return {
      test: "",
      isShowSteps: true,
      step: {
        content: [
          {
            name: "投放计划",
            sub: ["投放目的", "投放计划名称"]
          },
          {
            name: "投放方案",
            sub: ["投放设置", "楼盘定向", "投放方案名称"]
          },
          {
            name: "确认并支付"
          },
          {
            name: "关联广告创意",
            sub: ["制作创意", "创意资质", "第三方检测", "广告创意名称"]
          }
        ]
      }
    };
  },
  computed: {
    ...mapState(["leftStep"])
  }
};
</script>

<style lang="scss" scoped>
.left-steps {
  width: 220px;
  height: calc(100vh - 76px);
  overflow-x: hidden;
  overflow-y: auto;
  flex-shrink: 0;
  background: #fff;
  transition: 0.4s;
  position: relative;
  /deep/ .hide-el-steps {
    position: absolute;
    right: -5px;
  }
  &.hide {
    width: 84px;
  }
  .step_arrow {
    position: relative;
    height: 31px;
    border-bottom: 1px solid $color-split-line2;
    cursor: pointer;
  }
  .step_arrow_span {
    position: absolute;
    display: inline-block;
    right: 8px;
    i {
      color: $color-split-line2;
      transition: 0.3s;
      &.rotate {
        transform: rotate(180deg);
      }
    }
  }
  /deep/ .el-steps {
    margin-top: 20px;
    margin-left: 26px;
    height: 460px;
    .el-step__title {
      color: $color-text;
    }
    .el-step__description {
      color: $color-text-1;
    }
    .el-step__main {
      margin-left: 35px;
      padding-left: 0;
      color: $color-text;
      .el-step__title {
        font-size: 16px;
        font-weight: 400;
        white-space: nowrap;
      }
      .el-step__description {
        white-space: nowrap;
        font-size: 14px;
      }
      .step_des {
        margin-top: 10px;
      }
    }
    .el-step__main:first-child {
      padding-top: 0 !important;
    }
    .el-step__icon.is-text {
      background-color: $color-step;
      color: $color-bg-3;
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }
    .el-step__head {
      height: 140px;
    }
    .el-step__head.is-process,
    .el-step__head.is-wait {
      border-color: $color-step;
    }
    .is-process {
      .el-step__icon.is-text {
        background-color: $color-blue;
        border-color: $color-blue;
      }
    }
    .is-success {
      .el-step__line {
        border: 1px solid $color-blue;
        background-color: $color-blue;
      }
      .el-step__icon.is-text {
        background-color: $color-blue;
        border-color: $color-blue;
      }
    }
    .el-step__line {
      border-left: 1px dashed $color-step;
      background-color: $color-bg-3;
      left: 16px;
    }
  }
}
.hide-steps {
  position: relative;
  top: 20px;
  left: 20px;
  i {
    font-size: 24px;
    cursor: pointer;
    color: $color-blue;
  }
}
.text_active {
  color: $color-text;
}
</style>
