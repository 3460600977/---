<template>
  <div class="put-project">
    <div class="title">
      {{cityInsightDisabled}}
      <h2>所属投放计划：{{planData.data.name || formData.planName}}</h2>
    </div>

    <!-- 投放设置 -->
    <PutMangeCard v-loading="planData.loading" :title="'投放设置'" class="form-box">
      <el-form
        ref="planTop"
        :label-position="'left'"
        :model="formData"
        :rules="formDataRules" 
        label-width="112px" class="put-form">

        <!-- 投放方案行业 -->
        <el-form-item class="mt-20" prop="industry" label="投放方案行业">
          <el-select 
            :disabled="isEdit"
            @focus="getIndustryList"
            :loading="industry.loading"
            filterable
            clearable
            v-model="formData.industry" 
            value-key="industryId"
            placeholder="请选择">
            <el-option
              v-for="(item, index) in industry.data"
              :key="index"
              :label="item.name"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 屏幕类型 -->
        <el-form-item class="screen-type-preview-box mt-20" prop="type" label="屏幕类型">
          <div class="screen-type-preview-content">
            <MyRadio
              :disabled="isEdit"
              v-for="(item, index) in projectConst.screenType"
              @click.native="isEdit ? null : formData.type = item"
              :active="formData.type === item"
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

        <!-- 投放类型 -->
        <el-form-item class="mt-20" prop="projectType" label="投放类型">
          <div class="mid-between" style="width: 240px">
            <el-button 
              :disabled="isEdit"
              style="width: 102px"
              @click="formData.projectType = type;
                formData.dateForDay = '';
                formData.dateForWeekBegin = '';
                formData.dateForWeekEnd = '';"
              v-for="(type, index) in projectConst.putType" 
              :type="type == formData.projectType ? 'primary' : 'info'" 
              :key="index">
              {{type.name}}
            </el-button>
          </div>
        </el-form-item>
        
        <!----- 
          投放时间 
        ----->
        <!-- 按天投放 -->
        <el-form-item v-show="formData.projectType.value == 1" class="mt-20" prop="dateForDay">
          <label slot="label"><span class="color-red">* </span>投放时间</label>
          <el-date-picker
            :disabled="isEdit"
            v-model="formData.dateForDay"
            value-format="yyyy-MM-dd"
            type="daterange"
            :picker-options="pickerOptionsForDay"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间">
          </el-date-picker>
        </el-form-item>

        <!-- 按周投放 -->
        <div v-show="formData.projectType.value == 0" class="week-picker-box clearfix">
          <el-form-item class="week-item mt-20" prop="dateForWeekBegin">
            <label slot="label"><span class="color-red">* </span>投放时间</label>
            <el-date-picker
              :disabled="isEdit"
              @change="chooseWeek"
              value-format="yyyy-MM-dd"
              style="width: 150px"
              v-model="formData.dateForWeekBegin"
              type="date"
              placeholder="开始时间"
              :picker-options="pickerOptionsForWeekBegin">
            </el-date-picker>
          </el-form-item>

          <label class="float-left week-center-label center">至</label>
          <el-form-item class="week-item end mt-20" prop="dateForWeekEnd">
            <el-date-picker
              :disabled="!formData.dateForWeekBegin || isEdit"
              @change="chooseWeek"
              value-format="yyyy-MM-dd"
              style="width: 170px"
              v-model="formData.dateForWeekEnd"
              type="date"
              :placeholder="formData.dateForWeekBegin ? '请选择' : '请选择开始时间'"
              :picker-options="pickerOptionsForWeekEnd">
            </el-date-picker>
          </el-form-item>
        </div>

        <!-- 投放方式 -->
        <!-- <el-form-item class="mt-20" prop="deliveryMode" label="投放方式">
          <MyRadio
            :disabled="isEdit"
            v-for="(way, index) in projectConst.putWay"
            @click.native="isEdit ? null : formData.deliveryMode = way"
            :active="+formData.deliveryMode.value === 1+index"
            :key="index">{{way.name}}</MyRadio>
        </el-form-item> -->

        <!-- 投放频次 -->
        <el-form-item class="mt-20" prop="count" label="投放频次">
          <el-select  :disabled="isEdit" filterable v-model="formData.count" placeholder="请选择">
            <el-option
              v-for="(frequency, index) in projectConst.putFrequency"
              :key="index"
              :label="frequency.name"
              :value="frequency">
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 投放时长 -->
        <el-form-item class="mt-20" prop="second" label="投放时长">
          <el-select  :disabled="isEdit" filterable v-model="formData.second" placeholder="请选择">
            <el-option
              v-for="(duration, index) in projectConst.putDuration"
              :key="index"
              :label="duration.name"
              :value="duration">
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
        
    </PutMangeCard>

    <!-- 楼盘定向 -->
    <PutMangeCard v-if="!isEdit" v-loading="planData.loading" :title="'楼盘定向'" class="form-box">
      <el-tabs class="thin-tab mt-15" v-model="buildingDirection.activeType">
               
        <!-- 已有资源包 -->
        <el-tab-pane label="已有资源包" name="exist">
          <el-form label-position='left' label-width="125px">
            <el-form-item label="已有资源包">
              <el-select 
                @focus="getCityInsightList"
                @change="getCityInsightDetail(buildingDirection.cityInsight.selectedItemId)"
                @clear="setBuildsList([])"
                :loading="buildingDirection.cityInsight.loading" 
                :disabled="cityInsightDisabled"
                v-model="buildingDirection.cityInsight.selectedItemId" 
                filterable
                clearable
                :placeholder="!cityInsightDisabled ? '请选择' : '请先完善投放设置'">
                <el-option
                  v-for="item in buildingDirection.cityInsight.data"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-button @click="showMapChoose" type="primary" style="margin-left: 10px;">管理已有资源包</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 新建楼盘定向 -->
        <el-tab-pane label="新建楼盘定向" name="create">
          <el-form label-position='left' label-width="125px">
            <el-form-item label="选点方式">
              <el-button @click="showMapChoose" type="primary" style="width: 102px">地图选点</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 导入楼盘数据 -->
        <el-tab-pane label="导入楼盘数据" name="import">
          <el-form label-position='left' label-width="125px">

            <el-form-item label="导入楼盘数据" style="margin-top: 8px">
              <div class="mid">
               <div class="my-input-upload" style="width: 240px;">
                <input 
                  v-show="!cityInsightDisabled"
                  ref="uplaodBuild"
                  @change="uplaodBuild($event)"
                  suffix-icon="el-icon-upload2"
                  type="file" 
                  accept=".xls, .xlsx"
                  class="input-real"/>
                <el-input
                  suffix-icon="el-icon-upload2"
                  :disabled="cityInsightDisabled"
                  placeholder="点击上传"
                  v-model="buildingDirection.uploadBuildsFile.name"
                  class="input-fake"></el-input>
                </div>
                <el-button @click="downloadTemplate" type="primary" 
                  :loading="buildingDirection.templateFileDownloading"
                  style="width: 102px; margin-left: 10px">模板下载</el-button>
              </div>
              <span class="el-form-item__error" v-if="cityInsightDisabled">* 请先完善投放设置!</span>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <!-- 楼盘定向->选中列表 -->
      <SelectedList
        :loading="buildingDirection.builds.loading"/>
    </PutMangeCard>

    <!-- 投放方案名称 -->
    <PutMangeCard v-loading="planData.loading" :title="'投放方案名称'" class="form-box">
      <el-form
        ref="planName"
        :model="formData"
        :rules="formDataRules"
        :label-position="'left'" 
        label-width="112px" class="put-form">
        <el-form-item prop="name" label="投放方案名称">
          <el-input v-model.trim="formData.name" clearable placeholder="请输入名称"></el-input>
        </el-form-item>
      </el-form>
    </PutMangeCard>

    <!-- 保存 取消 -->
    <PutMangeCard v-loading="planData.loading" class="save-box">
      <div v-if="isEdit" class="float-right">
        <el-button :loading="formData.confirming" @click="confirmProject" style="width: 136px" type="primary">
          <template v-if="formData.creativeStatus === 0 || formData.creativeStatus === 2">
            保存并关闭
          </template>
          <template v-else>
            下一步
          </template>
        </el-button>
      </div>

      <div v-else class="float-right">
        <el-button style="width: 136px" plain>取消</el-button>
        <el-button :loading="formData.confirming" @click="confirmProject" style="width: 136px" type="primary">确定</el-button>
      </div>
    </PutMangeCard>

    <!-- 楼盘预估数面板 -->
    <EstimateBox v-if="!isEdit"/>
    
    <!-- 地图选点 -->
    <mapChooseWindow :mapChooseShow.sync="buildingDirection.mapChooseShow"/>

    <!-- 确认投放方案信息 -->
    <confirmWindow @closeDetail="confirmWindowMsg.show = false" :confirmWindowMsg.sync ="confirmWindowMsg"/>

  </div>
</template>

<script>
import PutMangeCard from '../../../../templates/PutMangeCard' 
import MyRadio from '../../../../../../components/MyRadio' 
import SelectedList from './SelectedList' 
import mapChooseWindow from './mapChooseWindow' 
import confirmWindow from './confirmWindow' 
import EstimateBox from './EstimateBox'
import { projectConst } from '../../../../../../utils/static'
import { mapGetters, mapMutations } from 'vuex'
export default {
  components: {
    PutMangeCard,
    MyRadio,
    SelectedList,
    mapChooseWindow,
    confirmWindow,
    EstimateBox
  },
  data() {
    let checkDate = (rule, value, callback) => {
      // 投放类型，0按周投放，1按天投放
      if (this.formData.projectType.value === 1 && !value) {
        callback(new Error('请设置时间！'));
      }
      callback()
    };
    let checkWeek = (rule, value, callback) => {
      // 投放类型，0按周投放，1按天投放
      if (this.formData.projectType.value === 0 && !value) {
        callback(new Error('请设置时间！'));
      }
      callback()
    };

    return {
      projectConst,
      // 所属计划的信息
      planData: {
        loading: true,
        data: ''
      },

      // 投放行业
      industry: {
        loading: false,
        data: ''
      },

      // 楼盘定向
      buildingDirection: {
        activeType: 'exist',
        mapChooseShow: false,
        uploadBuildsFile: '',
        templateFileDownloading: false, // 导入楼盘数据->下载中
        // 城市洞察包列表
        cityInsight: {
          loading: true,
          data: '',
          selectedItemId: ''
        },
        // 楼盘余量
        builds: {
          loading: false, // null loading notnull
          data: []
        },
      },

      // 确认信息
      confirmWindowMsg: {
        show: false,
        resData: '',
        pageData: {
          beginTime: "",
          count: "",
          deliveryMode: "",
          endTime: "",
          industry: "",
          name: "",
          premiseVOS: [{
            premiseId: '', 
            premiseName: "", 
            address: "", 
            weekForPeople: ""}],
          projectCity: "",
          projectType: 0,
          second: "",
          totalCost: 0,
          type: "",
        }
      },

      formData: {
        name: '',
        industry: '',
        projectType: projectConst.putType[0], // 投放类型，0按周投放，1按天投放
        dateForDay:'',
        dateForWeekBegin:'',
        dateForWeekEnd:'',
        count: projectConst.putFrequency[2], // 投放频次
        second: projectConst.putDuration[2], // 投放时长
        type: projectConst.screenType[0], // 屏幕类型 000、未知，001、上屏，002、下屏，003、上下屏
        projectCity: '', // 城市
        details: this.buildsDetails, // 楼盘数据
        confirming: false, // 确认方案ing
      },

      formDataRules: {
        name: [
          { required: true, message: '请输入投放方案名称!', trigger: 'blur' },
        ],
        industry: [
          { required: true, message: '请选择投放方案行业!', trigger: 'change' },
        ],
        dateForDay:[
          { validator: checkDate, trigger: 'blur' },
        ],
        dateForWeekBegin:[
          { validator: checkWeek, trigger: 'blur' },
        ],
        dateForWeekEnd:[
          { validator: checkWeek, trigger: 'blur' },
        ],
        count:[
          { required: true, message: '请选投放频次!', trigger: 'change' },
        ],
        second: [
          { required: true, message: '请选择投放时长!', trigger: 'change' },
        ],
        type:[
          { required: true, message: '请选择屏幕类型!', trigger: 'change' },
        ]
      },
      
    }
  },

  beforeMount() {
    if (this.isEdit) {
      this.initProjectDetailById()
    } else {
      this.setBuildsList([]) // 清空楼盘列表
      this.getPlanDetailById(this.$route.query.planId) // 计划详情
      this.generateProjectName() // 生成名字
    }
  },

  methods: {
    ...mapMutations(['setBuildsList']),

    // 根据id获取计划详情
    getPlanDetailById(planid) {
      this.$api.PutPlan.PlanDetail(+planid)
        .then(res => {
          this.planData.loading = false;
          this.planData.data = res.result;
        })
        .catch(res => {
          this.planData.name = '加载失败请刷新页面或重新进入';
          this.planData.loading = false;
        })
    },
    
    
    // 根据id初始化回显方案详情
    initProjectDetailById: async function() {
      this.industry.data = await this.getIndustryList();
      this.$api.PutProject.GetProjectDetailById(+this.$route.query.editProjectId)
        .then(res => {
          let resData = res.result;
          this.planData.loading = false;
          // this.planData.name = resData.campaignName;
          this.formData = {
            planName: resData.campaignName,
            creativeStatus: resData.creativeStatus,
            name: resData.name,
            id: resData.id,
            industry: this.$tools.getObjectItemFromArray(this.industry.data, 'industryId', resData.industry),
            projectType: this.$tools.getObjectItemFromArray(projectConst.putType, 'value', resData.projectType), // 投放类型，0按周投放，1按天投放
            dateForDay: [resData.beginTime, resData.endTime],
            dateForWeekBegin: resData.beginTime,
            dateForWeekEnd: resData.endTime,
            deliveryMode: this.$tools.getObjectItemFromArray(projectConst.putWay, 'value', resData.deliveryMode), // 投放方式
            count: this.$tools.getObjectItemFromArray(projectConst.putFrequency, 'value', resData.count), // 投放频次
            second: this.$tools.getObjectItemFromArray(projectConst.putDuration, 'value', resData.second), // 投放时长
            type: this.$tools.getObjectItemFromArray(projectConst.screenType, 'value', resData.type), // 屏幕类型 000、未知，001、上屏，002、下屏，003、上下屏
            confirming: false
          }
        })
        .catch(res => {
          this.planData.name = '加载失败请刷新页面或重新进入';
          this.planData.loading = false;
        })
    },



    // 生成方案名字
    generateProjectName() {
      let date = new Date();
      this.formData.name = `投放方案_${this.$tools.getFormatDate('mm_dd')}`
    },

    // 行业列表
    getIndustryList: async function() {
      // if (this.industry.data) return;
      return new Promise((resolve, reject) => {
        this.industry.loading = true;
        this.$api.IndustryList.AllList()
          .then(res => {
            this.industry.loading = false;
            this.industry.data = res.result;
            resolve(res.result)
          })
          .catch(res => {
            this.industry.loading = false;
          })
      })
    },

    // 显示地图选点
    showMapChoose() {
      this.buildingDirection.mapChooseShow = true;
    },

    // 按周投放 选择时间校验结束大于开始
    chooseWeek() {
      if (!this.formData.dateForWeekBegin || !this.formData.dateForWeekEnd) return;
      if (this.formData.dateForWeekBegin >= this.formData.dateForWeekEnd) {
        this.formData.dateForWeekBegin = this.formData.dateForWeekEnd = '';
        return this.$notify({
          title: '警告',
          message: '开始时间应早于结束时间',
          type: 'warning'
        });
      }
    },

    // 获取城市洞察包列表
    getCityInsightList() {
      if (this.buildingDirection.cityInsight.data) return;
      let param = {
        "name": "",
        "pageIndex": 0,
        "pageSize": 0
      }
      this.$api.cityInsight.CityInsightList(param)
        .then(res => {
          this.buildingDirection.cityInsight = {
            loading: false,
            data: res.result
          }
        })
        .catch(res => {
          this.buildingDirection.cityInsight.loading = false;
        })
    },

    // 根据洞察id获取城市洞察包详情
    getCityInsightDetail(id) {
      if (!id) return;
      this.buildingDirection.builds.loading = true;
      this.$api.cityInsight.GetCityInsightDetailById(id)
        .then(res => {
          this.formData.projectCity = res.result.city;
          this.getBuildsAvalable(res.result)
        })
        .catch(res => {
          this.buildingDirection.builds.loading = false;
        })
    },

    /**
     * @description 根据 城市洞察详情和筛选条件 查询楼盘余量
     * @param cityInsight 城市洞察详细信息
     */
    getBuildsAvalable(cityInsight) {
      if(!cityInsight) return
      let param;
      param = {
        beginTime:   this.formData.projectType.value == 0 ? this.formData.dateForWeekBegin : this.formData.dateForDay[0],
        endTime:     this.formData.projectType.value == 0 ? this.formData.dateForWeekEnd : this.formData.dateForDay[1],
        count:       this.formData.count.value,
        deliveryMode:this.formData.deliveryMode.value,
        industry:    this.formData.industry.industryId,
        premiseIds:  cityInsight.premiseIds,
        projectCity: cityInsight.city,
        projectType: this.formData.projectType.value,
        second:      this.formData.second.value,
        type:        this.formData.type.value
      };

      this.$api.PutProject.BuildsAvailableByCityInsignt(param)
        .then(res => {
          this.setBuildsList(res.result)
          // this.buildingDirection.builds.data = res.result;
          this.buildingDirection.builds.loading = false;
        })
        .catch(res => {
          this.setBuildsList([])
          // this.buildingDirection.builds.data = [];
          this.buildingDirection.builds.loading = false;
        })
    },

    // 导入楼盘数据
    uplaodBuild(event) {
      let file = event.target.files[0];
      let formData = new FormData();
      let param;
      if (!this.$tools.checkSuffix(file.name, ['xls', 'xlsx'])) {
        this.$refs.uplaodBuild.value = '';
        return this.$notify({
          title: '警告',
          message: '请上传正确格式的文件',
          type: 'warning'
        });
      }

      this.buildingDirection.builds.loading = true;
      this.buildingDirection.uploadBuildsFile = file;

      param = {
        beginTime:   this.formData.projectType.value === 0 ? this.formData.dateForWeekBegin : this.formData.dateForDay[0],
        endTime:     this.formData.projectType.value === 0 ? this.formData.dateForWeekEnd : this.formData.dateForDay[1],
        count:       this.formData.count.value,
        deliveryMode:this.formData.deliveryMode.value,
        industry:    this.formData.industry.industryId,
        projectCity: this.formData.projectCity,
        projectType: this.formData.projectType.value,
        second:      this.formData.second.value,
        type:        this.formData.type.value,
        excelFile:   this.buildingDirection.uploadBuildsFile
      };

      for (let item in param) {
        formData.append(item, param[item])
      }
      this.$api.PutProject.BuildsAvailableByImport(formData)
        .then(res => {
          this.setBuildsList(res.result)
          // this.buildingDirection.builds.data = res.result;
          this.buildingDirection.builds.loading = false;
        })
        .catch(res => {
          this.setBuildsList([])
          // this.buildingDirection.builds.data = [];
          this.buildingDirection.builds.loading = false;
        })
    },

    // 下载模板
    downloadTemplate() {
      this.buildingDirection.templateFileDownloading = true;
      this.$api.PutProject.DowloadBuildsTemplate()
        .then(res => {
          this.buildingDirection.templateFileDownloading = false;
          this.$tools.downLoadFileFlow(res, `导入楼盘数据模板${this.$tools.getFormatDate("YYmmdd")}.xls`)
        })
        .catch(res => {
          this.buildingDirection.templateFileDownloading = false;
        })
    },

    // 校验表单
    validataForm() {
      let isPassEnptyCheck = true;
      let validateForms = ['planTop', 'planName'];
      for (let i=0; i<validateForms.length; i++) {
        let item = validateForms[i];
        if (!this.$refs[item]) {
          isPassEnptyCheck = false;
          break;
        }
        this.$refs[item].validate((valid) => {
          isPassEnptyCheck = valid; 
        });
        if (!isPassEnptyCheck) break;
      }
      return isPassEnptyCheck
    },

    // 确认 并锁量 展示详情
    confirmProject() {
      let param;
      let isformValidatePass = this.validataForm();
      
      if (!isformValidatePass) {
        return this.$notify({
          title: '警告',
          message: '还有必填字段未填写',
          type: 'warning'
        });
      }

      this.planData.loading = true;
      this.formData.confirming = true;
      param = {
        name:         this.formData.name,
        type:         this.formData.type.value, // 屏幕类型 000、未知，001、上屏，002、下屏，003、上下屏
        industry:     this.formData.industry.industryId, // 投放行业
        beginTime:    this.formData.projectType.value == 0 ? this.formData.dateForWeekBegin : this.formData.dateForDay[0],
        endTime:      this.formData.projectType.value == 0 ? this.formData.dateForWeekEnd : this.formData.dateForDay[1],
        campaignId:   this.$route.query.planId, // 投放计划ID
        count:        this.formData.count.value, // 投放频次，001-300次/天，002-600次/天，003-900次/天 依次类推
        // deliveryMode: this.formData.deliveryMode.value, // 投放方式，001一个楼盘所有点位，002一个单元一个电梯，003一个单元一半电梯
        details:      this.buildsDetails, // 楼盘列表
        projectCity:  this.formData.projectCity, // 城市
        projectType:  this.formData.projectType.value, // 投放类型，0按周投放，1按天投放
        second:       this.formData.second.value // 投放时长，001-5s/次，002-10s/次，003-15s/次 依次类推
      }
      if (this.isEdit) {
        this.$api.PutProject.EditProject({id: this.formData.id, name: this.formData.name})
          .then(res => {
            this.formData.confirming = false;
            this.planData.loading = false;
            this.$notify({
              title: '成功',
              message: '修改方案成功',
              type: 'success'
            });
            /**
             * 若该方式的创意状态为“未上传、审核拒绝”，按钮为【下一步】，可跳转到创建广告创意页面；
             * 若广告创意是审核拒绝，显示之前的记录，支持修改，修改后，状态为“待审核“
             * 创意状态 0未审核，1审核不通过，2审核通过
             */
            if (this.formData.creativeStatus === 0 || this.formData.creativeStatus === 2) {
              this.$router.push({
                path: '/putManage',
                query: {
                  active: 'project'
                }
              })
            } else {
              this.$router.push({
                path: '/putManage/create/creative',
                query: {
                  projectId: this.$route.query.editProjectId,
                  createType: 'step'
                }
              })
            }
          })
          .catch(res => {
            this.formData.confirming = false;
            this.planData.loading = false;
          })
      }
      if (!this.isEdit) {
        this.$api.PutProject.AddProject(param)
          .then(res => {
            this.formData.confirming = false;
            this.planData.loading = false;
            this.confirmWindowMsg.show = true;
            this.confirmWindowMsg.pageData = this.formData;
            this.confirmWindowMsg.resData = res.result;
          })
          .catch(res => {
            this.formData.confirming = false;
            this.planData.loading = false;
          })
      }
    },
  },

  computed: {
    ...mapGetters([
      'buildsNumber',
      'deviceNumber',
      'peopleNumber',
      'priceNumber',
      'buildsDetails'
    ]),

    // 限制时间选择器 按天 投放选择范围
    pickerOptionsForDay() {
      let _this = this;
      return {
        firstDayOfWeek: 6,
        disabledDate(date) {
          return date.getTime() < Date.now() - 8.64e7 || 
            date.getTime() > _this.planData.endTime || 
            date.getTime() < _this.planData.beginTime;
        }
      };
    },

    // 限制时间选择器 按周 投放选择范围
    pickerOptionsForWeekBegin() {
      let _this = this;
      return {
        firstDayOfWeek: 6,
        disabledDate(date) {
          return date.getTime() < Date.now() - 8.64e7 || 
            date.getTime() > _this.planData.endTime || 
            date.getTime() < _this.planData.beginTime || 
            date.getDay() != 6;
        },
      };
    },
    pickerOptionsForWeekEnd() {
      let _this = this;
      return {
        firstDayOfWeek: 6,
        disabledDate(date) {
          return date.getTime() < Date.now() - 8.64e7 || 
            date.getTime() > _this.planData.endTime || 
            date.getTime() < _this.planData.beginTime || 
            date.getDay() != 5 ||
            date.getTime() < (new Date(_this.formData.dateForWeekBegin)).getTime();
        },
      };
    },

    // 判断 资源包 导入是否可用
    cityInsightDisabled() {
      let res = !this.validataForm();
      // this.formData.projectCity = '';
      // if (this.buildingDirection.activeType === 'create') return;
      return res;
    },

    // 是否为编辑
    isEdit() {
      return !!this.$route.query.editProjectId;
    },

  },

  watch: {
    // 点击页面选项, 清空已选择的洞察包 楼盘数据
    formData: {
      handler(val, oldVal) {
        if (!val.projectCity) {
          this.buildingDirection.cityInsight.selectedItemId = '';
          this.setBuildsList([])
        }
      },
      deep: true,
    },
  }
}
</script>

<style lang="scss">
.put-project{
  .el-tabs__content{
    overflow: visible;
  }
  .el-select .el-input.is-disabled .el-input__inner{
    height: 36px !important;
  }
  .title{
    padding: 28px 0 0 40px;
    background: #fff;
  }
  position: relative;
  .el-form-item{
    margin-bottom: 0;
  }
  .width-100-p{
    width: 100%;
  }
  .form-box{
    position: relative;
    .put-form{
      margin-top: 18px;
      .week-picker-box{
        .week-item{
          width: 262px; 
          float: left;
          &.end{
            .el-form-item__content{
              margin-left: 0 !important;
            }
          }
        }
        .week-center-label{
          width: 32px;
          padding-top: 30px;
        }
      }
    }
  }
  .save-box{
    margin-top: 40px !important;
  }
}
</style>