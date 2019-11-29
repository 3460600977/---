<template>
  <div class="login mid-center">
    登录
    <input @change="changeFile" type="file" name="" id="" accept=".mp4, .avi">
  </div>
</template>

<script>
export default {
  name: 'login',
  methods: {
    changeFile(e) {
      let file = e.target.files[0];
      let url = URL.createObjectURL(file);
      let video = document.createElement('video');
      video.src = url;
      video.controls = "controls"
      video.style="width: 300px"
      let body = document.getElementById('app').appendChild(video)
      video.addEventListener('canplay', (e) => {
        let time = e.target.duration;
        console.log(e)
        console.log(e.target.videoWidth)
        console.log(e.target.videoHeight)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>