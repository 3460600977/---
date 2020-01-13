<template>
  <el-dialog
    :title="mp4Data.title"
    :visible.sync="showMp4"
    @close="showMp4Fun"
    class="point-list"
    width="380px"
  >
    <div class="mp4Box">
      <el-button
        type="primary"
        :class="{displayNone:displayNone}"
        circle
        class="el-icon-arrow-left left"
        :disabled="num===0"
        @click="leftFun"
      ></el-button>
      <el-button
        type="primary"
        circle
        :disabled="num+1===mp4Data.list.top.length"
        :class="{displayNone:displayNone}"
        @click="rightFun"
        class="el-icon-arrow-right right"
      ></el-button>
      <div class="mp4-box-top">
        <video
          ref="videoPlayer"
          webkit-playsinline="true"
          playsinline="true"
          id="my-player"
          poster="../assets/iconImg/top.png"
          width="208px"
          height="370px"
          data-setup="{videoWidth:208,videoHeight:370}"
        >
          <source :src="videoMp4" type="video/mp4" />
        </video>
      </div>
      <div class="mp4-box-bottom">
        <img :src="img" alt="../assets/iconImg/bottom.png" />
      </div>
    </div>
    <p class="page" :class="{displayNone:displayNone}">{{num+1}}/{{mp4Data.list.top.length}}</p>
  </el-dialog>
</template>

<script>
import "video.js/dist/video-js.min.css";
const zhCN = require("video.js/dist/lang/zh-CN.json");
import videojs from "video.js";

export default {
  name: "PlanList",
  props: {
    mp4Data: {
      type: Object
    },
    showMp4: {
      type: Boolean
    }
  },
  data() {
    return {
      num: -1,
      img: "",
      videoMp4: "",
      player: null,
      videonum: -1,
      displayNone: false
    };
  },
  mounted() {
    this.rightFun()
    // if(!this.player)
    //     this.player = videojs(this.$refs.videoPlayer);
  },
  watch: {
    showMp4(val) {
      if (!val) {
        if (this.player) this.player.pause();
      } else {
        this.$nextTick(() => {
          videojs.addLanguage("zh-CN", zhCN);
          this.player = videojs(this.$refs.videoPlayer, {
            language: "zh-CN",
            notSupportedMessage: "文件无法播放"
          });
        });
        this.displayNone =
          this.mp4Data.list.down.length !== this.mp4Data.list.top.length;
        this.num = -1;
        this.img = "";
        this.videoMp4 = "";
        this.player = null;
        this.videonum = -1;
        if (this.mp4Data.list.down.length !== this.mp4Data.list.top.length)
          this.forData(this.mp4Data.list.down, this.num);
        this.forData(this.mp4Data.list.top, this.videonum);
      }
    }
  },
  methods: {
    leftFun() {
      this.forData(this.mp4Data.list.top, this.num - 2);
    },
    rightFun() {
      this.forData(this.mp4Data.list.top, this.num);
    },
    forData(obj, num) {
      num++;
      if (num > obj.length - 1) return false;
      let _this = this;
      if (obj[num].type === 1) {
        this.num = num;
        this.videoMp4 = obj[num].url;
        this.$nextTick(() => {
          videojs.options.flash.swf = "__JS_/js/video-js.swf";
          _this.img = _this.mp4Data.list.down[num].url;
          if (!this.player) {
            videojs.addLanguage("zh-CN", zhCN);
            this.player = videojs(this.$refs.videoPlayer, {
              language: "zh-CN",
              notSupportedMessage: "文件无法播放"
            });
          }
          _this.player.off("ended");
          _this.player.off("timeupdate"); //移除timeupdate事件
          _this.player.reset();
          _this.player.src(_this.videoMp4);
          _this.player.load(_this.videoMp4);
          this.player.ready(function() {
            this.play();
          });
          this.player.on("timeupdate", function() {
            // const curTime = this.currentTime();
          });
          this.player.on("ended", function() {
            if (
              _this.mp4Data.list.down.length === _this.mp4Data.list.top.length
            ) {
              _this.img = _this.mp4Data.list.down[num + 1].url;
              _this.forData(obj, num);
            }
          });
        });
        if (_this.mp4Data.list.down.length !== _this.mp4Data.list.top.length) {
          var timers = setTimeout(() => {
            clearTimeout(timers);
            this.forData(obj, num);
          }, obj[num].length);
        }
      } else {
        if (_this.mp4Data.list.down.length !== _this.mp4Data.list.top.length) {
          this.img = obj[num].url;
          var timer = setTimeout(() => {
            clearTimeout(timer);
            this.forData(obj, num);
          }, obj[num].length);
        }
      }
    },
    showMp4Fun() {
      this.$emit("showMp4Fun", false);
    },
    viewLook() {}
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
.mp4Box {
  width: 240px;
  height: 535px;
  background: url("../assets/iconImg/mp4bg.png") no-repeat;
  background-size: 100% 100%;
  margin-left: 40px;

  .vjs-error .vjs-error-display .vjs-modal-dialog-content {
    padding: 135px 100px 40px 100px;
    font-size: 16px;
  }

  .vjs-control-text {
    display: none;
  }

  .mp4-box-top {
    width: 100%;
    height: 400px;
    padding: 18px 16px 12px 16px;

    video {
      width: 208px;
      height: 370px;
    }
  }

  .mp4-box-bottom {
    width: 100%;
    height: 117px;
    margin-left: 16px;

    img {
      height: 100%;
    }
  }
}

.page {
  text-align: center;
  padding: 10px 0;
}

.left,
.right {
  position: absolute;
  top: 350px;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  z-index: 10;
}

.left {
  left: 10px;
}

.right {
  right: 10px;
}

.displayNone {
  display: none;
}
</style>
