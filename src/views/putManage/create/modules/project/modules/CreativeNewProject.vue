<template>
  <div v-loading.fullscreen.lock="planData.loading" class="put-project">
    <div class="title">
      <h2 style="line-height: 1.5">所属投放计划：{{planData.data.name||formData.planName}}</h2>
    </div>

    <!-- 投放设置 -->
    <PutMangeCard :title="'投放设置'" class="form-box">
      <el-form
        ref="planTop"
        :label-position="'left'"
        :model="formData"
        :rules="formDataRules"
        label-width="112px" class="put-form">

        <!-- 投放方案行业 -->
        <el-form-item class="mt-20" prop="industry" label="方案行业">
          <Industry class="width-240" :disabled="isEdit" @changeIndustry="changeIndustry"/>
        </el-form-item>

        <!-- 屏幕类型 -->
        <el-form-item class="screen-type-preview-box mt-20" prop="type" label="屏幕类型">
          <ScreenType  :value="formData.type.value" @changeScreenType="changeScreenType" :disabled="isEdit"/>
        </el-form-item>

        <!-- 投放类型 -->
        <el-form-item class="mt-20" prop="projectType">
          <label slot="label"><span class="color-red">* </span>投放类型</label>
          <div class="mid-between width-240">
            <el-button
              :disabled="isEdit"
              style="width: 102px"
              @click="formData.projectType = type;formData.date = '';"
              v-for="(type, index) in projectConst.putType"
              :type="type == formData.projectType ? 'primary' : 'info'"
              :key="index">
              {{type.name}}
            </el-button>
          </div>
        </el-form-item>

        <!-- 按天投放 -->
        <el-form-item v-if="formData.projectType.value == 1" class="mt-20" prop="date">
          <label slot="label"><i class="color-red">*&nbsp;</i>投放日期</label>
          <el-date-picker
            @change="changePageData"
            :disabled="isEdit"
            :clearable="false"
            v-model="formData.date"
            value-format="yyyy-MM-dd"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>

        <!-- 按周投放 -->
        <el-form-item v-if="formData.projectType.value == 0" class="week-item mt-20" prop="date">
          <label slot="label"><i class="color-red">*&nbsp;</i>投放日期</label>
          <el-date-picker
            @change="changePageData()"
            :disabled="isEdit"
            :clearable="false"
            v-model="formData.date"
            value-format="yyyy-MM-dd"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>

        <!-- 投放频次 -->
        <el-form-item class="mt-20" prop="count" label="投放频次">
          <el-select
            @change="changePageData"
            class="bigger"
            :disabled="isEdit"
            filterable
            v-model="formData.count"
            placeholder="请选择">
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
          <el-select
            @change="changePageData"
            class="bigger"
            :disabled="isEdit"
            filterable
            v-model="formData.second"
            placeholder="请选择">
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
    <PutMangeCard
      style="margin-bottom: 20px"
      v-if="!isEdit" :title="'楼盘定向'"
      class="form-box"
      >
      <el-tabs @tab-click="clearBuildDirection" class="thin-tab mt-15" v-model="buildingDirection.activeType">
        <!-- 已有资源包 -->
        <el-tab-pane label="选择已有资源包" name="exist">
          <el-form label-position='left' label-width="125px">
            <el-form-item label="已有资源包">
              <el-select
                class="bigger"
                @focus="getCityInsightList"
                @change="getCityInsightDetail(buildingDirection.cityInsight.selectedItem.id); setStatistics(buildingDirection.cityInsight.selectedItem)"
                @clear="setBuildsList([])"
                :loading="buildingDirection.cityInsight.loading"
                :disabled="!validataForm()"
                value-key="id"
                v-model="buildingDirection.cityInsight.selectedItem"
                filterable
                placeholder="请选择">
                <el-option
                  v-for="item in buildingDirection.cityInsight.data"
                  :key="item.id"
                  :label="item.name"
                  :value="item">
                </el-option>
              </el-select>
              <router-link to="/cityInsight/list">
                <el-button type="primary" style="margin-left: 10px;">管理已有资源包</el-button>
              </router-link>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 新建楼盘定向 -->
        <el-tab-pane label="新建楼盘定向" name="create">
          <el-form label-position='left' label-width="125px">
            <el-form-item label="选点方式">
              <el-button :disabled="!validataForm()" @click="showMapChoose" type="primary" style="width: 102px">地图选点</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <span class="my_error" v-if="!validataForm()">* 请先完善投放设置！</span>

        <!-- 导入楼盘数据 -->
        <!-- <el-tab-pane label="导入楼盘数据" name="import">
          <el-form label-position='left' label-width="125px">

            <el-form-item label="城市">
              <el-select
                @change="buildingDirection.uploadBuildsFile = ''"
                filterable
                v-model="formData.projectCity"
                :loading="cityList.loading"
                placeholder="请选择">
                <el-option
                  v-for="item in cityList.data"
                  :key="item.cityCode"
                  :label="item.name"
                  :value="item.cityCode">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="导入楼盘数据" style="margin-top: 8px">
              <div class="mid">
               <div class="my-input-upload" style="width: 240px;">
                <input
                  v-show="validataForm()"
                  ref="uplaodBuild"
                  @change="uplaodBuild($event)"
                  suffix-icon="el-icon-upload2"
                  type="file"
                  accept=".xls, .xlsx"
                  class="input-real"/>
                <el-input
                  suffix-icon="el-icon-upload2"
                  :disabled="!validataForm()"
                  placeholder="点击上传"
                  v-model="buildingDirection.uploadBuildsFile.name"
                  class="input-fake"></el-input>
                </div>
                <el-button @click="downloadTemplate" type="primary"
                  :loading="buildingDirection.templateFileDownloading"
                  style="width: 102px; margin-left: 10px">模板下载</el-button>
              </div>
              <span class="el-form-item__error" v-if="!validataForm()">* 请先完善上面投放设置!</span>
            </el-form-item>
          </el-form>
        </el-tab-pane> -->
      </el-tabs>

      <!-- 楼盘定向->选中列表 -->
      <BuildList
        class="margin-top-20"
        @delMapItem="delMapItem"
        :buildingDirectionActiveType="buildingDirection.activeType"
        :loading="buildingDirection.builds.loading"/>

      <div class="margin-top-20" v-if="buildingDirection.activeType === 'exist'"><i class="color-red">*&nbsp;</i>可售投放数详见浮窗, 实际投放数据以支付成功为准。</div>

    </PutMangeCard>

    <!-- 楼盘预估数面板 -->
    <div class="estimate-box">
      <div class="bold">可售投放数</div>

      <template v-if="deviceNumber > 0">
        <div v-loading="buildingDirection.builds.loading">
          <ul class="msg-box color-text-1">
            <li class="item">
              <label class="name">楼盘数</label><label class="font-number font-16">{{$tools.toThousands(buildsNumber, false)}}</label>个
            </li>
            <li class="item">
              <label class="name">单元数</label><label class="font-number font-16">{{$tools.toThousands(unitNum, false)}}</label>个
            </li>
            <li class="item">
              <label class="name">点位数</label><label class="font-number font-16">{{$tools.toThousands(deviceNumber, false)}}</label>个
            </li>
            <li class="item">
              <label class="name">覆盖人数</label><label class="font-number font-16">{{$tools.toThousands(peopleNumber, false)}}</label>人
            </li>
          </ul>


          <ul class="money-box">
            <li class="item">
              <span>预估费用:&emsp;</span>
              <span class="color-red">¥</span>
              <span class="color-red font-20 font-number">{{$tools.toThousands(buildingDirection.estimatePrice/100)}}</span>
            </li>
            <li class="item">
              <span>账户余额:&emsp;</span>
              <span>¥</span>
              <span class="font-20 font-number">{{$tools.toThousands(userInfo.accountBalance/100)}}</span>
              <span class="color-red" v-if="buildingDirection.estimatePrice > userInfo.accountBalance">(余额不足)</span>
            </li>
          </ul>
        </div>
      </template>

      <noData v-loading="buildingDirection.builds.loading" v-else>无可售数据</noData>


      <el-divider></el-divider>

      <div class="bold">投放方案名称</div>
      <el-form
        class="project-name"
        ref="planName"
        :model="formData"
        :rules="formDataRules"
        :label-position="'left'"
        label-width="0">
        <el-form-item prop="name">
          <el-input style="width: 100%" v-model.trim="formData.name" clearable placeholder="请输入名称"></el-input>
        </el-form-item>
      </el-form>

      <div class="save-box">
        <div v-if="isEdit" class="float-right">
          <el-button :disabled="deviceNumber === 0" :loading="formData.confirming" @click="confirmProject"
                     style="width: 120px" type="primary">
            <template v-if="formData.creativeStatus === 0 || formData.creativeStatus === 2">
              保存并关闭
            </template>
            <template v-else>
              下一步
            </template>
          </el-button>
        </div>

        <div v-else class="mid-between">
          <router-link to="/putManage?active=project">
            <el-button style="width: 120px" plain>取消</el-button>
          </router-link>
          <el-button
            :disabled="deviceNumber === 0 || !validataForm() || buildingDirection.estimatePrice > userInfo.accountBalance" :loading="formData.confirming"
            @click="confirmProject" style="width: 120px" type="primary">确认投放
          </el-button>
        </div>
      </div>


    </div>

    <!-- 地图选点 -->
    <div class="my-dialog" :class="{'show': buildingDirection.mapChooseShow}">
      <div class="inner-box" :class="{'show': buildingDirection.mapInnerShow}">
        <map-choose-window ref="mapDialog" @hideMapPoint="hideMapPoint"
            @submitSelectedBuildPoint="submitSelectedBuildPoint">
        </map-choose-window>
      </div>
    </div>

  </div>
</template>

<script>
  import PutMangeCard from '../../../../templates/PutMangeCard'
  import ScreenType from '../../../../templates/ScreenType'
  import Industry from '../../../../templates/Industry'
  import MyRadio from '@/components/MyRadio'
  import BuildList from '@/views/putManage/templates/BuildList'
  import mapChooseWindow from './mapChooseWindow'
  import { projectConst } from '@/utils/static'
  import { getUserInfo } from '@/utils/auth';
  import { mapGetters, mapMutations } from 'vuex'

  export default {
    components: {
      PutMangeCard,
      ScreenType,
      Industry,
      MyRadio,
      BuildList,
      mapChooseWindow,
    },

    data() {
      let validateTime = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请设置投放日期!'));
        }
        if (this.formData.projectType.value === 0 && this.formData.date) {
          let _dateBegin = new Date(this.formData.date[0]);
          let _dateEnd = new Date(this.formData.date[1]);
          if (_dateBegin.getDay() !== 6 || _dateEnd.getDay() !== 5 || _dateBegin === _dateEnd) {
            callback(new Error('按周投放的开始日期必须是周六, 结束日期必须为周五, 请正确输入!'));
          }
        }
        callback()
      }
      return {
        closeEscTrue:false,
        projectConst,

        screenPlaceholder: {
          top: require('../../../../../../assets/images/bg_shang.png'),
          bottom: require('../../../../../../assets/images/bg_xia.png')
        },

        // 所属计划的信息
        planData: {
          loading: true,
          data: ''
        },

        projectDetail: '',

        // 城市列表
        cityList: {
          loading: true,
          data: []
        },

        // 投放行业
        industry: {
          loading: false,
          data: '',
          props: {
            value: 'industryId',
            label: 'name',
            expandTrigger: 'hover',
            emitPath: false
          }
        },

        userInfo: '',

        // 楼盘定向
        buildingDirection: {
          activeType: 'exist',
          mapChooseShow: false,
          mapInnerShow: false,
          uploadBuildsFile: '',
          templateFileDownloading: false, // 导入楼盘数据->下载中
          estimatePrice: 0,
          // 城市洞察包列表
          cityInsight: {
            loading: true,
            data: '',
            selectedItem: ''
          },
          // 楼盘余量
          builds: {
            loading: false,
            hasData: false,
          },
        },

        formData: {
          name: '',
          industry: '',
          projectType: projectConst.putType[0], // 投放类型，0按周投放，1按天投放
          date: '',
          deliveryMode: projectConst.putWay[0], // 投放方式
          count: projectConst.putFrequency[0], // 投放频次
          second: projectConst.putDuration[2], // 投放时长
          type: projectConst.screenType[0], // 屏幕类型 000、未知，001、上屏，002、下屏，003、上下屏
          projectCity: '', // 城市
          details: this.buildsDetails, // 楼盘数据
          confirming: false, // 确认方案ing
        },

        formDataRules: {
          name: [
            {required: true, message: '请输入投放方案名称!', trigger: ['blur', 'change']},
            { max: 50, message: '方案名称不超过50个字,请正确输入!'}
          ],
          industry: [
            {required: true, message: '请选择投放方案行业!', trigger: 'change'},
          ],
          date: [
            { validator: validateTime, trigger: 'blur' }
          ],
          count: [
            {required: true, message: '请选投放频次!', trigger: 'change'},
          ],
          second: [
            {required: true, message: '请选择投放时长!', trigger: 'change'},
          ],
          type: [
            {required: true, message: '请选择屏幕类型!', trigger: 'change'},
          ]
        },

      }
    },

    beforeMount() {
      this.userInfo = getUserInfo();
      if (this.isEdit) {
        this.initProjectDetailById()
      } else {
        this.setBuildsList([]) // 清空楼盘列表
        this.getPlanDetailById(+this.$route.query.planId) // 计划详情
        this.generateProjectName() // 生成名字
      }
    },

    methods: {
      ...mapMutations(['setBuildsList', 'setStatistics']),

      // 切换行业
      changeIndustry(industry) {
        this.formData.industry = industry.value;
        this.changePageData()
      },

      // 切换屏幕类型
      changeScreenType(val) {
        this.formData.type = val;
        this.changePageData()
      },

      // 隐藏地图选点
      hideMapPoint(val) {
        this.buildingDirection.mapInnerShow = val;
        setTimeout(() => {
          this.buildingDirection.mapChooseShow = val;
        }, 350);
      },


      // 获取地图返回点位
      submitSelectedBuildPoint(selectedList, city) {
        let param;
        this.formData.projectCity = city.cityCode;
        this.buildingDirection.builds.hasData = true;
        this.setBuildsList(selectedList)

        param = {
          premiseIds: this.premiseIds,
          city: city.cityCode
        }
        this.getBuildsAvalable(param)
      },

      // 删除列表联动删除地图列表
      delMapItem(item) {
        item.premisesId = item.premiseId;
        this.$refs.mapDialog.deleteItem(item)
      },


      // 根据id获取计划详情
      getPlanDetailById(planid) {
        this.$api.PutPlan.PlanDetail(planid)
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
      initProjectDetailById: async function () {
        this.industry.data = await this.getIndustryList();
        this.$api.PutProject.GetProjectDetailById(+this.$route.query.editProjectId)
            .then(res => {
              let resData = res.result;
              this.projectDetail = resData;
              this.planData.loading = false;
              this.setBuildsList(res.result.premiseVOS)
              this.formData = {
                planName: resData.campaignName,
                creativeStatus: resData.creativeStatus,
                name: resData.name,
                id: resData.id,
                industry: this.$tools.getObjectItemFromArray(this.industry.data, 'industryId', resData.industry),
                projectType: this.$tools.getObjectItemFromArray(projectConst.putType, 'value', resData.projectType), // 投放类型，0按周投放，1按天投放
                date: [resData.beginTime, resData.endTime],
                projectCity: resData.projectCity,
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
      getIndustryList: async function () {
        if (this.industry.data) return;
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


      // 清除楼盘定向列表
      clearBuildDirection() {
        this.buildingDirection.cityInsight.selectedItem = '';
        this.setBuildsList([])
        if(this.$refs.mapDialog){
          this.$refs.mapDialog.clearChoosePath();
        }
      },


      // 显示地图选点
      showMapChoose() {
        this.buildingDirection.mapChooseShow = true;
        this.buildingDirection.mapInnerShow = true;
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

      // 选择下拉已有资源包 根据洞察id获取城市洞察包详情
      getCityInsightDetail(id) {
        if (!id) return;
        this.$api.cityInsight.GetCityInsightDetailById(id)
            .then(res => {
              this.formData.projectCity = res.result.city;
              this.getBuildsAvalable(res.result)
            })
      },


      // 页面数据修改, 重新获取已有资源包的楼盘, 重新算价格
      changePageData() {
        if (!this.validataForm()) return;

        // 没选已有资源包不重新获取
        if (!!this.buildingDirection.cityInsight.selectedItem) {
          this.getCityInsightDetail(this.buildingDirection.cityInsight.selectedItem.id)
        }

        if (this.buildingDirection.builds.hasData) {
          this.estimatePrice()
        }
      },


      // 根据 城市洞察详情和筛选条件 查询楼盘余量
      getBuildsAvalable(cityInsight) {
        if (!cityInsight) return

        this.buildingDirection.builds.loading = true;

        let param = {
          beginTime: this.formData.date[0],
          endTime: this.formData.date[1],
          count: this.formData.count.value,
          deliveryMode: this.formData.deliveryMode.value,
          industry: this.formData.industry,
          premiseIds: cityInsight.premiseIds,
          projectCity: cityInsight.city,
          projectType: this.formData.projectType.value,
          second: this.formData.second.value,
          type: this.formData.type.value
        };

        this.$api.PutProject.BuildsAvailableByCityInsignt(param)
            .then(res => {
              this.setBuildsList(res.result)
              this.buildingDirection.builds.hasData = true;
              this.buildingDirection.builds.loading = false;
            })
            .catch(res => {
              this.setBuildsList([])
              this.buildingDirection.estimatePrice = 0
              this.buildingDirection.builds.hasData = false;
              this.buildingDirection.builds.loading = false;
            })
      },


      // POST根据订单信息计算预估总价
      estimatePrice: async function() {
        if (!this.validataForm()) return;

        this.buildingDirection.builds.loading = true;

        let param = {
          beginTime: this.formData.date[0],
          endTime: this.formData.date[1],
          cityCode: this.formData.projectCity,
          count: this.formData.count.value,
          deviceNum: this.deviceNumber,
          second: this.formData.second.value,
          type: this.formData.type.value
        }
        this.userInfo = await this.$tools.refreshUserInfo();
        this.$api.CityList.EstimateTotalPrice(param)
            .then(res => {
              this.buildingDirection.estimatePrice = res.result;
              this.buildingDirection.builds.loading = false;
            })
            .catch(res => {
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
          return this.$message({
                                message: '请上传正确格式的文件',
                                type: 'error'
                              });
        }

        this.buildingDirection.builds.loading = true;
        this.buildingDirection.uploadBuildsFile = file;

        param = {
          beginTime: this.formData.projectType.value === 0 ? this.formData.dateForWeekBegin : this.formData.dateForDay[0],
          endTime: this.formData.projectType.value === 0 ? this.formData.dateForWeekEnd : this.formData.dateForDay[1],
          count: this.formData.count.value,
          deliveryMode: this.formData.deliveryMode.value,
          industry: this.formData.industry,
          projectCity: this.formData.projectCity,
          projectType: this.formData.projectType.value,
          second: this.formData.second.value,
          type: this.formData.type.value,
          excelFile: this.buildingDirection.uploadBuildsFile
        };

        for (let item in param) {
          formData.append(item, param[item])
        }
        this.$api.PutProject.BuildsAvailableByImport(formData)
            .then(res => {
              this.setBuildsList(res.result)
              this.buildingDirection.builds.loading = false;
            })
            .catch(res => {
              this.setBuildsList([])
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
        for (let i = 0; i < validateForms.length; i++) {
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


      // 确认
      confirmProject() {
        let param;
        let isformValidatePass = this.validataForm();

        if (!isformValidatePass) return;

        this.planData.loading = true;
        this.formData.confirming = true;
        param = {
          name: this.formData.name,
          type: this.formData.type.value, // 屏幕类型 000、未知，001、上屏，002、下屏，003、上下屏
          industry: this.formData.industry, // 投放行业
          beginTime: this.formData.date[0],
          endTime: this.formData.date[1],
          campaignId: this.$route.query.planId, // 投放计划ID
          count: this.formData.count.value, // 投放频次，001-300次/天，002-600次/天，003-900次/天 依次类推
          deliveryMode: this.formData.deliveryMode.value, // 投放方式，001一个楼盘所有点位，002一个单元一个电梯，003一个单元一半电梯
          details: this.buildsDetails, // 楼盘列表
          projectCity: this.formData.projectCity, // 城市
          projectType: this.formData.projectType.value, // 投放类型，0按周投放，1按天投放
          second: this.formData.second.value, // 投放时长，001-5s/次，002-10s/次，003-15s/次 依次类推
          totalCost: this.buildingDirection.estimatePrice
        }

        if (this.isEdit) {
          this.$api.PutProject.EditProject({id: this.formData.id, name: this.formData.name})
              .then(res => {
                this.formData.confirming = false;
                this.planData.loading = false;
                this.$message({
                  message: '修改方案成功',
                  type: 'success'
                });
                /**
                 * 若该方式的创意状态为“未上传、审核拒绝”，按钮为【下一步】，可跳转到创建广告创意页面；
                 * 创意状态 0未审核，1审核不通过，2审核通过
                 */
                if (this.formData.creativeStatus === 0 || this.formData.creativeStatus === 2) {
                  this.$router.replace({
                    path: '/putManage',
                    query: {
                      active: 'project'
                    }
                  })
                } else {
                  if (this.projectDetail.status === 0) {
                    this.$router.replace({
                      path: '/putManage/create/creative',
                      query: {
                        projectId: this.$route.query.editProjectId,
                        createType: 'step'
                      }
                    })
                  } else {
                    this.$router.replace({
                      path: '/putManage/create/payConfirm',
                      query: {
                        projectId: this.$route.query.editProjectId,
                      }
                    })
                  }
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
                this.$message({
                  message: '创建方案成功',
                  type: 'success'
                });
                this.$router.replace({
                  path: '/putManage/create/payConfirm',
                  query: {
                    projectId: res.result.projectId,
                  }
                })
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
        'unitNum',
        'buildsDetails',
        'premiseIds'
      ]),


      // 日期限制
      pickerOptions() {
        let _this = this;
        let now = new Date();
        let onDay = 1 * 24 * 60 * 60 * 1000; // 一天毫秒数
        return {
          firstDayOfWeek: 6,
          disabledDate(date) {
            return date < now // 今天以前
                // 21点以后不能选明天
                ||  (
                      now.getDate() + 1 == date.getDate() && now.getMonth() === date.getMonth() && now.getFullYear() === date.getFullYear()
                      && now.getHours() >= 21
                    )
                  
                // 按周投放
                || _this.formData.projectType.value == 0 && date.getDay() != 5 && date.getDay() != 6 
                  ||  ( now.getDate() == date.getDate() && now.getMonth() === date.getMonth() && now.getFullYear() === date.getFullYear() // 判断今天
                          &&  ( 
                                (  date.getDay() === 5 && date.getHours() > 18 ) // 周五6以后
                                || date.getDay() === 6 // 周六
                                || date.getDay() === 0 // 周日
                              )
                      )
                
          }
        };
      },

      // 是否为编辑
      isEdit() {
        return !!this.$route.query.editProjectId;
      },

      

    },


    watch: {
      deviceNumber(val) {
        if(val) {
          this.estimatePrice()
        }
      },

      // 地图选点弹窗动画
      // 'buildingDirection.mapChooseShow': function(val) {
      //   if (val) {
      //     let offset = -10;
      //     let interval = setInterval(() => {
      //       offset += 2;
      //       this.buildingDirection.mapStyle = `margin-top: ${offset}px`;
      //     }, 10);
      //     if (offset >= 0) {
      //       clearInterval(interval)
      //     }
      //   }
      // }
    }
  }
</script>

<style scoped lang="scss">
  .put-project {
    .el-tabs__content{
      overflow: auto;
    }
    // .map-choose-dialog{
    //   top: -13%;
    //   /deep/ .el-dialog__header {
    //     display: none;
    //   }
    //   /deep/ .el-dialog__body {
    //     padding: 10px;
    //   }
    //   /deep/ .el-dialog__footer {
    //     padding: 12px 40px 20px 0;
    //   }
    // }
    .el-tabs__content {
      overflow: visible;
    }
    .el-select .el-input.is-disabled .el-input__inner {
      height: 36px !important;
    }
    .title {
      padding: 28px 0 0 40px;
      background: #fff;
    }
    position: relative;
    .el-form-item {
      margin-bottom: 0;
    }
    .width-100-p {
      width: 100%;
    }
    .form-box {
      position: relative;
      .put-form {
        margin-top: 18px;
        .week-picker-box {
          .week-item {
            width: 262px;
            float: left;
            &.end {
              .el-form-item__content {
                margin-left: 0 !important;
              }
            }
          }
          .week-center-label {
            width: 32px;
            padding-top: 30px;
          }
        }
      }
      .my_error{
          color: #F44A4A;
          font-size: 12px;
          line-height: 1;
          padding-top: 4px;
          top: 100%;
          margin-left: 125px;
      }
    }
    .estimate-box {
      position: fixed;
      top: 18vh;
      right: 60px;
      padding: 20px 23px 30px;
      z-index: 3;
      width: 312px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(229, 231, 233, 1);
      box-shadow: 0px 4px 16px 0px rgba(118, 118, 118, 0.16);
      .msg-box {
        margin-top: 20px;
        > .item {
          margin-bottom: 14px;
          .name {
            display: inline-block;
            width: 78px;
          }
        }
      }
      .money-box {
        margin-top: 20px;
        .item {
          margin-bottom: 20px;
        }
      }
      .project-name {
        margin-top: 13px;
      }
      .save-box {
        margin-top: 30px;
      }
    }
    .my-dialog{
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      padding: 20px;
      background: rgba(0, 0, 0, 0.301);
      z-index: -1;
      &.show{
        z-index: 2000;
      }
      .inner-box{
        border-radius: 2px;
        background: #fff;
        padding: 10px;
        transition: 0.3s;
        margin-top: -30px;
        transform: translateY(0px); 
        opacity: 0;
        &.show{
          transform: translateY(30px); 
          opacity: 1;
        }
      }
    }
  }
</style>