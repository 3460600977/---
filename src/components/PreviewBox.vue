<template>
  <div class="material-preview-box">
    <!-- 上屏 -->
    <div class="top-box" 
      :style="{width: `${innerWidth}px`, 
        height: `${innerWidth / 1080 * 1920}px`, 
        margin: `${innerWidth / 10}px`}">
        <video 
          v-if="top.type === 'video/mp4'"
          class="top"
          controls 
          autoplay
          loop
          :src="top.url"></video>

        <img 
          v-if="top.type === 'image/jpeg'"
          class="top" 
          :src="top.url"/>

        <div v-if="top.type === 'video/avi'" class="top font-12 mid-center">
          AVI不支持预览
        </div>
    </div>

    <!-- 下屏 -->
    <div class="bottom-box" 
      :style="{width: `${innerWidth}px`, 
      height: bottom.height === '720' ? `${innerWidth / 1280 * 720}px` : `${innerWidth / 1080 * 880}px`, 
      margin: `${innerWidth / 10}px`}">
        <video 
          v-if="bottom.type === 'video/mp4'"
          class="bottom"
          controls 
          autoplay
          loop
          muted
          :src="bottom.url"></video>

        <img 
          v-if="bottom.type === 'image/jpeg'"
          class="bottom" 
          :src="bottom.url"/>

        <div v-if="bottom.type === 'video/avi'" class="top font-12 mid-center">
          AVI不支持预览
        </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    innerWidth: {
      type: Number,
      default: 100
    },

    top: {
      type: Object,
      default: {
        type: '', 
        url: ''
      }
      
    },

    bottom: {
      type: Object,
      default: {
        type: '',
        height: '720', // 720 880
        url: ''
      }
    }
  }
}
</script>

<style lang="scss">
.material-preview-box{
  width: fit-content;
  background:rgba(236,235,233,1);
  border:1px solid rgba(196, 196, 196, 0.8);
  box-shadow:0px 6px 9px 1px rgba(19,18,18,0.14);
  border-radius:6px;
  .top-box{
    background:rgb(0, 0, 0);
    overflow: hidden;
    .top{
      height:100%;
    }
  }
  .bottom-box{
    background:rgb(0, 0, 0);
    overflow: hidden;
    .bottom{
      display: block;
      height: 100%;
    }
  }
}
</style>
