<template>
  <div class="login mid-center">
    登录
    <input @change="changeVideo" type="file" name="" id="" accept=".mp4, .avi">
    <input @change="changeImage" type="file" name="" id="" accept=".jpg">
  </div>
</template>

<script>
export default {
  name: 'login',
  methods: {
    changeVideo(e) {
      let file = e.target.files[0];
      this.$tools.checkVideoTimeAndSize(file, 15000, 100, 1080, 1920)
        .then(res => {
          alert(res)
        })
        .catch(res => {
          alert(res)
        })
    },
    changeImage(e) {
      let file = e.target.files[0];
      this.$tools.checkImageSize(file, 1080, 1920)
        .then(res => {
          alert(res)
        })
        .catch(res => {
          alert(res)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>