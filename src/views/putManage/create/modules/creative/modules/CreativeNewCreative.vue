<!-- 创建创意公用组件 -->
<template>
  <div class="upload-creative" v-loading.fullscreen.lock="pageLoading">
    <!-- 上传素材 -->
    <PutMangeCard 
      class="form-box creative" 
      :title="'制作创意'">

      <!-- 上屏 -->
      <el-form  
        ref="creativeFormMaterialTop"
        :model="formData"
        :rules="formDataRules"
        :label-position="'left'" 
        label-width="112px" class="put-form">

        <!-- 屏幕类型 -->
        <el-form-item 
          v-if="createType === 'single' || (createType === 'edit' && !haveProject)" 
          style="margin-bottom: 22px;" class="screen-type-preview-box mt-20" 
          prop="screenType" label="屏幕类型">
          <ScreenType :value="formData.screenType" @changeScreenType="changeScreenType"/>
        </el-form-item>

        <!-- 视频 图片 -->
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
                  class="input-real width-240"/>
                <el-input
                  suffix-icon="iconfont icon-uploading1"
                  placeholder="请上传"
                  v-model="formData.top.name" class="input-fake width-240"></el-input>
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
                  class="input-real width-240"/>
                <el-input
                  suffix-icon="iconfont icon-uploading1"
                  placeholder="请上传"
                  v-model="formData.top.name" class="input-fake width-240"></el-input>
              </div>
              <p class="decription color-text-1 font-12"><span class="color-red">*</span>上传1080X1920的图片，仅支持jpg格式</p>
            </div>

          </el-form-item>
        </div>

        <!-- 时长  -->
        <el-form-item prop="durationType" label="投放时长">
          <el-select class="width-240"
            :disabled="this.createType === 'step' || haveProject"
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
          <p class="description color-text-1 font-12"><span class="color-red">*</span>AVI格式暂不支持预览</p>
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
                class="input-real width-240"/>
              <el-input
                suffix-icon="iconfont icon-uploading1"
                placeholder="请上传"
                v-model="formData.bottom880Image.name" class="input-fake width-240"></el-input>
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
                class="input-real width-240"/>
              <el-input
                suffix-icon="iconfont icon-uploading1"
                placeholder="请上传"
                v-model="formData.bottom720Image.name" class="input-fake width-240"></el-input>
            </div>
            <p class="decription color-text-1 font-12"><span class="color-red">*</span>上传1280x720的图片，仅支持jpg格式</p>
          </el-form-item>
        </el-form>
      </div>

    </PutMangeCard>

    <!-- 广告资质 -->
    <PutMangeCard :title="'广告创意资质'" class="form-box aptitude">
      <el-form
        ref="creativeFormIndustry"
        :label-position="'left'"
        :model="formData"
        :rules="formDataRules" 
        label-width="112px" class="put-form">

        <!-- 行业列表 -->
        <el-form-item prop="industry" label="广告创意行业">
          <Industry 
            :value="formData.industry" 
            :disabled="createType === 'step' || haveProject" 
            @changeIndustry="changeIndustry"/>
        </el-form-item>
        
        <!-- 资质图片 -->
        <el-form-item class="mt-20" label="广告创意资质">
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
    <PutMangeCard :title="'第三方监测'" class="form-box aptitude">
      <el-form
        ref="creativeForm"
        :model="formData"
        :rules="formDataRules"
        :label-position="'left'" 
        label-width="112px" class="put-form">

        <div class="monitor-box" v-for="(monitor, index) in formData.monitor" :key="index">
          <el-form-item label="监测模式">
            <el-select class="width-240" v-model="formData.monitor[index].mode" placeholder="请选择">
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
              <el-select class="width-240" v-model="formData.monitor[index].thirdPartyMonitor" placeholder="请选择">
                <el-option
                  v-for="(item, index) in MonitorData.thirdPartyMonitor"
                  :key="index"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item v-show="formData.monitor[index].thirdPartyMonitor == 'mz'" class="mt-10" label="第三方监测地址">
              <el-input class="width-240" v-model="formData.monitor[index].thirdPartyMonitorUrl" placeholder="多个地址英文逗号隔开"></el-input>
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
    <PutMangeCard :title="'广告创意名称'" class="form-box aptitude">
      <el-form
        ref="creativeFormName"
        :model="formData"
        :rules="formDataRules"
        :label-position="'left'" 
        label-width="112px" class="put-form">
        <el-form-item prop="name" label="广告创意名称">
          <el-input class="width-240" v-model.trim="formData.name" clearable placeholder="请输入名称"></el-input>
        </el-form-item>
      </el-form>
    </PutMangeCard>

    <!-- 保存 取消 -->
    <PutMangeCard class="save-box clearfix">
      <div class="float-right">
        <el-button  style="width: 136px" @click="nextPage()">取消</el-button>
        <el-button  style="width: 136px" @click="saveCreative" type="primary">
          {{createType === 'edit' ? '确认并关闭' : '新建并关闭'}}
        </el-button>
      </div>
    </PutMangeCard>

    <!-- 保存成功提示 -->
    <el-dialog
      class="dialog-mid my-dialog"
      title="创意审核"
      :beforeClose="nextPage"
      :visible.sync="successDialog"
      width="580px">
      <p style="line-height: 1.5">创意已提交审核，请及时核实审核结果，以免因未按时审核通过，而造成方案取消！</p>
      <span slot="footer" class="dialog-footer center">
        <el-button type="primary" @click="nextPage">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import PutMangeCard from '../../../../templates/PutMangeCard' 
import Industry from '../../../../templates/Industry'
import MyRadio from '../../../../../../components/MyRadio' 
import ScreenType from '../../../../templates/ScreenType'
import PreviewBox from '../../../../../../components/PreviewBox' 
import { projectConst, MonitorData, fileType } from '../../../../../../utils/static'
import { mapMutations, mapState } from 'vuex'
export default {
  components: {
    PutMangeCard,
    Industry,
    MyRadio,
    ScreenType,
    PreviewBox
  },

  data() {
    let _this = this;

    let validateTop = async function(rule, value, callback)  {
      if (!value) {
        callback(new Error('请上传创意!'))
      }

      // 视频
      if (_this.formData.fileType === 1 && !_this.$tools.checkSuffix(value, ['mp4', 'avi'])) {
        callback(new Error('请上传MP4、AVI格式的视频!'))
      }

      // 图片
      if (_this.formData.fileType === 2) {
        if (!_this.$tools.checkSuffix(value, ['jpg'])) {
          callback(new Error('请上传JPG格式的图片!'))
        }

        if (_this.formData.top.size) {
          let sizeInfo = await _this.$tools.checkImageSize(_this.formData.top, 1080, 1920, true)
  
          if (sizeInfo === 'sizeError') {
            callback(new Error('图片尺寸不符合!'))
          }
        }
      }
      
      callback()
    };

    let bottom720 = async function(rule, value, callback) {
      if (!value) {
        callback(new Error('请上传创意!'))
      }

      if (!_this.$tools.checkSuffix(value, ['jpg'])) {
        callback(new Error('请上传JPG格式的图片!'))
      }

      if (_this.formData.bottom720Image.size) {
        let sizeInfo = await _this.$tools.checkImageSize(_this.formData.bottom720Image, 1280, 720)
        
        if (sizeInfo === 'widthError') {
          callback(new Error('图片宽度不符合!'))
        }
  
        if (sizeInfo === 'heightError') {
          callback(new Error('图片高度不符合!'))
        }
      }


      callback()
    };

    let bottom880 = async function(rule, value, callback) {
      if (!value) {
        callback(new Error('请上传创意!'))
      }

      if (!_this.$tools.checkSuffix(value, ['jpg'])) {
        callback(new Error('请上传JPG格式的图片!'))
      }

      if (_this.formData.bottom880Image.size) {
        let sizeInfo = await _this.$tools.checkImageSize(_this.formData.bottom880Image, 1080, 880)
  
        if (sizeInfo === 'widthError') {
          callback(new Error('图片宽度不符合!'))
        }
  
        if (sizeInfo === 'heightError') {
          callback(new Error('图片高度不符合!'))
        }
      }


      callback()
    };

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
        industryName: '',
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
          { required: true, message: '请输入广告创意名称!', trigger: ['change', 'blur'] },
          { max: 50, message: '创意名称不超过50个字,请正确输入!'}
        ],
        durationType: [
          { required: true, message: '请选择投放时长!', trigger: 'change' },
        ],
        industry: [
          { required: true, message: '请选择广告创意行业!', trigger: 'change' },
        ],
        'top.name': [
          { validator: validateTop, trigger: 'change' }
        ],
        'bottom720Image.name': [
          { validator: bottom720, trigger: 'change' }
        ],
        'bottom880Image.name': [
          { validator: bottom880, trigger: 'change' }
        ],
      },

      industryList: [], // 广告创意行业
      industryListProps: {
        value: 'industryId',
        label: 'name',
        expandTrigger: 'hover',
        emitPath: false
      },

      successDialog: false,
    }
  },
  
  created: async function() {
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
          this.formData.industryName = resData.industryName
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
    changeScreenType(type) {
      this.formData.screenType = type.value;
      this.generateCreativeName()
      switch (type.value) {
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

    // 切换行业
    changeIndustry(industry) {
      this.formData.industry = industry.value;
      this.generateCreativeName(industry.name)
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
      this.formData.industryName = this.projectData.industryName;
      this.formData.durationType = this.projectData.second;
      this.formData.screenType = this.projectData.type;
    },

    // 生成创意名字
    generateCreativeName(industryName) {
      if (this.createType === 'edit') return;
      let _industryName = industryName || this.projectData.industryName;
      let type = this.formData.screenType == '003' ? '联动' : this.formData.screenType == '001' ? '上屏' : '下屏';
      this.formData.name = `${_industryName || '行业'}_${type}_${this.$tools.getFormatDate('mm_dd')}`;
    },

    /**
     * @description: 上传图片 视频
     * @param: mediaType 视频 图片(上, 880 720)
     */
    uploadMedia(event, mediaType) {
      let _file = event.target.files[0];

      if (mediaType === 'topVideo' || mediaType === 'topImage') {
        this.formData.top =  _file;
      }

      if (mediaType === 'bottom880Image'){
        return this.formData.bottom880Image = _file;
      }

      if (mediaType === 'bottom720Image'){
        return this.formData.bottom720Image = _file;
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

    // 校验表单
    validateForm() {
      let isPassEnptyCheck = true;
      let validateForms = ['creativeFormMaterialTop', 'creativeFormMaterialBottom880', 'creativeFormMaterialBottom720', 'creativeForm', 'creativeFormName', 'creativeFormIndustry'];
      
      validateForms.forEach((item, index) => {
        if(this.$refs[item]) {
          this.$refs[item].validate((valid) => {
            if (!valid) { return isPassEnptyCheck = false; } 
          });
        }
      })

      return isPassEnptyCheck;
    },

    // 保存
    saveCreative() {
      
      if (!this.validateForm()) return;

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
            this.successDialog = true;
          })
          .catch(res => {
            this.pageLoading = false;
          })
      }

      if (this.createType !== 'edit') {
        this.$api.CreateCreative.AddCreative(paramForm)
          .then(res => {
            this.pageLoading = false;
            this.successDialog = true;
          })
          .catch(res => {
            this.pageLoading = false;
          })
      }

    },

    // 保存取消按钮下一个跳转页面
    nextPage() {
      this.$router.replace({
        path: '/putManage',
        query: {
          active: 'creative'
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
    },

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
    top:40px;
    margin:0 0 80px 758px;
    .description{
      margin-top: 30px;
    }
  }
}
</style>