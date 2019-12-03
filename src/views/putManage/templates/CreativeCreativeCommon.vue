<!-- 创建创意公用组件 -->
<template>
  <div class="upload-creative">
    <!-- 上传素材 -->
    <PutMangeCard class="form-box creative" :title="'制作创意'">
      <el-form 
        ref="creativeForm"
        :model="formData"
        :rules="formDataRules"
        :label-position="'left'" 
        label-width="112px" class="put-form">
        <!-- 上屏 -->
        <el-form-item prop="top.name" v-if="materialType === 'both' || materialType === 'top'" class="top-box" label="上屏内容">
          <!-- 类型 -->
          <div class="mid-center">
            <el-button 
              @click="switchMediaType(index)"
              v-for="(mtype, index) in mediaType.values" 
              :type="index == mediaType.activeIndex ? 'primary' : 'info'" 
              :key="index">
              {{mtype.name}}
            </el-button>
          </div>
          
          <!-- 视频 -->
          <div v-if="mediaType.values[mediaType.activeIndex].value === 'video'">
            <div class="mt-12 my-input-upload">
              <!-- <input 
                ref="topVideo"
                @change="uploadMedia($event, 'video')" 
                suffix-icon="el-icon-upload2"
                type="file" 
                accept=".avi, .mp4"
                class="input-real"/> -->
              <el-input
                suffix-icon="el-icon-upload2"
                placeholder="请上传"
                v-model="formData.top.name" class="input-fake"></el-input>
            </div>
            <p class="decription color-text-1 font-12 mt-12"><span class="color-red">*</span>上传1080X1920的视频，仅支持avi、mp4格式 仅支持5s、10s、15s的视频</p>
          </div>

          <!-- 图片 -->
          <div v-if="mediaType.values[mediaType.activeIndex].value === 'image'">
            <div class="mt-12 my-input-upload">
              <!-- <input 
                ref="topImage"
                @change="uploadMedia($event, 'topImage')"
                suffix-icon="el-icon-upload2"
                type="file" 
                accept=".jpg"
                class="input-real"/> -->
              <el-input
                suffix-icon="el-icon-upload2"
                placeholder="请上传"
                v-model="formData.top.name" class="input-fake"></el-input>
            </div>
            <p class="decription color-text-1 font-12 mt-12"><span class="color-red">*</span>上传1080X1920的图片，仅支持jpg格式</p>
          </div>

        </el-form-item>

        <!-- 下屏 图片 -->
        <el-form-item prop="bottom720Image.name" v-if="materialType === 'both' || materialType === 'bottom'" label="下屏内容">
          <!--1080 880 -->
          <div class="my-input-upload">
            <!-- <input 
              ref="bottom880"
              @change="uploadMedia($event, 'bottom880Image')"
              suffix-icon="el-icon-upload2"
              type="file" 
              accept=".jpg"
              class="input-real"/> -->
            <el-input
              suffix-icon="el-icon-upload2"
              placeholder="请上传"
              v-model="formData.bottom880Image.name" class="input-fake"></el-input>
          </div>
          <p class="decription color-text-1 font-12 mt-12"><span class="color-red">*</span>上传1080x880的图片，仅支持jpg格式</p>
          
          <!--1280 720 -->
          <div class="my-input-upload mt-12">
            <!-- <input 
              ref="bottom720"
              @change="uploadMedia($event, 'bottom720Image')"
              suffix-icon="el-icon-upload2"
              type="file" 
              accept=".jpg"
              class="input-real"/> -->
            <el-input
              suffix-icon="el-icon-upload2"
              placeholder="请上传"
              v-model="formData.bottom720Image.name" class="input-fake"></el-input>
          </div>
          <p class="decription color-text-1 font-12 mt-12"><span class="color-red">*</span>上传1280x720的图片，仅支持jpg格式</p>
        </el-form-item>
      </el-form>

      <!-- 预览 -->
      <div class="material-preview-box">
        <!-- 上屏 -->
        <div>
          <video controls 
            class="top"
            autoplay
            muted
            v-if="mediaType.values[mediaType.activeIndex].value === 'video' && formData.top.base64" 
            :src="formData.top.base64"></video>
          <img 
            v-else-if="mediaType.values[mediaType.activeIndex].value === 'image' && formData.top.base64" 
            class="top" 
            :src="formData.top.base64"/>

          <div v-else class="top font-12 mid-center">请上传上屏素材</div>
        </div>

        <!-- 下屏 -->
        <div>
          <img v-if="formData.bottom880Image.base64" class="bottom" alt="请上传下屏" :src="formData.bottom880Image.base64">
          <div v-else class="bottom font-12 mid-center">请上传下屏素材</div>
        </div>
        <p style="margin-top: 40px" class="decription color-text-1 font-12"><span class="color-red">*</span>AVI格式暂不支持预览</p>
      </div>
    </PutMangeCard>

    <!-- 广告资质 -->
    <PutMangeCard :title="'广告创意资质'" class="form-box aptitude">
      <el-form
        ref="creativeForm"
        :label-position="'left'"
        :model="formData"
        :rules="formDataRules" 
        label-width="112px" class="put-form">
        <el-form-item prop="name" label="广告创意行业">
          <el-select class="width-100-p" v-model="formData.aptitude.industry" placeholder="请选择">
            <el-option
              v-for="(item, index) in creativeIndustry"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item class="mt-12" label="广告创意资质">
          <div style="width: 1108px">
            <el-image
              v-for="(item, index)  in formData.aptitude.images"
              :key="index"
              class="aptitude-img"
              style="width: 100px; height: 160px"
              :src="item.base64"
              fit="cover">
            </el-image>

            <div class="aptitude-img upload mid-center">
              <input ref="uploadAptitude" class="real-upload" type="file" @change="addIndustry($event)" accept="image/*">
              <i class="el-icon-circle-plus color-main"></i>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </PutMangeCard>

    <!-- 第三方监测 -->
    <PutMangeCard :title="'第三方监测'" class="form-box aptitude">
      <el-form
        ref="creativeForm"
        :model="formData"
        :rules="formDataRules"
        :label-position="'left'" 
        label-width="112px" class="put-form">

        <div class="monitor-box" v-for="(monitor, index) in formData.thirdPartMonitor" :key="index">
          <el-form-item label="监测模式">
            <el-select class="width-100-p" v-model="formData.thirdPartMonitor[index].mode" placeholder="请选择">
              <el-option
                v-for="item in monitorData.mode"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>

          <div v-show="formData.thirdPartMonitor[index].mode != 'SDK'">
            <el-form-item class="mt-10" label="第三方监测">
              <el-select class="width-100-p" v-model="formData.thirdPartMonitor[index].thirdPardMonitor" placeholder="请选择">
                <el-option
                  v-for="(item, index) in monitorData.thirdPardMonitor"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="mt-10" label="第三方监测地址">
              <el-input v-model="formData.thirdPartMonitor[index].thirdPardMonitorAddr" placeholder="请输入地址"></el-input>
            </el-form-item>
          </div>

          
          <!-- 删除 -->
          <div class="del-third-monitor" @click="delThirdPartMonitor(index)">
            <i class="el-icon-error color-main"></i>
          </div>
        </div>

        <!-- 添加第三方监测 -->
        <el-form-item class="mt-10" label="">
          <div @click="addThirdPartMonitor" class="color-main add-address mid">
            <i class="el-icon-circle-plus color-main"></i>
            <span class="font-12">增加第三方监测</span>
          </div>
        </el-form-item>

      </el-form>
    </PutMangeCard>

    <!-- 广告创意名称 -->
    <PutMangeCard :title="'广告创意名称'" class="form-box aptitude">
      <el-form
        ref="creativeForm"
        :model="formData"
        :rules="formDataRules"
        :label-position="'left'" 
        label-width="112px" class="put-form">
        <el-form-item prop="name" label="广告创意名称">
          <el-input v-model="formData.name" placeholder="请输入名称"></el-input>
        </el-form-item>
      </el-form>
    </PutMangeCard>

    <!-- 保存 取消 -->
    <PutMangeCard class="save-box">
      <div class="float-right">
        <el-button>取消</el-button>
        <el-button @click="saveCreative" type="primary">新建并关闭</el-button>
      </div>
    </PutMangeCard>
  </div>
</template>

<script>
import PutMangeCard from './PutMangeCard' 
export default {
  props:{
    materialType: {
      type: String,
      default: 'both', // both top bottom
    }
  },
  components: {
    PutMangeCard
  },
  data() {
    return {
      mediaType: {
        activeIndex: 0,
        values: [
          { name: '上传视频', value: 'video'},
          { name: '上传图片', value: 'image'},
        ]
      },
      
      formData: {
        name: '',
        top: {
          name: '',
          file: '',
          base64: ''
        },
        bottom880Image: {
          name: '',
          file: '',
          base64: ''
        },
        bottom720Image: {
          name: '',
          file: '',
          base64: ''
        },
        aptitude: {
          industry: '餐饮',
          images: [
            {
              file: '',
              base64: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
            }
          ]
        },
        thirdPartMonitor: [
          {
            mode: 'SDK',
            thirdPardMonitor: 'admaster',
            thirdPardMonitorAddr: ''
          }
        ]
      },
      
      formDataRules: {
        name: [
          { required: true, message: '请输入广告创意名称', trigger: 'blur' },
        ],
        'top.name': [
          { required: true, message: '请上传创意', trigger: 'blur' },
        ],
        'bottom720Image.name': [
          { required: true, message: '请上传创意', trigger: 'blur' },
        ],
      },

      // 默认第三方检测
      monitorData: {
        mode: ['SDK', 'C2S', 'S2S'],
        thirdPardMonitor: ['admaster', '国双', '数字100', '秒针']
      },

      // 广告创意行业
      creativeIndustry: [
        '餐饮',
        '餐饮2',
        '餐饮3',
        '餐饮4'
      ],
    }
  },
  methods: {
    /**
     * @description: 上传图片 视频
     * @param: mediaType 视频 图片(上, 880 720)
     */
    uploadMedia(event, mediaType) {

      if (mediaType === 'video') {
        return this.$tools.checkVideoTimeAndSize(event.target.files[0], 15000, 100, 1080, 1920)
          .then(res => {
            // this.$message.success(res.msg);
            this.formData.top = {
              name: res.name,
              file: event.target.files[0],
              base64: res.base64
            };
          })
          .catch(err => {
            this.clearTopFile();
            this.$message.error(err.msg);
          })
      }

      if (mediaType === 'topImage' || mediaType === 'bottom880Image' || mediaType === 'bottom720Image') {
        let param = [
          event.target.files[0], 
          mediaType === 'bottom720Image' ? 1280 : 1080, 
          mediaType === 'topImage' ? 1920 : mediaType === 'bottom880Image' ? 880 : 720,
        ]
        return this.$tools.checkImageSize(...param)
          .then(res => {
            // this.$message.success(res.msg);
            if (mediaType === 'topImage') {
              return this.formData.top = {
                name: res.name,
                file: event.target.files[0],
                base64: res.base64
              }
            }
            if (mediaType === 'bottom880Image' || mediaType === 'bottom720Image'){
              return this.formData[mediaType] = {
                name: res.name,
                file: event.target.files[0],
                base64: res.base64
              }
            }
          })
          .catch(err => {
            if (mediaType === 'topImage') {
              this.clearTopFile();
            }
            if (mediaType === 'bottom880Image') {
              this.clearBottom880File();
            }
            if (mediaType === 'bottom720Image') {
              this.clearBottom720File();
            }
            this.$message.error(err.msg);
          })
      }
    },

    /**
     * 清空上屏真实input file文件
     * 不会影响已上传保存到变量的数据
     */
    clearTopFile(){
      if (this.$refs.topVideo) {
        this.$refs.topVideo.value = ""
      } 
      if (this.$refs.topImage) {
        this.$refs.topImage.value = ""
      }
    },

    // 清空下屏880真实input file文件
    clearBottom880File() {
      if (this.$refs.bottom880) {
        this.$refs.bottom880.value = ""
      } 
    },

    // 清空下屏720真实input file文件
    clearBottom720File() {
      if (this.$refs.bottom720) {
        this.$refs.bottom720.value = ""
      } 
    },

    /**
     * @description: 切换图片 视频
     * @param: index 选中类型的索引
     */
    switchMediaType(index) {
      if (this.mediaType.activeIndex === index) return;
      this.mediaType.activeIndex = index;
      this.topFile = {
        name: '请上传',
        file: '',
        base64: ''
      }
    },

    /**
     * 添加资质
     */
    addIndustry(event) {
      let file = event.target.files[0];
      let base64 = URL.createObjectURL(file);
      this.formData.aptitude.images.push({file, base64})
      this.$refs.uploadAptitude.value = '';
    },

    // 添加第三方监测
    addThirdPartMonitor() {
      this.formData.thirdPartMonitor.push({
        mode: 'SDK',
        thirdPardMonitor: 'admaster',
        thirdPardMonitorAddr: ''
      })
    },

    // 删除第三方监测
    delThirdPartMonitor(index) {
      this.formData.thirdPartMonitor.splice(index, 1)
    },

    // 保存
    saveCreative() {
      this.$refs['creativeForm'].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

  },

  watch: {
    // 监听资质行业和上下屏类型生成名字
    'formData.aptitude.industry': function() {
      let date = new Date();
      let type = this.materialType == 'both' ? '联动' : this.materialType == 'top' ? '上屏' : '下屏';
      this.formData.name = `${this.formData.aptitude.industry}_${type}_${date.getMonth()+1}_${date.getDate()}`
    },
    materialType: function() {
      let date = new Date();
      let type = this.materialType == 'both' ? '联动' : this.materialType == 'top' ? '上屏' : '下屏';
      this.formData.name = `${this.formData.aptitude.industry}_${type}_${date.getMonth()+1}_${date.getDate()}`
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
  .mt-10{
    margin-top: 10px;
  }
  .el-form-item{
    margin-bottom: 0;
  }
  .width-100-p{
    width: 100%;
  }
  .form-box{
    position: relative;
    &.creative{
      margin-top: -10px;
      height: 435px;
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
      .top-box{
        margin-bottom: 63px;
      }
      .aptitude-img{
        position: relative;
        &+.aptitude-img{
          margin-left: 20px;
        }
        &.upload{
          font-size: 18px;
          border:1px solid rgba(229,231,233,1);
        }
        .real-upload{
          position: absolute;
          z-index: 2;
          width: 100%;
          height: 100%;
          cursor: pointer;
          background: red;
          opacity: 0;
        }
        float: left;
        width:100px;
        height:160px;
        border-radius:2px;
      }
      .add-address{
        >i{
          font-size: 18px;
          margin-right: 10px;
        }
        cursor: pointer;
      }
      .monitor-box{
        &+.monitor-box{
          margin-top: 10px;
        }
        position: relative;
        .del-third-monitor{
          position: absolute;
          cursor: pointer;
          top: 8px;
          margin-left: 360px;
        }
      }
    }
    .material-preview-box{
      position: absolute;
      top: 0;
      margin: 55px 0 0 558px;
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
  .save-box{
    margin-top: 40px !important;
  }
}
</style>