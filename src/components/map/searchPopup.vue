<template>
  <div class="selectPopUp">
    <p class="title border-bottom padding mid-between">
      <span>{{title}}</span>
      <span class="iconfont icon1 icon-error2 hand" @click="hide"></span>
    </p>
    <div class="remote">
      <search-input
        ref="searchInput"
        @querySearchAsync="querySearchAsync"
        @selectLocation="selectLocation"
      ></search-input>
    </div>
  </div>
</template>

<script>
  import searchInput from "../searchInput";
  export default {
    name: "searchPopup",
    components: {
      searchInput
    },
    props: {
      title: {
        type: String,
        required: true
      },
    },
    data() {
      return {
      }
    },
    created() {
    },
    methods: {
      hide() {
        this.$emit('hide')
      },
      setSearchList(lists) {
        this.$refs.searchInput.setSearchList(lists)
      },
      querySearchAsync(queryString) {
        this.$emit('querySearchAsync', queryString)
      },
      selectLocation(item) {
        this.$emit('selectLocation', item)
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
    }
    .remote {
      padding: 20px;
      width: 432px;
    }
  }
</style>
