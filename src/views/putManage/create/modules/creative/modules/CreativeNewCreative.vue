<!-- 创建创意公用组件 -->
<template>
  <div class="upload-creative">
    <!-- 上传素材 -->
    <PutMangeCard class="form-box creative" :style="createType === 'single' ? 'min-height: 715px;' : !haveProject ? 'min-height: 715px;' : ''" v-loading="pageLoading" :title="'制作创意'">
      <!-- 上屏 -->
      <el-form  
        ref="creativeFormMaterialTop"
        :model="formData"
        :rules="formDataRules"
        :label-position="'left'" 
        label-width="112px" class="put-form">
        <!-- 屏幕类型 -->
        <el-form-item 
          v-if="createType === 'single' || !haveProject" 
          style="margin-bottom: 12px;" class="screen-type-preview-box mt-20" 
          prop="screenType" label="屏幕类型">
          <div class="screen-type-preview-content">
            <MyRadio
              v-for="(item, index) in projectConst.screenType"
              @click.native="formData.screenType = item.value;changeScreenType(item.value)"
              :active="formData.screenType === item.value"
              :key="index">
              <span class="float-left">{{item.name}}</span>
              <div class="float-left screen-preview">
                <div 
                  class="top" 
                  :class="{'bg-gray': item.value == '003' || item.value == '001'}"></div>
                <div 
                  :class="{'bg-gray': item.value == '003' || item.value == '002'}" 
                  class="bottom"></div>
              </div>
            </MyRadio>
          </div>
        </el-form-item>

        <div v-if="formData.screenType !== '002'">
          <el-form-item prop="top.name" class="top-box" label="上屏内容">
            <!-- 类型 -->
            <div class="mid-between">
              <el-button 
                style="width: 102px"
                @click="switchFileType(item.value)"
                v-for="(item, index) in fileType" 
                :type="formData.fileType == item.value ? 'primary' : 'info'" 
                :key="index">
                {{item.name}}
              </el-button>
            </div>
            
            <!-- 视频 -->
            <div v-if="formData.fileType === 1">
              <div class="mt-12 my-input-upload">
                <input 
                  ref="topVideo"
                  @change="uploadMedia($event, 'topVideo')" 
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
            <div v-if="formData.fileType === 2">
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
        </div>

        <!-- 时长  -->
        <el-form-item prop="durationType" label="投放时长">
          <el-select class="width-100-p"
            :disabled="this.createType === 'step'"
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

        <!-- 预览 -->
        <div class="creative-preview-box">
          <PreviewBox 
            :innerWidth="108" 
            :top="previewInfo.top" 
            :bottom="previewInfo.bottom880"/>
          <p class="decription color-text-1 font-12"><span class="color-red">*</span>AVI格式暂不支持预览</p>
        </div>

      </el-form>

      <!--下屏 -->
      <div v-if="formData.screenType !== '001'">
        <!-- 1080 880 -->
        <el-form
          ref="creativeFormMaterialBottom880"
          :model="formData"
          :rules="formDataRules"
          :label-position="'left'" 
          label-width="112px" class="put-form">
          <el-form-item prop="bottom880Image.name" label="下屏内容">
            <div class="my-input-upload mt-12">
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
            <div class="my-input-upload mt-12">
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
            :disabled="this.createType === 'step'"
            class="width-100-p" 
            @change="generateCreativeName"
            v-model="formData.industry" 
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
              v-for="(item, index)  in formData.industryImage"
              :key="index">
              <el-image
                :preview-src-list="aptitudePreviewImgs"
                style="width: 100px; height: 160px"
                :src="$tools.fileToUrl(item)"
                fit="cover">
              </el-image>
              <!-- 删除 -->
              <div class="del-third-monitor mid-center" @click="$tools.removeArrayItemByIndex(formData.industryImage, index)">
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

        <div class="monitor-box" v-for="(monitor, index) in formData.monitor" :key="index">
          <el-form-item label="监测模式">
            <el-select class="width-100-p" v-model="formData.monitor[index].mode" placeholder="请选择">
              <el-option
                v-for="item in MonitorData.mode"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>

          <div v-show="formData.monitor[index].mode">
            <el-form-item class="mt-10" label="第三方监测">
              <el-select class="width-100-p" v-model="formData.monitor[index].thirdPartyMonitor" placeholder="请选择">
                <el-option
                  v-for="(item, index) in MonitorData.thirdPartyMonitor"
                  :key="index"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item v-show="formData.monitor[index].thirdPartyMonitor == 'mz'" class="mt-10" label="第三方监测地址">
              <el-input v-model="formData.monitor[index].thirdPartyMonitorUrl" placeholder="多个地址英文逗号隔开"></el-input>
            </el-form-item>
          </div>

          <!-- 删除 -->
          <div v-show="index > 0" class="del-third-monitor" @click="$tools.removeArrayItemByIndex(formData.monitor, index)">
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
    <PutMangeCard class="save-box clearfix" v-loading="pageLoading">
      <div class="float-right">
        <el-button  style="width: 136px" @click="nextPage()">取消</el-button>
        <el-button  style="width: 136px" @click="saveCreative" type="primary">
          {{createType === 'edit' ? '确认并关闭' : '新建并关闭'}}
        </el-button>
      </div>
    </PutMangeCard>

    <!-- 保存成功提示 -->
    <el-dialog
      title="创意审核"
      :visible.sync="successDialog"
      width="568px"
      height="320px"
      :before-close="handleClose">
      <span>创意已提交审核，请及时核实审核结果，以免因未按时审核通过，而造成方案取消！</span>
      <span slot="footer" class="dialog-footer center">
        <el-button style="width:100px;" type="primary" @click="successDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import PutMangeCard from '../../../../templates/PutMangeCard' 
import MyRadio from '../../../../../../components/MyRadio' 
import PreviewBox from '../../../../../../components/PreviewBox' 
import { projectConst, MonitorData, fileType } from '../../../../../../utils/static'
import { mapMutations, mapState } from 'vuex'
export default {
  components: {
    PutMangeCard,
    MyRadio,
    PreviewBox
  },

  data() {
    return {
      // 常量
      MonitorData,
      projectConst,
      fileType,
      
      createType: 'single', // single 联动,  top 上,  bottom 下屏
      haveProject: false, // 编辑时后端返回的是否绑定创意, 判断是否可以选择上下屏类型
      pageLoading: true, // 页面加载中 数据保存中
      formData: {
        id: '',
        projectId: '',
        name: '', //创意名称
        screenType: '',// 屏幕类型，003联动，001上屏，002下屏
        fileType: 1,//上屏文件类型，1：视频,2:图片
        industry: '', // 广告创意行业
        top: '', // 上屏
        bottom720Image: '',
        bottom880Image: '',
        durationType: '', // 上屏或者联动上下屏需要上传，001 5s，002：10s，003：15s
        industryImage: [], // 广告创意资质图片
        monitor: [
          { 
            mode: '', 
            thirdPartyMonitor: 'ky',
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
          { required: true, message: '请选择投放时长!', trigger: 'change' },
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

      successDialog: true,
    }
  },
  
  beforeMount: async function() {
    this.createType = this.$route.query.createType;
    this.formData.projectId = this.$route.query.projectId || '';
    this.industryList = await this.getIndustryList();

    // 按步骤创建
    if (this.createType === 'step') {
      let projectTmp = await this.getProjectDetail();
      this.setProjectData(projectTmp)
      this.setPageProjectDetail()
      this.generateCreativeName();
      this.pageLoading = false;
    }

    // 单独创建创意
    if (this.createType === 'single') {
      this.formData.screenType = this.projectConst.screenType[0].value;
      this.generateCreativeName();
      this.pageLoading = false;
    }

    // 编辑
    if (this.createType === 'edit') {
      this.editInit(+this.$route.query.creativeId)
    }
  },

  methods: {
    ...mapMutations(['setProjectData']),

    // 编辑初始化
    editInit(creativeId) {
      this.pageLoading = true;
      this.formData.id = creativeId;
      this.$api.CreateCreative.CreativeDetail(creativeId)
        .then(res => {
          let resData = res.result;
          this.haveProject = resData.haveProject;
          
          this.formData.name = resData.name;
          this.formData.screenType = resData.screenType;
          this.formData.durationType = resData.durationType;
          this.formData.fileType = +resData.fileType;
          this.formData.industry = resData.industry
          this.formData.monitor = resData.monitor || [
          { 
            mode: '', 
            thirdPartyMonitor: 'ky',
            thirdPartyMonitorUrl: '',
          }
        ];
          this.formData.industryImage = resData.industryIdentify ? JSON.parse(resData.industryIdentify) : [];

          // 素材回显
          resData.materials.forEach((item, index) => {
            if (item.screenType === 1) {
              this.formData.top = item;
              this.formData.top.name = item.fileName;
            }
            if (item.screenType === 2 && item.height === 880) {
              this.formData.bottom880Image = item;
              this.formData.bottom880Image.name = item.fileName;
            }
            if (item.screenType === 2 && item.height === 720) {
              this.formData.bottom720Image = item;
              this.formData.bottom720Image.name = item.fileName;
            }
          })

          this.pageLoading = false;
        })
        .catch(res => {
          this.pageLoading = false;
        })
    },

    // 切换屏幕类型
    changeScreenType(typeCode) {
      switch (typeCode) {
        case '001': // 上
          this.formData.bottom720Image = '';
          this.formData.bottom880Image = '';
          break;
        case '002': // 下
          this.formData.top = '';
          break;
        default:
          break;
      }
    },
    
    // 获取行业列表
    getIndustryList: async function() {
      return new Promise((resolve, reject) => {
        this.$api.IndustryList.AllList()
          .then(res => {
            resolve(res.result)
          })
          .catch(res => {
            this.pageLoading = false;
          })
      })
    },

    // 获取方案信息
    getProjectDetail: async function(){
      return new Promise((resolve, reject) => {
        // 投放方案数据
        this.$api.CreateCreative.GetProjectDetailById(this.formData.projectId)
          .then(res => {
            resolve(res.result)
          })
          .catch(res => {
            this.pageLoading = false;
          })
      })
    },

    // 方案数据回显
    setPageProjectDetail() {
      this.formData.industry = this.projectData.industry;
      this.formData.durationType = this.projectData.second;
      this.formData.screenType = this.projectData.type;
    },

    // 生成创意名字
    generateCreativeName() {
      let type = this.projectData.type == '003' ? '联动' : this.projectData.type == '001' ? '上屏' : '下屏';
      let industryName = this.$tools.getObjectItemFromArray(this.industryList, 'industryId', this.formData.industry);
      this.formData.name = `${industryName.name || '行业'}_${type}_${this.$tools.getFormatDate('mm_dd')}`;
    },

    /**
     * @description: 上传图片 视频
     * @param: mediaType 视频 图片(上, 880 720)
     */
    uploadMedia(event, mediaType) {
      let _file = event.target.files[0];
      if (mediaType === 'topVideo') {
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
            this.formData.top =  _file;
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
              return this.formData.top = _file;
            }
            if (mediaType === 'bottom880Image' || mediaType === 'bottom720Image'){
              return this.formData[mediaType] = _file;
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
      if (this.formData.fileType === value) return;
      this.formData.fileType = value;
      // if (this.createType === 'single') {
      //   this.formData.durationType = '';
      // }
      this.formData.top = '';
    },

    // 添加资质
    addIndustry(event) {
      this.formData.industryImage.push(event.target.files[0])
      this.$refs.uploadAptitude.value = '';
    },

    // 删除资质
    delAptitude(index) {
      this.formData.aptitude.images.splice(index, 1)
    },

    // 添加第三方监测
    addThirdPartMonitor() {
      this.formData.monitor.push({
        mode: 'SDK',
        thirdPartyMonitor: 'ky',
        thirdPartyMonitorUrl: ''
      })
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
      this.pageLoading = true;
      let paramForm = new FormData();
      if (this.createType === 'edit') {
        paramForm.append('id', this.formData.id)
      }
      paramForm.append('durationType', this.formData.durationType)
      paramForm.append('industry', this.formData.industry)
      paramForm.append('name', this.formData.name)
      paramForm.append('screenType', this.formData.screenType)
      paramForm.append('bottom720Image', this.formData.bottom720Image)
      paramForm.append('bottom880Image', this.formData.bottom880Image)
      paramForm.append('fileType', this.formData.fileType || 2)
      paramForm.append('projectId', this.formData.projectId)
      paramForm.append('top', this.formData.top)
      
      for (let i=0; i<this.formData.industryImage.length; i++) {
        if (typeof this.formData.industryImage[i] === 'string'){
          paramForm.append(`industryUrls`, this.formData.industryImage[i])
        } else {
          paramForm.append(`industryImage`, this.formData.industryImage[i])
        }
      }
      
      if (this.formData.monitor.length >= 1 && this.formData.monitor[0].mode) {
        for (let i=0; i<this.formData.monitor.length; i++) {
          paramForm.append(`monitor[${i}].mode`, this.formData.monitor[i].mode)
          paramForm.append(`monitor[${i}].thirdPartyMonitor`, this.formData.monitor[i].thirdPartyMonitor)
          paramForm.append(`monitor[${i}].thirdPartyMonitorUrl`, this.formData.monitor[i].thirdPartyMonitorUrl)
        }
      }

      if (this.createType === 'edit') {
        this.$api.CreateCreative.EditCreative({id: this.formData.id, formData: paramForm})
          .then(res => {
            this.pageLoading = false;
            this.nextPage()
            return this.$notify({
              title: '成功',
              message: '修改创意成功',
              type: 'success'
            })
          })
          .catch(res => {
            this.pageLoading = false;
          })
      }

      if (this.createType !== 'edit') {
        this.$api.CreateCreative.AddCreative(paramForm)
          .then(res => {
            this.pageLoading = false;
            this.nextPage()
            return this.$notify({
              title: '成功',
              message: '创建创意成功',
              type: 'success'
            })
          })
          .catch(res => {
            this.pageLoading = false;
          })
      }

    },

    // 保存取消按钮下一个跳转页面
    nextPage() {
      this.$router.push({
        path: '/putManage',
        query: {
          'active': this.createType !== 'step' ? 'creative' : 'project'
        }
      })
    }

  },

  computed: {
    ...mapState({
      projectData: state => state.putCreative.projectData
    }),

    // 资质预览图片列表
    aptitudePreviewImgs() {
      let res = [];
      this.formData.industryImage.forEach(item => {
        res.push(this.$tools.fileToUrl(item))
      })
      return res;
    },

    // 生成预览对象
    previewInfo() {
      let top = {};
      let bottom880 = {};

      if (this.formData.top) {
        if (this.formData.top.id) {
          let suffix = this.$tools.getSuffix(this.formData.top.previewUrl);
          top = {
            type: suffix,
            url: this.formData.top.previewUrl
          }
        } else {
          top = {
            type: this.formData.top.type,
            url: this.$tools.fileToUrl(this.formData.top)
          }
        }
      }

      if (this.formData.bottom880Image) {
        if (this.formData.bottom880Image.id) {
          let suffix = this.$tools.getSuffix(this.formData.bottom880Image.previewUrl);
          bottom880 = {
            type: suffix,
            url: this.formData.bottom880Image.previewUrl
          }
        } else {
          bottom880 = {
            type: this.formData.bottom880Image.type,
            url: this.$tools.fileToUrl(this.formData.bottom880Image)
          }
        }
      }

      return { top, bottom880 };
    }
  },

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
      min-height: 410px;
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
  }
  .save-box{
    margin-top: 40px !important;
  }
  .creative-preview-box{
    position: absolute;
    bottom:0;
    margin:0 0 80px 558px;
    .decription{
      margin-top: 40px;
    }
  }
}
</style>