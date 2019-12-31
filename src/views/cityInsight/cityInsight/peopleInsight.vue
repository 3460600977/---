<template>
    <div class="p-i-w">
      <div class="p-i-c">
        <div>
          <div class="top mid-start">
            <el-input class="input" v-model="name" placeholder="输入人群洞察名称"></el-input>
            <el-button type="primary" class="margin-left-20" plain @click="resetLoad">查询</el-button>
            <el-button type="primary" class="margin-left-20">去创建</el-button>
          </div>
          <div class="list margin-top-20 clearfix">
            <div class="list-item hand"
                 v-for="(item, index) in resultData"
                 @click="handleClick(item)"
                 :class="item.id === activeItem?'active': ''"
                 :key="index"
            >{{item.name}}</div>
            <el-pagination
              background
              layout="total, sizes, prev, pager, next"
              :total="totalCount"
              :page-size="pageSize"
              :page-sizes="pageSizeSelectable"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageIndex"
              class="list-page float-right margin-top-20"
            ></el-pagination>
          </div>
        </div>
        <div class="tags margin-left-30">

        </div>
      </div>
      <div class="mid-between" style="margin-top: 24px;">
        <div style="font-size: 0">
          <el-button @click="hide">取消</el-button>
          <el-button type="primary" class="margin-left-20" @click="returnResult">保存</el-button>
        </div>
        <div class="switch" v-if="switchValue !== null">
          <span style="margin-right: 15px">热力图开关</span>
          <el-switch
            v-model="switchValue"
            :width="30"
            @change="change"
            >
          </el-switch>
        </div>
      </div>
    </div>
</template>

<script>
  import {tableMixin} from "../../../mixins/tableMixin";
  export default {
    name: "peopleInsight",
    mixins: [tableMixin],
    data() {
      return {
        name: '',
        switchValue: null,
        activeItem: null,
        pageSizeSelectable: [5, 10, 15, 20],
        pageSize: 5,
      }
    },
    // created() {
    //
    // },
    methods: {
      resetSelect() {
        this.activeItem = null
        this.switchValue = null
        this.pageIndex = 1
        this.filterData.pageIndex = 1
      },
      handleClick(item) {
        this.activeItem = item.id
      },
      change(val) {
        this.$emit('switchChange', val)
      },
      hide() {
        this.resetSelect()
        this.$emit('hide')
      },
      loadFunction(param) {
        const data = { ...param, name: this.name }
        return new Promise((resolve, reject) => {
          this.$api.peopleInsight.getCrowdList(data).then(res => {
            resolve(res);
          }).catch((res) => {
            reject(res)
          })
        });
      },
      returnResult() {
        this.switchValue = true
        this.$emit('returnResult', this.activeItem)
      },
    },
  }
</script>

<style scoped lang='scss'>
.p-i-w {
  padding: 30px 20px;
  .p-i-c {
    display: flex;
    justify-content: flex-start;
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
  .input {
    width: 240px;
  }
  .active {
    color: $color-main;
  }
  .tags {
    width: 309px;
    border: 1px dashed $color-main;
  }
  .list {
    width:440px;
    border: 1px solid $color-border;
    line-height: 40px;
    color: $color-text-1;
    .list-item {
      border-bottom: 1px solid $color-border;
      padding: 0 12px;
    }
  }
}
</style>
