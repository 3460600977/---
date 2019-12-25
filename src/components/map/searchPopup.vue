<template>
  <div class="selectPopUp">
    <p class="title border-bottom padding mid-between">
      <span>{{title}}</span>
      <span class="iconfont icon1 icon-error2 hand" @click="hide"></span>
    </p>
    <div class="remote">
      <div>
        <el-input v-model="val" placeholder="输入地点"></el-input>
      </div>
      <ul class="ul">
        <li @click="handleSelect(item)"  v-for="(item, index) in lists" :key="index">
          <p>{{item.title}}</p>
          <p class="color-text-1 margin">{{item.address}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: "searchPopup",
    props: {
      title: {
        type: String,
        required: true
      },
    },
    data() {
      return {
        val: '',
        lists: [],
        timeout:  null
      }
    },
    created() {
      this.$watch('val', this.$tools.debounce((newQuery) => {
        if (newQuery === '') {
          this.lists = []
        } else {
          this.$emit('querySearchAsync', newQuery)
        }
      }, 500))
    },
    methods: {
      hide() {
        this.$emit('hide')
      },
      setSearchList(lists) {
        this.lists = lists
      },
      // querySearchAsync(queryString) {
      //   this.$tools.debounce(() => {
      //     console.log(queryString)
      //   }, 1000)()
      //   // this.$emit('querySearchAsync', queryString)
      // },
      handleSelect(item) {
        this.$emit('selectLocation', item)
        this.val = ''
        this.hide()
      },
    }
  }
</script>

<style scoped lang='scss'>
  .selectPopUp {
    background: #ffffff;
    line-height: 20px;
    box-shadow: 0px 3px 5px 0px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    .icon1 {
      position: absolute;
      right: 10px;
      transition: 0.5s;
      font-size: 12px;
      color: $color-border;
    }
    .title {
      line-height: 40px;
    }
    .padding {
      padding: 0 20px;
    }
    .margin {
      margin-top: 10px;
    }
    .ul {
      border: 1px solid $color-border;
      border-top: none;
      max-height:264px;
      overflow-y: auto;
      font-size: 12px;
      line-height: 1.15;
      li{
        padding: 10px 20px;
        &:active {
          background:rgba(241,242,246,1);
        }
      }

      &::-webkit-scrollbar    //滚动条整体部分
      {
        width: 5px;
        height:10px;
        background-color:rgba(242,242,242,1);
      }
      &::-webkit-scrollbar-track       //scroll轨道背景
      {
        -webkit-box-shadow: inset 0 0 6px rgba(242,242,242,1);
        border-radius: 10px;
        background-color:rgba(242,242,242,1);

      }
      &::-webkit-scrollbar-thumb  // 滚动条中能上下移动的小块
      {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
        background-color:rgba(223,223,223,1);;
      }
    }
    .remote {
      padding: 20px;
      width: 432px;
      & /deep/ .el-input {
        width: 100%;
      }
      & /deep/ .el-input__inner {
        padding: 0 20px;
      }
    }
  }
</style>
