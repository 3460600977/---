<!-- 创建创意公用组件 -->
<template>
  <div class="upload-creative">
    <!-- 上传素材 -->
    <PutMangeCard class="form-box creative" v-loading="pageLoading" :title="'制作创意'">
      <!-- 上屏 -->
      <el-form  
        v-if="projectData.type !== '002'"
        ref="creativeFormMaterialTop"
        :model="formData"
        :rules="formDataRules"
        :label-position="'left'" 
        label-width="112px" class="put-form">
        
        <el-form-item prop="top.name" class="top-box" label="上屏内容">
          <!-- 类型 -->
          <div class="mid-between">
            <el-button 
              style="width: 102px"
              @click="switchFileType(item.value)"
              v-for="(item, index) in fileType" 
              :type="formData1.fileType == item.value ? 'primary' : 'info'" 
              :key="index">
              {{item.name}}
            </el-button>
          </div>
          
          <!-- 视频 -->
          <div v-if="formData1.fileType === 1">
            <div class="mt-12 my-input-upload">
              <input 
                ref="topVideo"
                @change="uploadMedia($event, 'video')" 
                type="file" 
                accept=".avi, .mp4"
                class="input-real"/>
              <el-input
                suffix-icon="iconfont icon-uploading1"
                placeholder="请上传"
                v-model="formData.top.name" class="input-fake"></el-input>
            </div>
            <p class="decription color-text-1 font-12"><span class="color-red">*</span>上传1080X1920的视频，仅支持avi、mp4格式 仅支持5s、10s、15s的视频</p>
          </div>

          <!-- 图片 -->
          <div v-if="formData1.fileType === 2">
            <div class="mt-12 my-input-upload">
              <input 
                ref="topImage"
                @change="uploadMedia($event, 'topImage')"
                type="file" 
                accept=".jpg"
                class="input-real"/>
              <el-input
                suffix-icon="iconfont icon-uploading1"
                placeholder="请上传"
                v-model="formData.top.name" class="input-fake"></el-input>
            </div>
            <p class="decription color-text-1 font-12"><span class="color-red">*</span>上传1080X1920的图片，仅支持jpg格式</p>
          </div>

        </el-form-item>

        <!-- 时长  -->
        <el-form-item prop="durationType" label="投放时长">
          <el-select class="width-100-p"
            :disabled="formData1.fileType == 1 || this.createType !== 'single'"
            v-model="formData.durationType" 
            placeholder="请选择">
            <el-option
              v-for="(item, index) in projectConst.putDuration"
              :key="index"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>

      <!--下屏 -->
      <div v-if="projectData.type !== '001'">
        <!-- 1080 880 -->
        <el-form
          ref="creativeFormMaterialBottom880"
          :model="formData"
          :rules="formDataRules"
          :label-position="'left'" 
          label-width="112px" class="put-form">
          <el-form-item prop="bottom880Image.name" label="下屏内容">
            <div class="my-input-upload">
              <input 
                ref="bottom880"
                @change="uploadMedia($event, 'bottom880Image')"
                type="file" 
                accept=".jpg"
                class="input-real"/>
              <el-input
                suffix-icon="iconfont icon-uploading1"
                placeholder="请上传"
                v-model="formData.bottom880Image.name" class="input-fake"></el-input>
            </div>
            <p class="decription color-text-1 font-12"><span class="color-red">*</span>上传1080x880的图片，仅支持jpg格式</p>
          </el-form-item>
        </el-form>

        <!--1280 720 -->
        <el-form
          ref="creativeFormMaterialBottom720"
          :model="formData"
          :rules="formDataRules"
          :label-position="'left'" 
          label-width="112px" class="put-form">
          <el-form-item prop="bottom720Image.name">
            <div class="my-input-upload">
              <input 
                ref="bottom720"
                @change="uploadMedia($event, 'bottom720Image')"
                type="file" 
                accept=".jpg"
                class="input-real"/>
              <el-input
                suffix-icon="iconfont icon-uploading1"
                placeholder="请上传"
                v-model="formData.bottom720Image.name" class="input-fake"></el-input>
            </div>
            <p class="decription color-text-1 font-12"><span class="color-red">*</span>上传1280x720的图片，仅支持jpg格式</p>
          </el-form-item>
        </el-form>
      </div>

      <!-- 预览 -->
      <div class="material-preview-box">
        <!-- 上屏 -->
        <div>
          <video 
            class="top"
            controls 
            autoplay
            loop
            muted
            v-if="formData1.fileType === 1 && formData.top.base64 && formData.top.type === 'video/mp4'" 
            :src="formData.top.base64"></video>
          <img 
            v-else-if="formData1.fileType === 2 && formData.top.base64" 
            class="top" 
            :src="formData.top.base64"/>

          <div v-if="formData.top.type === 'video/avi'" class="top font-12 mid-center">
            avi不支持预览
          </div>
          <div v-if="!formData.top.base64" class="top font-12 mid-center">
            <!-- 请上传上屏素材 -->
          </div>
        </div>

        <!-- 下屏 -->
        <div>
          <img v-if="formData.bottom880Image.base64" class="bottom" alt="请上传下屏" :src="formData.bottom880Image.base64">
          <div v-else class="bottom font-12 mid-center">
            <!-- 请上传下屏素材 -->
          </div>
        </div>
        <p style="margin-top: 40px" class="decription color-text-1 font-12"><span class="color-red">*</span>AVI格式暂不支持预览</p>
      </div>
    </PutMangeCard>

    <!-- 广告资质 -->
    <PutMangeCard :title="'广告创意资质'" v-loading="pageLoading" class="form-box aptitude">
      <el-form
        ref="creativeForm"
        :label-position="'left'"
        :model="formData"
        :rules="formDataRules" 
        label-width="112px" class="put-form">

        <!-- 行业列表 -->
        <el-form-item prop="name" label="广告创意行业">
          <el-select 
            :disabled="this.createType !== 'single'"
            class="width-100-p" 
            v-model="formData.aptitude.industry" 
            placeholder="请选择">
            <el-option
              v-for="(item, index) in industryList"
              :key="index"
              :label="item.name"
              :value="item.industryId">
            </el-option>
          </el-select>
        </el-form-item>
        
        <!-- 资质图片 -->
        <el-form-item class="mt-12" label="广告创意资质">
          <div style="width: 1108px">
            <div class="aptitude-img" 
              v-for="(item, index)  in formData.aptitude.images"
              :key="index">
              <el-image
                :preview-src-list="aptitudePreviewImgs"
                style="width: 100px; height: 160px"
                :src="item.base64"
                fit="cover">
              </el-image>
              <!-- 删除 -->
              <div class="del-third-monitor mid-center" @click="delAptitude(index)">
                <i class="el-icon-error color-main"></i>
              </div>
            </div>

            <div class="aptitude-img upload mid-center">
              <input ref="uploadAptitude" class="real-upload" type="file" @change="addIndustry($event)" accept="image/*">
              <i class="el-icon-circle-plus color-main"></i>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </PutMangeCard>

    <!-- 第三方监测 -->
    <PutMangeCard :title="'第三方监测'" v-loading="pageLoading" class="form-box aptitude">
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
                v-for="item in MonitorData.mode"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>

          <div v-show="formData.thirdPartMonitor[index].mode != 'SDK'">
            <el-form-item class="mt-10" label="第三方监测">
              <el-select class="width-100-p" v-model="formData.thirdPartMonitor[index].thirdPartyMonitor" placeholder="请选择">
                <el-option
                  v-for="(item, index) in MonitorData.thirdPartyMonitor"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="mt-10" label="第三方监测地址">
              <el-input v-model="formData.thirdPartMonitor[index].thirdPartyMonitorAddr" placeholder="请输入地址"></el-input>
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
    <PutMangeCard :title="'广告创意名称'" v-loading="pageLoading" class="form-box aptitude">
      <el-form
        ref="creativeFormName"
        :model="formData"
        :rules="formDataRules"
        :label-position="'left'" 
        label-width="112px" class="put-form">
        <el-form-item prop="name" label="广告创意名称">
          <el-input v-model.trim="formData.name" clearable placeholder="请输入名称"></el-input>
        </el-form-item>
      </el-form>
    </PutMangeCard>

    <!-- 保存 取消 -->
    <PutMangeCard class="save-box" v-loading="pageLoading">
      <div class="float-right">
        <el-button  style="width: 136px">取消</el-button>
        <el-button  style="width: 136px" @click="saveCreative" type="primary">新建并关闭</el-button>
      </div>
    </PutMangeCard>
  </div>
</template>

<script>
import PutMangeCard from '../../../../templates/PutMangeCard' 
import { projectConst, MonitorData } from '../../../../../../utils/static'
export default {
  props:{
    /**
     * 创建类型
     * single => 单独创建 step => 按步骤创建 edit => 编辑
     */
    createType: {
      type: String,
      default: 'step'
    }
  },

  components: {
    PutMangeCard
  },

  data() {
    return {
      MonitorData,
      projectConst,
      pageLoading: true,
      projectData: '', // 根据id查询的投放方案信息
      
      // 上屏文件类型，1：视频,2:图片
      fileType: [
        { name: '上传视频', value: 1},
        { name: '上传图片', value: 2},
      ],
      mediaType: {
        activeIndex: 0,
        activeType: 'video',
        values: [
          { name: '上传视频', value: 'video'},
          { name: '上传图片', value: 'image'},
        ]
      },
      
      formData: {
        name: '',
        creativeType: '003',
        top: {
          type: 'video/mp4',
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
        durationType: '',
        aptitude: {
          industry: '',
          images: [
            // {
            //   file: '',
            //   base64: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
            // }
          ]
        },
        thirdPartMonitor: [
          {
            mode: MonitorData.mode[0],
            thirdPartyMonitor: '',
            thirdPartyMonitorAddr: ''
          }
        ]
      },

      formData1: {
        projectId: '',
        name: '', //创意名称
        screenType: '',//屏幕类型，0联动，1上屏，2下屏
        fileType: 1,//上屏文件类型，1：视频,2:图片
        industry: '', // 广告创意行业
        top: { type: 'video/mp4', name: '', file: '', base64: '' }, // 上屏
        bottom720Image: { name: '', file: '', base64: '' },
        bottom880Image: { name: '', file: '', base64: '' },
        durationType: '', //上屏或者联动上下屏需要上传，0 5s，1：10s，2：15s
        industryImage: '', //广告创意资质图片
        monitor: [
          { 
            mode:0, 
            thirdPartyMonitor: '',
            thirdPartyMonitorUrl: '',
          }
        ], // 第三方监测
      },
      
      formDataRules: {
        name: [
          { required: true, message: '请输入广告创意名称!', trigger: 'blur' },
          { max: 100, message: '创意名称100字以内!'}
        ],
        durationType: [
          { required: true, message: '请选择投放时长!', trigger: 'blur' },
        ],
        'top.name': [
          { required: true, message: '请上传创意!', trigger: 'change' },
        ],
        'bottom720Image.name': [
          { required: true, message: '请上传创意!', trigger: 'change' },
        ],
        'bottom880Image.name': [
          { required: true, message: '请上传创意!', trigger: 'change' },
        ],
      },

      // 广告创意行业
      industryList: [],
    }
  },
  
  beforeMount() {
    if (this.createType !== 'single') {
      this.$api.CreateCreative.GetProjectDetailById(this.$route.query.projectId)
        .then(res => {
          this.pageLoading = false;
          this.projectData = res.result;
          this.formData.aptitude.industry = this.projectData.industry; // 行业回显
          this.formData.durationType = this.projectData.second;
          console.log(this.projectData)
          // $tools.getObjectItemFromArray(projectConst.putDuration, 'value', projectData.second).name
        })
        .catch(res => {
          this.pageLoading = false;
        })
    } else {

    }

    // 行业列表
    this.$api.IndustryList.AllList()
      .then(res => {
        this.industryList = res.result;
      })
    
  },

  methods: {
    /**
     * @description: 上传图片 视频
     * @param: mediaType 视频 图片(上, 880 720)
     */
    uploadMedia(event, mediaType) {
      let _file = event.target.files[0];
      if (mediaType === 'video') {
        if (!this.$tools.checkSuffix(_file.name, ['mp4', 'avi'])) {
          return this.$notify({
            title: '错误',
            message: '请上传MP4、AVI格式的视频',
            type: 'error'
          })
        }
        return this.$tools.checkVideoTimeAndSize(_file, 15000, 200, 1080, 1920)
          .then(res => {
            this.formData.durationType = res.durationType
            this.formData.top = {
              name: res.name,
              type: res.type,
              file: _file,
              base64: res.base64
            };
          })
          .catch(err => {
            this.clearTopFile();
            this.$notify({
              title: '错误',
              message: err.msg,
              type: 'error'
            })
          })
      }

      if (mediaType === 'topImage' || mediaType === 'bottom880Image' || mediaType === 'bottom720Image') {
        if (!this.$tools.checkSuffix(_file.name, ['jpg'])) {
          return this.$notify({
            title: '错误',
            message: '请上传MP4、AVI格式的视频',
            type: 'error'
          })
        }
        let param = [
          _file, 
          mediaType === 'bottom720Image' ? 1280 : 1080, 
          mediaType === 'topImage' ? 1920 : mediaType === 'bottom880Image' ? 880 : 720,
        ]
        return this.$tools.checkImageSize(...param)
          .then(res => {
            if (mediaType === 'topImage') {
              return this.formData.top = {
                name: res.name,
                file: _file,
                base64: res.base64
              }
            }
            if (mediaType === 'bottom880Image' || mediaType === 'bottom720Image'){
              return this.formData[mediaType] = {
                name: res.name,
                file: _file,
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
            this.$notify({
              title: '错误',
              message: err.msg,
              type: 'error'
            })
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
    switchFileType(value) {
      if (this.formData1.fileType === value) return;
      this.formData1.fileType = value;
      // if (this.createType === 'single') {
      //   this.formData.durationType = '';
      // }
      this.formData.top = {
        name: '请上传',
        file: '',
        base64: ''
      };
    },

    // 添加资质
    addIndustry(event) {
      let file = event.target.files[0];
      let base64 = URL.createObjectURL(file);
      this.formData.aptitude.images.push({file, base64})
      this.$refs.uploadAptitude.value = '';
    },

    // 删除资质
    delAptitude(index) {
      this.formData.aptitude.images.splice(index, 1)
    },

    // 添加第三方监测
    addThirdPartMonitor() {
      this.formData.thirdPartMonitor.push({
        mode: 'SDK',
        thirdPartyMonitor: '酷云',
        thirdPartyMonitorAddr: ''
      })
    },

    // 删除第三方监测
    delThirdPartMonitor(index) {
      this.formData.thirdPartMonitor.splice(index, 1)
    },

    // 保存
    saveCreative() {
      let isPassEnptyCheck = true;
      let validateForms = ['creativeFormMaterialTop', 'creativeFormMaterialBottom880', 'creativeFormMaterialBottom720', 'creativeFormName'];
      
      validateForms.forEach((item, index) => {
        if(this.$refs[item]) {
          this.$refs[item].validate((valid) => {
            if (!valid) { return isPassEnptyCheck = false; } 
          });
        }
      })
      if (!isPassEnptyCheck) {
        return this.$notify({
          title: '警告',
          message: '还有必填字段未填写',
          type: 'warning'
        });
      }

      alert('上传成功')
    },

  },

  computed: {
    // 资质预览图片列表
    aptitudePreviewImgs() {
      let res = [];
      this.formData.aptitude.images.forEach(item => {
        res.push(item.base64)
      })
      return res;
    },

  },

  watch: {
    // 创意名称
    'formData.aptitude.industry': function() {
      console.log(1)
      let type = this.projectData.type == '003' ? '联动' : this.projectData.type == '001' ? '上屏' : '下屏';
      let industryName = this.$tools.getObjectItemFromArray(this.industryList, 'industryId', this.formData.aptitude.industry);
      this.formData.name = `${industryName.name }_${type}_${this.$tools.getFormatDate('mm_dd')}`;
    }
  }
}
</script>

<style lang="scss">
.upload-creative{
  position: relative;
  .el-image-viewer__close{
    color: #fff;
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
      height: 485px;
    }
    .put-form{
      width: 352px;
      margin-top: 12px;
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
        .del-third-monitor{
          position: absolute;
          cursor: pointer;
          font-size: 18px;
          top: -5px;
          right: -5px;
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
          font-size: 18px;
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