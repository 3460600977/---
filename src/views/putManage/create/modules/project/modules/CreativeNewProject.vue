<template>
  <div class="put-project">
    <div class="title">
      <h2>所属投放计划：投放计划名称</h2>
    </div>

    <!-- 投放设置 -->
    <PutMangeCard :title="'投放设置'" class="form-box put-goal">
      <el-form
        ref="planTop"
        :label-position="'left'"
        :model="formData"
        :rules="formDataRules" 
        label-width="112px" class="put-form">

        <!-- 投放方案行业 -->
        <el-form-item class="mt-20" prop="industry" label="投放方案行业">
          <el-select v-model="formData.industry" placeholder="请选择">
            <el-option
              v-for="(item, index) in industry"
              :key="index"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 投放类型 -->
        <el-form-item class="mt-20" prop="type" label="投放类型">
          <div class="mid-between" style="width: 240px">
            <el-button 
              style="width: 102px"
              @click="putType.activeIndex=index;
                      putType.activeType=type.value;
                      formData.type=type.value;"
              v-for="(type, index) in putType.values" 
              :type="index == putType.activeIndex ? 'primary' : 'info'" 
              :key="index">
              {{type.name}}
            </el-button>
          </div>
        </el-form-item>
        
        <!-- 投放时间 -->
        <el-form-item class="mt-20" prop="date" label="投放时间">
          <el-date-picker
            v-model="formData.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>

        <!-- 投放方式 -->
        <el-form-item class="mt-20" prop="way" label="投放方式">
          <MyRadio
            v-for="(way, index) in putWay.values"
            @click.native="formData.way=way.value; putWay.activeIndex=index"
            :active="putWay.activeIndex === index"
            :key="index">{{way.name}}</MyRadio>
        </el-form-item>

        <!-- 投放频次 -->
        <el-form-item class="mt-20" prop="duration" label="投放频次">
          <el-select v-model="formData.frequency" placeholder="请选择">
            <el-option
              v-for="(frequency, index) in putFrequency"
              :key="index"
              :label="frequency.name"
              :value="frequency.value">
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 投放时长 -->
        <el-form-item class="mt-20" prop="duration" label="投放时长">
          <el-select v-model="formData.duration" placeholder="请选择">
            <el-option
              v-for="(duration, index) in putDuration"
              :key="index"
              :label="duration.name"
              :value="duration.value">
            </el-option>
          </el-select>
        </el-form-item>
        
        <!-- 屏幕类型 -->
        <el-form-item class="screen-type-preview-box mt-20" prop="screenType" label="屏幕类型">
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
                  :class="{'bg-gray': item.value == 'both' || item.value == 'top'}"></div>
                <div 
                  :class="{'bg-gray': item.value == 'both' || item.value == 'bottom'}" 
                  class="bottom"></div>
              </div>
            </MyRadio>
          </div>
        </el-form-item>
      </el-form>
        
    </PutMangeCard>

    
    <!-- 楼盘定向 -->
    <PutMangeCard :title="'楼盘定向'" class="form-box">
      <el-tabs class="thin-tab mt-15" v-model="activeBuildingDirection">
        <el-tab-pane label="新建楼盘定向"   name="create">
          <div style="margin-top: 5px;">
            <label class="color-text-1" for="">选点方式</label>
            <el-button type="primary" style="margin-left: 64px;width: 102px">地图选点</el-button>
            <SelectedList/>
          </div>
        </el-tab-pane>
        <el-tab-pane label="选择已有定向包" name="exist">选择已有定向包</el-tab-pane>
        <el-tab-pane label="导入楼盘数据"   name="import">导入楼盘数据</el-tab-pane>
      </el-tabs>
    </PutMangeCard>
    
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

    <!-- 保存 取消 -->
    <PutMangeCard class="save-box">
      <div class="float-right">
        <el-button style="width: 136px" plain>取消</el-button>
        <el-button @click="saveProject" style="width: 136px" type="primary">确定</el-button>
      </div>
    </PutMangeCard>

    
    <!-- 投放预估数 -->
    <div class="estimate-box">
      <div class="font16">楼盘预估数</div>
      <div class="mid-between">
        <div class="estimate-number-box">
          <p class="color-text-1 estimate-title">楼盘数</p>
          <p class="font-14 estimate-number">
            <span class="bold font-18">34563456</span>个
          </p>
        </div>
        <div class="estimate-number-box">
          <p class="color-text-1 estimate-title">设备数</p>
          <p class="font-14 estimate-number">
            <span class="bold font-18">678567</span>个
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PutMangeCard from '../../../../templates/PutMangeCard' 
import MyRadio from '../../../../../../components/MyRadio' 
import SelectedList from './SelectedList' 
export default {
  components: {
    PutMangeCard,
    MyRadio,
    SelectedList
  },
  data() {
    return {
      // 投放行业
      industry: [
        { name: '餐饮', value: 'byWeek'},
        { name: '医疗', value: 'byDay'},
      ],
      // 投放类型
      putType: {
        activeIndex: 0,
        activeType: 'byWeek',
        values: [
          { name: '按周投放', value: 'byWeek'},
          { name: '按天投放', value: 'byDay'},
        ]
      },
      // 投放方式
      putWay: {
        activeIndex: 0,
        values: [
          { name: '一个楼盘所有点位', value: 'all' },
          { name: '一个单元一个电梯', value: 'one' },
          { name: '一个单元一半电梯', value: 'half' }
        ]
      },
      // 投放频次
      putFrequency: [
        { name: '300 次/天', value: 300 },
        { name: '600 次/天', value: 600 },
        { name: '900 次/天', value: 900 },
      ],
      // 投放时长
      putDuration: [
        { name: ' 5 秒/次', value: 5000 },
        { name: '10 秒/次', value: 10000 },
        { name: '15 秒/次', value: 15000 },
      ],

      // 屏幕类型 
      screenType: {
        activeIndex: 0,
        activeValue: 'both',
        values: [
          { name: '联动', value: 'both' },
          { name: '上屏', value: 'top' },
          { name: '下屏', value: 'bottom' },
        ]
      },

      // 楼盘定向
      activeBuildingDirection: 'create',

      formData: {
        name: '',
        industry: '',
        type: 'byWeek',
        date:'',
        way: 'all',
        frequency:'',
        duration: '',
        screenType:'both',
        buildingDirection: '',
      },

      formDataRules: {
        name: [
          { required: true, message: '请输入投放方案名称!', trigger: 'blur' },
        ],
        industry: [
          { required: true, message: '请选择投放方案行业!', trigger: 'blur' },
        ],
        type: [
          { required: true, message: '请设置投放类型!', trigger: 'blur' },
        ],
        date:[
          { required: true, message: '请设置投放时间!', trigger: 'blur' },
        ],
        way: [
          { required: true, message: '请设置投放方式!', trigger: 'blur' },
        ],
        frequency:[
          { required: true, message: '请选投放频次!', trigger: 'blur' },
        ],
        duration: [
          { required: true, message: '请选择投放时长!', trigger: 'blur' },
        ],
        screenType:[
          { required: true, message: '请选择屏幕类型!', trigger: 'blur' },
        ]
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

  mounted() {
    this.generateProjectName()
  },

  methods: {
    // 生成方案名字
    generateProjectName() {
      let date = new Date();
      this.formData.name = `投放方案_成都_${date.getMonth()+1}_${date.getDate()}`
    },

    // 切换预算
    switchBudget(index, type) {
      console.log(index)
      this.budget.activeIndex = index;
      this.formData.budget.type = type;
    },

    // 保存
    saveProject() {
      let isPassEnptyCheck = true;
      let validateForms = ['planTop', 'planName'];
      
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
      this.$router.push('/putManage/create/creative')
    },
  },
}
</script>

<style lang="scss" scoped>
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
    }
  }
  .save-box{
    margin-top: 40px !important;
  }
  .estimate-box{
    position: fixed;
    top: 20vh;
    right: 60px;
    padding: 20px 20px 25px;
    z-index: 10;
    width:312px;
    height:460px;
    background:rgba(255,255,255,1);
    border:1px solid rgba(229,231,233,1);
    box-shadow:0px 4px 16px 0px rgba(118,118,118,0.16);
    .estimate-number-box{
      &+.estimate-number-box{
        left: 175px;
      }
      position: absolute;
      margin-top: 55px;
      .estimate-number{
        margin-top: 6px;
      }
    }
  }
}
</style>