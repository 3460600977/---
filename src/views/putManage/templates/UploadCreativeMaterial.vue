<!-- 上传创意素材 -->
<template>
  <div class="upload-creative">
    <PutMangeCard :title="'制作创意'">
      <el-form 
        :model="creativeMaterial"
        :rules="materialRules"
        :label-position="'left'" 
        label-width="112px" class="put-form">

        <!-- 上屏 -->
        <el-form-item label="上屏内容">
          <!-- 类型 -->
          <div class="mid-center">
            <el-button 
              @click="creativeMaterial.mediaType.activeIndex = index"
              v-for="(mtype, index) in creativeMaterial.mediaType.values" 
              :type="index == creativeMaterial.mediaType.activeIndex ? 'primary' : 'info'" 
              :key="index">
              {{mtype.name}}
            </el-button>
          </div>

          <!-- 视频 -->
          <div v-if="creativeMaterial.mediaType.values[creativeMaterial.mediaType.activeIndex].value === 'video'">
            <div class="mt-12 my-input-upload">
              <input 
                suffix-icon="el-icon-upload2"
                @change="uploadVideo"
                type="file" 
                accept=".avi, .mp4"
                prop="top" class="input-real"/>
              <el-input
                suffix-icon="el-icon-upload2"
                :value="creativeMaterial.topFile.name" class="input-fake"></el-input>
            </div>
            <p class="decription color-text-1 font-12 mt-12"><span class="color-red">*</span>上传1080X1920的视频，仅支持avi、mp4格式 仅支持5s、10s、15s的视频</p>
          </div>

          <!-- 图片 -->
          <div v-if="creativeMaterial.mediaType.values[creativeMaterial.mediaType.activeIndex].value === 'image'">
            <div class="mt-12 my-input-upload">
              <input 
                suffix-icon="el-icon-upload2"
                @change="uploadImage"
                type="file" 
                accept=".jpg"
                prop="top" class="input-real"/>
              <el-input
                suffix-icon="el-icon-upload2"
                :value="creativeMaterial.topFile.name" class="input-fake"></el-input>
            </div>
            <p class="decription color-text-1 font-12 mt-12"><span class="color-red">*</span>上传1080X1920的图片，仅支持jpg格式</p>
          </div>
        </el-form-item>

        <!-- 下屏 图片 -->
        <el-form-item class="buttom-img-box" label="下屏内容">
          <!--1080 880 -->
          <div>
            <div class="my-input-upload">
              <input 
                suffix-icon="el-icon-upload2"
                @change="uploadImage"
                type="file" 
                accept=".jpg"
                prop="top" class="input-real"/>
              <el-input
                suffix-icon="el-icon-upload2"
                :value="creativeMaterial.topFile.name" class="input-fake"></el-input>
            </div>
            <p class="decription color-text-1 font-12 mt-12"><span class="color-red">*</span>上传1080x880的图片，仅支持jpg格式</p>
          </div>
          
          <!--1280 720 -->
          <div>
            <div class="my-input-upload">
              <input 
                suffix-icon="el-icon-upload2"
                @change="uploadImage"
                type="file" 
                accept=".jpg"
                prop="top" class="input-real"/>
              <el-input
                suffix-icon="el-icon-upload2"
                :value="creativeMaterial.topFile.name" class="input-fake"></el-input>
            </div>
            <p class="decription color-text-1 font-12 mt-12"><span class="color-red">*</span>上传1280x720的图片，仅支持jpg格式</p>
          </div>
        </el-form-item>
      </el-form>

      <!-- 预览 -->
      <div class="material-preview-box">
        <video class="top" src=""></video>
        <img class="bottom" alt="请上传下屏" src="">
        <p style="margin-top: 24px" class="decription color-text-1 font-12"><span class="color-red">*</span>AVI格式暂不支持预览</p>
      </div>
    </PutMangeCard>
  </div>
</template>

<script>
import PutMangeCard from './PutMangeCard' 
export default {
  components: {
    PutMangeCard
  },
  data() {
    return {
      creativeMaterial: {
        mediaType: {
          activeIndex: 0,
          values: [
            { name: '上传视频', value: 'video'},
            { name: '上传图片', value: 'image'},
          ]
        },
        topFile: {
          name: '请上传',
          file: ''
        },
        bottomFiles: [
          {
            name: '请上传',
            file: ''
          },
        ]
      },
      materialRules: {
        
      }
    }
  },
  methods: {
    uploadVideo(e) {
      this.$tools.checkVideoTimeAndSize(e.target.files[0], 15000, 100, 1080, 1920)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    uploadImage(e) {
      this.$tools.checkImageSize(e.target.files[0], 1080, 1920)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
  }
}
</script>

<style lang="scss">
.upload-creative{
  position: relative;
  .mt-12{
    margin-top: 12px;
  }
  .put-form{
    width: 352px;
    margin-top: 18px;
    .my-input-upload {
      position: relative;
      height: 36px;
      .input-real{
        position: absolute;
        z-index: 2;
        height: 40px;
        cursor: pointer;
        opacity: 0;
      }
      .input-fake{
        position: absolute;
        z-index: 1;
      }
    }
    .decription{
      width:256px;
      line-height:18px;
      font-size:12px;
      font-weight:400;
    }
    .buttom-img-box{
      margin-top: 63px;
    }
  }
  .material-preview-box{
    position: absolute;
    top: 0;
    margin: 35px 0 0 558px;
    width:126px;
    height:314px;
    background:rgba(236,235,233,1);
    border:1px solid rgba(196, 196, 196, 0.8);
    box-shadow:0px 6px 9px 1px rgba(19,18,18,0.14);
    border-radius:6px;
    .top{
      margin: 9px;
      width:108px;
      height:192px;
      background:rgba(225,225,225,1);
    }
    .bottom{
      display: block;
      margin: 0 9px 15px 9px;
      width:108px;
      height:88px;
      background:rgba(225,225,225,1);
    }
  }
}
</style>