<template>
  <!-- 无数据 -->
  <div class="no-data mid-center">
    <img :width="imgWidth" :src="nodataImg" alt=""><br>
    <div class="color-text-2">
      <slot>无数据</slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    imgWidth: {
      type: Number,
      default: 70
    },
  },

  data() {
    return{
      nodataImg: require('../assets/images/icon_no_data.png')
    }
  }
}
</script>
<style lang="scss">
.no-data{
  padding: 30px; 
  flex-direction: column;
}
  
</style>