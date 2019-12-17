<template>
  <div class="left-steps" :class="{'hide': !isShowSteps}">
    <div style="height: 300px;">
      <div class="step_arrow">
        <div @click="isShowSteps = !isShowSteps">
          <span class="step_arrow_span">
            <i :class="{'rotate': !isShowSteps}" class="el-icon-d-arrow-left"></i>
          </span>
        </div>
      </div>
      <el-steps direction="vertical" :active="leftStep.rootActiveIndex" finish-status="success">
        <el-step v-for="(step_item, rootIndex) in step.content" :key="rootIndex">
          <div slot="title">{{step_item.name}}</div>
          <div
            slot="description"
            v-for="(steps_sub, subIndex) in step_item.sub"
            :key="subIndex"
            :class="{'step_des':true,'text_active': leftStep.rootActiveIndex == rootIndex && subIndex == leftStep.subActiveIndex}"
          >{{steps_sub}}
          </div>
        </el-step>
      </el-steps>
    </div>
  </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {mapGetters} from 'vuex'

    export default {
        data() {
            return {
                test: '',
                isShowSteps: true,
                step: {
                    content: [
                        {
                            name: "投放计划",
                            sub: ["投放目的", "投放计划名称"]
                        },
                        {
                            name: "投放方案",
                            sub: ["投放设置", "楼盘定向包", "楼盘定向包"]
                        },
                        {
                            name: "广告创意",
                            sub: ["制作创意", "创意资质", "广告创意名称"]
                        }
                    ]
                }
            };
        },
        computed: {
            ...mapState(['leftStep']),
        },
    };
</script>

<style lang="scss">
  .left-steps {
    width: 220px;
    height: calc(100vh - 76px);
    overflow: hidden;
    flex-shrink: 0;
    background: #fff;
    transition: 0.4s;
    position: relative;

    .hide-el-steps {
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
    }

    .step_arrow_span {
      position: absolute;
      display: inline-block;
      top: 15%;
      right: 0;

      i {
        color: $color-split-line2;
        font-size: 22px;
        cursor: pointer;
        transition: 0.3s;

        &.rotate {
          transform: rotate(180deg);
        }
      }
    }

    .el-steps {
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
        margin-left: 33px;
        color: $color-text;

        .el-step__title {
          font-size: 16px;
          font-weight: 400;
        }

        .el-step__description {
          white-space: nowrap;
          font-size: 14px;
        }

        .step_des {
          margin-top: 12px;
        }
      }

      .el-step__icon.is-text {
        background-color: $color-step;
        color: $color-bg-3;
        width: 32px;
        height: 32px;
        border-radius: 50%;
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
