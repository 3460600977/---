<template>
  <div class="selectPopUp">
    <div class="remote">
      <div>
        <el-input v-model="val" placeholder="输入地点"></el-input>
      </div>
      <ul class="ul customScroll" v-show="lists.length">
        <li @click="handleSelect(item)" class="hand"  v-for="(item, index) in lists" :key="index">
          <p>{{item[firstLabel]}}</p>
          <p class="color-text-1 margin">{{item[secondLabel]}}</p>
        </li>
      </ul>
      <ul class="ul-noData ul mid-center" v-if="noData !== '' && !lists.length && val !== ''">
        {{noData}}
      </ul>
    </div>
  </div>
</template>


<script>
  export default {
    name: "searchPopup",
    props: {
      firstLabel: {
        type: String,
        default: 'title'
      },
      isClear: {
        type: Boolean,
        default: true
      },
      secondLabel: {
        type: String,
        default: 'address'
      },
      noData: {
        type: String,
        default: ''
      },
    },
    data() {
      return {
        val: '',
        lists: []
      }
    },
    created() {
      this.$watch('val', this.$tools.debounce((newQuery) => {
        if (newQuery === '') {
          this.lists = []
        } else {
          this.$emit('querySearchAsync', newQuery)
        }
      }, 300))
    },
    methods: {
      setSearchList(lists) {
        if (lists) {
          this.lists = lists
        } else {
          this.lists = []
        }
      },
      handleSelect(item) {
        this.$emit('selectLocation', item)
        if (this.isClear) {
          this.val = ''
        }
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
    .ul-noData {
      height: 264px;
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
    }
    .remote {
      width: 100%;
      & /deep/ .el-input {
        width: 100%;
      }
      & /deep/ .el-input__inner {
        padding: 0 20px;
      }
    }
  }
</style>
