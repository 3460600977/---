<!-- 投放管理首页 -->
<template>
  <div class="put-manage clearfix">
    <div v-if="isShowSteps===false" class="hide-steps">
      <a href="#" @click="handleShowSteps">
        <span><i class="el-icon-s-operation"></i></span>
      </a>
    </div>
    <div v-else class="left-steps">
      <div style="height: 300px;">
        <div class="step_arrow">
          <a href="#" @click="handleShowSteps">
          <span class="step_arrow_span">
            <i class="el-icon-d-arrow-left"></i>
          </span>
          </a>
        </div>
        <el-steps direction="vertical" :active="step_active" finish-status="success">
          <el-step class="step-first">
            <div slot="title">投放计划</div>
            <div slot="description" v-for="steps in step1" v-bind:class="classStepDes">
              {{steps.des}}
            </div>
          </el-step>
          <el-step class="step-second">
            <div slot="title">投放方案</div>
            <div slot="description" v-for="steps in step2" v-bind:class="classStepDes">
              {{steps.des}}
            </div>
          </el-step>
          <el-step class="step-third">
            <div slot="title">广告创意</div>
            <div slot="description" v-for="steps in step3" v-bind:class="classStepDes">
              {{steps.des}}
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
        data() {
            return {
                step_active: 0,
                step_index: 1,
                isShowSteps: true,
                steps_circle_status: 1,
                steps_des_status: 1,
                steps_line_status: 1,
                steps_name:
                    [
                        {steps1: '投放目的'},
                        {steps2: '投放方案'},
                        {steps3: '广告创意'}
                    ],

                step1:
                    [
                        {id: 1, des: '投放目的'},
                        {id: 2, des: '投放计划名称'}
                    ],

                step2:
                    [
                        {id: 3, des: '投放设置'},
                        {id: 4, des: '楼盘定向包'},
                        {id: 5, des: '投放方案名称'},
                    ],

                step3:
                    [
                        {id: 6, des: '制作创意'},
                        {id: 7, des: '创意资质'},
                        {id: 7, des: '广告创意名称'}
                    ]
            }
        },
        methods: {
            handleShowSteps() {
                this.isShowSteps = !this.isShowSteps;
            },
        },
        computed: {
            classStepDes: function () {
                return {
                    active: this.isActive && !this.error,
                    'text-danger': this.error && this.error.type === 'fatal'
                }
            }
        }
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
      flex-shrink: 0;
      background: #fff;

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
        }
      }

      .el-steps {
        margin-top: 20px;
        margin-left: 26px;
        height: 460px;

        .step-first {
          .el-step__line {
            border: 1px solid $color-blue;
            background-color: $color-blue;
          }
        }

        .el-step__line {
          border: 1px dashed $color-step;
          background-color: $color-bg-3;
        }

        .el-step__head.is-process, .el-step__head.is-wait {
          color: $color-blue;
          border-color: $color-blue;
        }

        .el-step__main {
          margin-left: 33px;
          color: $color-text;

          .el-step__title {
            font-size: 16px;
          }

          .el-step__description {
            font-size: 14px;
          }

          .step_des {
            margin-top: 12px;
          }
        }

        .el-step__icon.is-text {
          background-color: $color-blue;
          color: $color-bg-3;
          width: 32px;
          height: 32px;
          border-radius: 50%;
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
  }
</style>
