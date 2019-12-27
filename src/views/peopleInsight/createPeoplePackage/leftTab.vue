<template>
    <ul class="lt hand">
       <li
         v-for="(item, index) in tabData"
         :key="index"
         :class="{'active': activeTab === item[seriesValue]}"
         @click="changeTab(item)"
       >{{item[seriesLabel]}}</li>
    </ul>
</template>

<script>
  export default {
    name: "leftTab",
    props: {
      tabData: {
        type: Array,
        required: true
      },
      activeTab: {
        type: Number,
        required: true
      },
      seriesValue: {
        type: String,
        default: 'value'
      },
      seriesLabel: {
        type: String,
        default: 'name'
      }
    },
    methods: {
      changeTab(item) {
        this.$emit('changeTab', item)
      }
    },
  }
</script>

<style scoped lang='scss'>
  .lt {
    line-height: 60px;
    color: $color-text-1;
    font-size: 16px;
    height: 100%;
    width:100%;
    text-align: center;
    background: #ECECEC;
  }
  .active {
    border-left: 4px solid $color-main;
    color: $color-main;
    background: #ffffff;
  }
</style>
