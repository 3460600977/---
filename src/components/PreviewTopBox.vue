<template>
  <div class="material-preview-box">
    <!-- 上屏 -->
    <div class="top-box"
         :style="{width: `${innerWidth}px`,
        height: `${innerWidth / 1080 * 1920}px`,
        margin: `${innerWidth / 10}px`}">
      <video
        v-if="top.type === 'video/mp4' || top.type === 'mp4'"
        class="top"
        controls
        autoplay
        loop
        :src="top.url"></video>

      <img
        v-if="top.type === 'image/jpeg' || top.type === 'jpeg' || top.type === 'jpg'"
        class="top"
        :src="top.url"/>

      <div v-if="top.type === 'video/avi' || top.type === 'avi'" class="top font-12 mid-center">
        AVI不支持预览
      </div>
    </div>

    <!-- 下屏 -->
  </div>
</template>

<script>
  export default {
    name: "PreviewTopBox",
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
    }
  }
</script>

<style scoped lang="scss">
  .material-preview-box {
    width: fit-content;
    border-radius: 6px;
    .top-box {
      background: rgb(0, 0, 0);
      overflow: hidden;
      .top {
        height: 100%;
      }
    }
    .bottom-box {
      background: rgb(0, 0, 0);
      overflow: hidden;
      .bottom {
        display: block;
        height: 100%;
      }
    }
  }
</style>
