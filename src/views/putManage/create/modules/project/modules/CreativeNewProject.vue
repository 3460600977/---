<template>
  <div class="put-project">
    <div class="title">
      <h2>所属投放计划：{{planData.planName || '正在加载中...'}}</h2>
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
        <el-form-item class="mt-20" prop="industry" label="投放方案行业">
          <el-select 
            @focus="getIndustryList"
            :loading="industry.loading"
            filterable
            clearable
            v-model="formData.industry" 
            placeholder="请选择">
            <el-option
              v-for="(item, index) in industry.data"
              :key="index"
              :label="item.name"
              :value="item.industryId">
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 投放类型 -->
        <el-form-item class="mt-20" prop="projectType" label="投放类型">
          <div class="mid-between" style="width: 240px">
            <el-button 
              style="width: 102px"
              @click="putType.activeIndex=index;
                      putType.activeType=type.value;
                      formData.projectType=type.value;
                      formData.dateForDay='';
                      formData.dateForWeekBegin='';
                      formData.dateForWeekEnd='';
                      "
              v-for="(type, index) in putType.values" 
              :type="index == putType.activeIndex ? 'primary' : 'info'" 
              :key="index">
              {{type.name}}
            </el-button>
          </div>
        </el-form-item>
        
        <!----- 
          投放时间 
        ----->
        <!-- 按天投放 -->
        <el-form-item v-show="formData.projectType === 1" class="mt-20" prop="dateForDay" label="投放时间">
          <el-date-picker
            v-model="formData.dateForDay"
            value-format="yyyy-MM-dd"
            type="daterange"
            :picker-options="pickerOptionsForDay"
            range-separator="至">
          </el-date-picker>
        </el-form-item>

        <!-- 按周投放 -->
        <div v-show="formData.projectType === 0" class="week-picker-box clearfix">
          <el-form-item class="week-item mt-20" prop="dateForWeekBegin" label="投放时间">
            <el-date-picker
              @change="chooseWeek"
              value-format="yyyy-MM-dd"
              style="width: 150px"
              v-model="formData.dateForWeekBegin"
              type="date"
              :picker-options="pickerOptionsForWeekBegin">
            </el-date-picker>
          </el-form-item>

          <label class="float-left week-center-label center">至</label>
          <el-form-item class="week-item end mt-20" prop="dateForWeekEnd">
            <el-date-picker
              @change="chooseWeek"
              value-format="yyyy-MM-dd"
              style="width: 170px"
              v-model="formData.dateForWeekEnd"
              type="date"
              :picker-options="pickerOptionsForWeekEnd">
            </el-date-picker>
          </el-form-item>
        </div>

        <!-- 投放方式 -->
        <el-form-item class="mt-20" prop="deliveryMode" label="投放方式">
          <MyRadio
            v-for="(way, index) in putWay.values"
            @click.native="formData.deliveryMode=way.value; putWay.activeIndex=index"
            :active="putWay.activeIndex === index"
            :key="index">{{way.name}}</MyRadio>
        </el-form-item>

        <!-- 投放频次 -->
        <el-form-item class="mt-20" prop="count" label="投放频次">
          <el-select v-model="formData.count" placeholder="请选择">
            <el-option
              v-for="(frequency, index) in putFrequency"
              :key="index"
              :label="frequency.name"
              :value="frequency.value">
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 投放时长 -->
        <el-form-item class="mt-20" prop="second" label="投放时长">
          <el-select v-model="formData.second" placeholder="请选择">
            <el-option
              v-for="(duration, index) in putDuration"
              :key="index"
              :label="duration.name"
              :value="duration.value">
            </el-option>
          </el-select>
        </el-form-item>
        
        <!-- 屏幕类型 -->
        <el-form-item class="screen-type-preview-box mt-20" prop=" type" label="屏幕类型">
          <div class="screen-type-preview-content">
            <MyRadio
              v-for="(item, index) in screenType.values"
              @click.native="screenType.activeIndex = index; screenType.activeValue = item.value"
              :active="screenType.activeIndex === index"
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
      </el-form>
        
    </PutMangeCard>

    
    <!-- 楼盘定向 -->
    <PutMangeCard :title="'楼盘定向'" class="form-box">
      <el-tabs class="thin-tab mt-15" v-model="buildingDirection.activeType">
        <el-tab-pane label="新建楼盘定向"   name="create">
          <div style="margin-top: 5px;">
            <label class="color-text-1" for="">选点方式</label>
            <el-button @click="showMapChoose" type="primary" style="margin-left: 64px;width: 102px">地图选点</el-button>
            <SelectedList/>
          </div>
        </el-tab-pane>
        <el-tab-pane label="选择已有定向包" name="exist">选择已有定向包</el-tab-pane>
        <el-tab-pane label="导入楼盘数据"   name="import">导入楼盘数据</el-tab-pane>
      </el-tabs>
    </PutMangeCard>

    <!-- 地图选点 -->
    <mapChooseWindow :mapChooseShow.sync="buildingDirection.mapChooseShow"/>
    
    <!-- 投放方案名称 -->
    <PutMangeCard :title="'投放方案名称'" class="form-box">
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

    <!-- 确认投放方案信息 -->
    <confirmWindow :confirmMsgShow.sync ="confirmMsg.show"/>

    <!-- 保存 取消 -->
    <PutMangeCard class="save-box">
      <div class="float-right">
        <el-button style="width: 136px" plain>取消</el-button>
        <el-button @click="saveProject" style="width: 136px" type="primary">确定</el-button>
      </div>
    </PutMangeCard>

    <EstimateBox/>
  </div>
</template>

<script>
import PutMangeCard from '../../../../templates/PutMangeCard' 
import MyRadio from '../../../../../../components/MyRadio' 
import SelectedList from './SelectedList' 
import mapChooseWindow from './mapChooseWindow' 
import confirmWindow from './confirmWindow' 
import EstimateBox from './EstimateBox' 

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
    return {
      // 所属计划的信息
      planData: {},

      // 投放行业
      industry: {
        loading: false,
        data: ''
      },

      // 投放类型，0按周投放，1按天投放
      putType: {
        activeIndex: 0,
        activeType: 0,
        values: [
          { name: '按周投放', value: 0},
          { name: '按天投放', value: 1},
        ]
      },

      // 投放方式
      putWay: {
        activeIndex: 0,
        values: [
          { name: '一个楼盘所有点位', value: '001' },
          { name: '一个单元一个电梯', value: '002' },
          { name: '一个单元一半电梯', value: '003' }
        ]
      },

      // 投放频次，001-300次/天，002-600次/天，003-900次/天 依次类推
      putFrequency: [
        { name: '300 次/天', value: '001' },
        { name: '600 次/天', value: '002' },
        { name: '900 次/天', value: '003' },
      ],

      // 投放时长，001-5s/次，002-10s/次，003-15s/次 依次类推
      putDuration: [
        { name: ' 5 秒/次', value: '001' },
        { name: '10 秒/次', value: '002' },
        { name: '15 秒/次', value: '003' },
      ],

      // 屏幕类型 000、未知，001、上屏，002、下屏，003、上下屏
      screenType: {
        activeIndex: 0,
        activeValue: 'both',
        values: [
          { name: '联动', value: '003' },
          { name: '上屏', value: '001' },
          { name: '下屏', value: '002' },
        ]
      },

      // 楼盘定向
      buildingDirection: {
        activeType: 'create',
        mapChooseShow: false,
        buildingData: {}
      },

      // 确认信息
      confirmMsg: {
        show: true,
      },

      formData: {
        name: '',
        industry: '',
        projectType: 0, // 投放类型，0按周投放，1按天投放
        dateForDay:'',
        dateForWeekBegin:'',
        dateForWeekEnd:'',
        deliveryMode: '001', // 投放方式
        count:'', // 投放频次
        second: '', // 投放时长
        type:'003', // 屏幕类型 000、未知，001、上屏，002、下屏，003、上下屏
        projectCity: '', // 投放类型，0按周投放，1按天投放
        buildingDirection: '',
      },

      formDataRules: {
        name: [
          { required: true, message: '请输入投放方案名称!', trigger: 'blur' },
        ],
        industry: [
          { required: true, message: '请选择投放方案行业!', trigger: 'blur' },
        ],
        projectType: [
          { required: true, message: '请设置投放类型!', trigger: 'blur' },
        ],
        dateForDay:[
          { required: true, message: '请设置投放时间!', trigger: 'blur' },
        ],
        dateForWeekBegin:[
          { required: true, message: '请设置投放开始时间!', trigger: 'blur' },
        ],
        dateForWeekEnd:[
          { required: true, message: '请设置投放结束时间!', trigger: 'blur' },
        ],
        deliveryMode: [
          { required: true, message: '请设置投放方式!', trigger: 'blur' },
        ],
        count:[
          { required: true, message: '请选投放频次!', trigger: 'blur' },
        ],
        second: [
          { required: true, message: '请选择投放时长!', trigger: 'blur' },
        ],
         type:[
          { required: true, message: '请选择屏幕类型!', trigger: 'blur' },
        ]
      },
      
    }
  },

  beforeMount() {
    this.generateProjectName()
    this.planData = this.$route.query;
  },

  methods: {
    // 生成方案名字
    generateProjectName() {
      let date = new Date();
      this.formData.name = `投放方案_成都_${date.getMonth()+1}_${date.getDate()}`
    },

    // 行业列表
    getIndustryList() {
      if (this.industry.data) return;
      this.industry.loading = true;
      this.$api.industryList.AllList()
        .then(res => {
          this.industry.loading = false;
          this.industry.data = res.result;
        })
        .catch(res => {
          this.industry.loading = false;
        })
    },

    // 显示地图选点
    showMapChoose() {
      this.buildingDirection.mapChooseShow = true;
    },

    // 按周投放 可用周六开始时间戳
    getLaunchWeek() {
      let date = new Date(+this.planData.beginTime > Date.now() ? +this.planData.beginTime : Date.now()); // 开始时间 毫秒
      let nowWeek = 6 - date.getDay();
      let dayMilliSecond = 24 * 60 * 60 * 1000; //一天的毫秒数
      let offsetWeek = 0; // 判断是否过期，是否往后延期一个星期

      if (nowWeek <= 1 || date.getHours() > 18) {
        offsetWeek = 1;
      }

      let saturdayBegin = (date.getTime() + (nowWeek + ((offsetWeek) * 7)) * dayMilliSecond); //周六开始
      let saturdayEnd; //周五结束
      for (let i=0; i<10000; i++) {
        saturdayEnd = (date.getTime() + (nowWeek + 6 + ((offsetWeek) * 7) + (i * 7)) * dayMilliSecond); 
        if (saturdayEnd > +this.planData.endTime) {
          saturdayEnd = (date.getTime() + (nowWeek + 6 + ((offsetWeek) * 7) + (--i * 7)) * dayMilliSecond);
          break;
        }
      }

      return {
        saturdayBegin, saturdayEnd
      }
    },

    // 按周投放 选择时间校验结束大于开始
    chooseWeek() {
      if (!this.formData.dateForWeekBegin || !this.formData.dateForWeekEnd) return;
      if (this.formData.dateForWeekBegin >= this.formData.dateForWeekEnd) {
        this.formData.dateForWeekBegin = '';
        return this.$notify({
          title: '警告',
          message: '开始时间应早于结束时间',
          type: 'warning'
        });
      }
    },

    // 保存
    saveProject() {
      let isPassEnptyCheck = true;
      let validateForms = ['planTop', 'planName'];
      console.log(this.formData)
      console.log(this.formData.date)
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
      // this.$router.replace('/putManage/create/creative')
    },
  },

  computed: {
    // 限制时间选择器 按天 投放选择范围
    pickerOptionsForDay() {
      let _this = this;
      return {
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
          return date.getTime() < _this.getLaunchWeek().saturdayBegin || 
           date.getTime() > _this.getLaunchWeek().saturdayEnd || 
           date.getDay() != 6;
        },
      };
    },

    pickerOptionsForWeekEnd() {
      let _this = this;
      return {
        firstDayOfWeek: 6,
        disabledDate(date) {
          return date.getTime() < _this.getLaunchWeek().saturdayBegin || 
           date.getTime() > _this.getLaunchWeek().saturdayEnd || 
           date.getDay() != 5 ||
           date.getTime() < (new Date(_this.formData.dateForWeekBegin)).getTime();
        },
      };
    }
  }
}
</script>

<style lang="scss">
.put-project{
  .title{
    padding: 28px 0 0 40px;
    background: #fff;
  }
  position: relative;
  .mt-20{
    margin-top: 20px !important;
  }
  .mt-12{
    margin-top: 12px !important;
  }
  .mt-15{
    margin-top: 15px;
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
    .put-form{
      margin-top: 18px;
      .screen-type-preview-box{
        overflow: hidden;
        .screen-type-preview-content{
          margin-top: -100px;
          .screen-preview {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-left: 10px;
            margin-top: 100px;
            width:78px;
            height:180px;
            background:rgba(255,255,255,1);
            border:1px solid rgba(229,231,233,1);
            .bg-gray{
              background:rgba(249,250,255,1) !important;
            }
            .top{
              width:76px;
              height:139px;
              background:rgba(255,255,255,1);
            }
            .bottom{
              width:76px;
              height:44px;
              background:rgba(255,255,255,1);
              border-top:1px solid rgba(229,231,233,1);
            }
          }
        }
      }
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