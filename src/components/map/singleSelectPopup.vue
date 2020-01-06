<template>
  <div class="selectPopUp" v-show="isShow">
    <p class="title border-bottom padding mid-between">
      <span>{{title}}</span>
      <span class="iconfont icon1 icon-error2 hand" @click="hide"></span>
    </p>
    <p class="current padding margin3">当前城市：<span class="color-main">{{currentItem.name}}</span></p>
    <div class="content padding customScroll">
      <div class="item" v-for="(item, index) in selectDatas" :key="index">
        <p class="type">{{item.title}}</p>
        <ul class="ul hand">
          <li :class="{'active': val.cityCode === currentItem.cityCode}" v-for="(val, key) in item.values" :key="key" @click="typeClick(val)">{{val.name}}</li>
        </ul>
      </div>
    </div>
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
      currentItem: {
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
        isShow: true
      }
    },
    watch: {
      // filters(val) {
      //   let item = this.findItem(this.filters, this.selectDatas)
      //   if (item) {
      //     this.currentItem = this.findItem(this.filters, this.selectDatas)
      //   } else {
      //     this.currentItem = val
      //   }
      // },
      // currentItem(val) {
      //   this.$emit('returnResult', val)
      // },
    },
    methods: {
      hide() {
        // this.isShow = false
        this.$emit('hide')
      },
      typeClick(val) {
        this.$emit('returnResult', val)
        this.hide()
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
