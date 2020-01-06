<template>
  <div class="play_modal_con type1">
    <a href="javascript:void(0);" class="close_btn" @click="closePlayDialog"></a>
    <div class="dt_box">
      <div class="small_play_box">
        <div class="video_box">
          <video
            id="playSmallVideo"
            :src="this.playVideoUrl.video"
            width="100%"
            playsinline
            x-webkit-airplay="true"
            webkit-playsinline
            autoplay="autoplay"
          ></video>
        </div>
        <div class="pic">
          <img id="bscreenpicSmall" :src="this.playVideoUrl.img" alt="合作品牌-新潮传媒集团" />
        </div>
      </div>
    </div>
    <div class="fr">
      <div class="logo clearfix"></div>
      <div class="play_box">
        <div class="video_box">
          <video
            id="playVideo"
            :src="this.playVideoUrl.video"
            width="100%"
            playsinline
            x-webkit-airplay="true"
            webkit-playsinline
            autoplay="autoplay"
          ></video>
        </div>
        <div class="pic">
          <img id="bscreenpic" :src="this.playVideoUrl.img" alt="合作品牌-新潮传媒集团" />
        </div>
      </div>
      <p>广告投放页面</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "playVideo",
  props: {
    playVideoUrl: {
      type: Object
    }
  },
  methods: {
    closePlayDialog() {
      this.$emit("closePlayDialog", false);
    }
  }
};
</script>

<style scoped lang='scss'>
.play_modal_con {
  width: 800px;
  height: 590px;
  margin: 0 auto;
  .close_btn {
    position: absolute;
    top: -45px;
    right: -45px;
    width: 44px;
    height: 44px;
    background: url(../assets/images/39a4d87.png) no-repeat;
  }
  .dt_box {
    float: left;
    width: 330px;
    height: 550px;
    margin-top: 20px;
    margin-left: 20px;
    background: url(../assets/images/47c2c62.png) no-repeat;
  }
  .small_play_box {
    width: 58px;
    height: 128px;
    padding-top: 5px;
    border-radius: 0.3rem;
    background: url(../assets/images/885deb5.png) no-repeat;
    background-size: 100% 100%;
    margin-top: 111px;
    margin-left: 24px;
    .video_box {
      width: 48px;
      height: 82px;
      margin: auto;
      background-color: #ddd;
      border: 1px solid #ccc;
    }
    .pic {
      width: 48px;
      height: 32px;
      margin: 5px auto 0;
      background-color: #ddd;
      border: 1px solid #ccc;
      overflow: hidden;
      img {
        width: 100%;
      }
    }
  }
  .fr {
    float: right;
    p {
      font-size: 14px;
      padding-left: 55px;
      color: #333;
      font-weight: 700;
      line-height: 48px;
    }
  }
  .fl,
  .fr {
    display: inline;
  }
  .logo {
    width: 160px;
    height: 50px;
    float: right;
    background: url(../assets/images/2877ae6.png) no-repeat;
    background-size: 100%;
  }
  .play_box {
    width: 192px;
    height: 412px;
    margin: 80px 122px 0 0;
    padding-top: 15px;
    border-radius: 0.3rem;
    background: url(../assets/images/885deb5.png) no-repeat;
    background-size: 100% 100%;
    box-shadow: 0.2rem 0.2rem 0.5rem rgba(0, 0, 0, 0.6);
    position: relative;
    .video_box {
      width: 162px;
      height: 288px;
      margin: auto;
      background-color: #ddd;
      border: 1px solid #ccc;
      color: #333;
    }
    .pic {
      width: 162px;
      height: 90px;
      margin: 10px auto 0;
      background-color: #ddd;
      border: 1px solid #ccc;
      overflow: hidden;
      img {
        width: 100%;
        overflow: hidden;
      }
    }
  }
}
</style>