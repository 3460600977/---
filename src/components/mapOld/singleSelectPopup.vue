<template>
  <div class="selectPopUp">
    <p class="title border-bottom padding mid-between">
      <span>{{title}}</span>
      <span class="iconfont icon1 icon-error2 hand" @click="hide"></span>
    </p>
    <p class="current padding margin3">当前城市：<span class="color-main">{{currentItem.name}}</span></p>
    <div class="content padding">
      <div class="item" v-for="(item, index) in selectDatas" :key="index">
        <p class="type">{{item.title}}</p>
        <ul class="ul hand">
          <li :class="{'active': val.cityCode === currentItem.cityCode}" v-for="(val, key) in item.values" :key="key" @click="typeClick(val)">{{val.name}}</li>
        </ul>
      </div>
    </div>
<!--    <div class="btns padding text-right">-->
<!--      <el-button type="text" @click="operate(0)">清空</el-button>-->
<!--      <el-button class="btn" size="mini" @click="operate(1)">取消</el-button>-->
<!--      <el-button class="btn" type="primary" size="mini" @click="operate(2)" plain>确定</el-button>-->
<!--    </div>-->
  </div>
</template>

<script>
  export default {
    name: "buildingLabel",
    props: {
      selectDatas: {
        type: Array,
        required: true
      },
      filters: {
        type: Object,
        required: true
      },
      title: {
        type: String,
        required: true
      },
    },
    data() {
      return {
        currentItem: {}
      }
    },
    created() {
      // this.filtersCopy = this.$tools.deepCopy(this.filters)
      this.currentItem = this.findItem(this.filters, this.selectDatas)
    },
    methods: {
      findItem(val, arr) {
        let arrTotal = this.$tools.FilterByKey(arr, 'values')
        let result =  arrTotal.find((item) => {
          return item.cityCode == val.cityCode
        })
        return result
      },
      hide() {
        this.$emit('hide')
      },
      typeClick(val) {
        this.currentItem = val
        this.$emit('returnResult', val)
      },
    }
  }
</script>

<style scoped lang='scss'>
  .selectPopUp {
    background: #ffffff;
    line-height: 20px;
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
    .margin3 {
      margin: 20px 0 14px;
    }
    .item {
      margin-bottom: 22px;
    }
    .content {
      max-height: 293px;
      overflow-y: scroll;
      .type {
        width: 63px;
        vertical-align: top;
        display: inline-block;
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
