<template>
    <div class="selectPopUp">
<!--      <p class="title border-bottom padding mid-between">-->
<!--        <span>{{selectDatas.title}}</span>-->
<!--        <span class="iconfont icon1 icon-error2 hand" @click="operate(1)"></span>-->
<!--      </p>-->
      <div class="content padding">
        <div class="item mid-start" v-for="(item, index) in selectDatas.options" :key="index">
          <p class="type">{{item.title}}</p>
          <ul class="ul hand">
            <li :class="{'active': filtersCopy[item.key].includes(val.key)}" v-for="(val, key) in item.types" :key="key" @click="typeClick(item.key, val.key)">{{val.label}}</li>
          </ul>
        </div>
      </div>
      <div class="btns padding">
        <el-button class="btn" @click="operate(1)">取消</el-button>
        <el-button class="btn" type="primary" @click="operate(2)">保存</el-button>
        <el-button type="text" @click="operate(0)">清空</el-button>
      </div>
    </div>
</template>

<script>
  export default {
    name: "buildingLabel",
    props: {
      selectDatas: {
        type: Object,
        required: true
      },
      filters: {
        type: Object,
        required: true
      },
    },
    data() {
      return {
        filtersOld: {},
        filtersCopy: {}
      }
    },
    created() {
      this.filtersCopy = this.$tools.deepCopy(this.filters)
      this.filtersOld = this.$tools.deepCopy(this.filters)
    },
    methods: {
      clear() {
        for (let key in this.filters) {
          this.filtersCopy[key] = []
        }
        this.setFiltersOld()
      },
      operate(val) {
        if (val === 0) {
          this.clear()
          this.$emit('returnResult', this.filtersCopy, 0)
        } else if (val === 1) {
          this.filtersCopy = this.$tools.deepCopy(this.filtersOld)
          this.$emit('hide')
        } else if (val === 2) {
          this.setFiltersOld()
          this.$emit('returnResult', this.filtersCopy, 2)
        }
      },
      setFiltersOld(val) {
        this.filtersOld = this.$tools.deepCopy(!val? this.filtersCopy: val)
      },
      typeClick(v1, v2) {
        let index = this.filtersCopy[v1].indexOf(v2)
        if (index !== -1) {
          this.filtersCopy[v1].splice(index, 1)
        } else {
          this.filtersCopy[v1].push(v2)
        }
      },
    }
  }
</script>

<style scoped lang='scss'>
.selectPopUp {
  background: #ffffff;
  line-height: 1.4;
  box-shadow:0px 3px 5px 0px rgba(0, 0, 0, 0.1);
  border-radius:2px;
  .active {
    color: $color-main;
  }
  .padding {
    padding: 0 20px;
  }
  .icon1 {
    font-size: 16px;
    color: #e5e7e9;
  }
  .title {
    line-height: 40px;
  }
  .btns {
    padding-bottom: 20px;
    margin-top: 80px;
    font-size: 0;
    & /deep/ .el-button + .el-button {
      margin-left: 14px;
    }
  }
  .content {
    padding-top: 30px;
    .type {
      width: 95px;
      vertical-align: top;
      display: inline-block;
    }
    .item {
      margin-bottom: 24px;
    }
    .ul {
      display: inline-block;
      width: 352px;
      font-size: 0;
      color: $color-text-1;
      & li{
        display: inline-block;
        width: 88px;
        font-size: 14px;
      }
    }
  }
}
</style>
