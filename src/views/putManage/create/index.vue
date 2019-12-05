<!-- 投放管理首页 -->
<template>
  <div class="put-manage clearfix">
    <div class="left-steps" :class="{'hide': !isShowSteps}">
      <div style="height: 300px;">
        <div class="step_arrow">
          <a href="#" @click="isShowSteps = !isShowSteps">
          <span class="step_arrow_span">
            <i :class="{'rotate': !isShowSteps}" class="el-icon-d-arrow-left"></i>
          </span>
          </a>
        </div>
        <el-steps direction="vertical" :active="rootActiveIndex" finish-status="success">
          <el-step v-for="(step_item, rootIndex) in step.content" :key="rootIndex">
            <div slot="title">{{step_item.name}}</div>
            <div slot="description" v-for="(steps_sub, subIndex) in step_item.sub"
                 :key="subIndex"
                 :sub_index="steps_sub.subId"
                 v-bind:class="{'step_des':true,'text_active': steps_sub.subId == subActiveIndex}">
              {{steps_sub.name}}
            </div>
          </el-step>
        </el-steps>
      </div>
    </div>
    <div class="right-content">
      <!-- 投放管理 每一步内容 -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
    export default {
        props: {
            rootActiveIndex: {
                type: Number,
                default: 1
            },
            subActiveIndex: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                isShowSteps: true,
                step: {
                    rootActiveIndex: 0,
                    subActiveIndex: 0,
                    content: [
                        {
                            name: '投放计划',
                            id: 0,
                            sub: [
                                {
                                    name: '投放目的',
                                    subId: 0
                                },
                                {
                                    name: '投放计划名称',
                                    subId: 1
                                },
                            ]
                        },
                        {
                            name: '投放方案',
                            id: 1,
                            sub: [
                                {
                                    name: '投放设置',
                                    subId: 2
                                },
                                {
                                    name: '楼盘定向包',
                                    subId: 3
                                },
                                {
                                    name: '楼盘定向包',
                                    subId: 4
                                },
                            ]
                        },
                        {
                            name: '广告创意',
                            id: 2,
                            sub: [
                                {
                                    name: '制作创意',
                                    subId: 5
                                },
                                {
                                    name: '创意资质',
                                    subId: 6
                                },
                                {
                                    name: '广告创意名称',
                                    subId: 7
                                },
                            ]
                        }
                    ]
                }
            }
        },
    }
</script>

<style lang="scss">
  .put-manage {
    height: 100%;
    display: flex;
    flex-direction: row;
    background-color: $color-bg;

    .left-steps {
      width: 220px;
      height: calc(100vh - 76px);
      overflow: hidden;
      flex-shrink: 0;
      background: #fff;
      transition: .4s;
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
          transition: .3s;
          &.rotate{
            transform: rotate(180deg);
          }
        }
      }

      .el-steps {
        margin-top: 20px;
        margin-left: 26px;
        height: 460px;

        .el-step__title {
          color: $color-text
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

        .el-step__head.is-process, .el-step__head.is-wait {
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
          border: 1px dashed $color-step;
          background-color: $color-bg-3;
          left: 14px;
        }
      }
    }

    .right-content {
      padding: 20px 20px 0;
      height: 100%;
      overflow-y: auto;
      flex-grow: 1;
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
  }
</style>
