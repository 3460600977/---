<template>
  <div class="put-plan">
    <!-- HI, 请选择投放目的 -->
    <PutMangeCard :title="'HI, 请选择投放目的'" class="form-box put-goal">
      <!-- 目的 -->
      <ul class="goal-box clearfix">
        <li class="item mid"
          @click="goal.activeIndex = index; formData.goal=item.value"
          :class="{'active': goal.activeIndex === index}"
          v-for="(item, index) in goal.content"
          :key="index">
          <img class="icon-img" width="78px" height="66px" :src="item.icon">
          <p class="name">{{item.name}}</p>
        </li>
      </ul>

      <el-form
        ref="planTop"
        :label-position="'left'"
        :model="formData"
        :rules="formDataRules" 
        label-width="112px" class="put-form">

        <el-form-item prop="budget.value">
          <label slot="label"><span class="color-red">* </span>总预算</label>
          <MyRadio
            v-for="(item, index) in budget.content"
            @click.native="switchBudget(index, item.value)"
            :active="budget.activeIndex === index"
            :key="index"
            v-model="formData.budget.type">{{item.name}}</MyRadio>

          <el-input 
            class="budget-value"
            v-if="formData.budget.type === 1" 
            placeholder="请输入内容" 
            v-model.number.trim="formData.budget.value">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        
        <el-form-item class="mt-20" prop="putCity" label="投放城市">
          <el-select 
            @focus="getCityList"
            :loading="!city" 
            multiple 
            filterable
            clearable 
            v-model="formData.putCity" 
            placeholder="请选择">
            <el-option
              v-for="(item, index) in city"
              :key="index"
              :label="item.name"
              :value="+item.cityCode">
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item class="mt-20" prop="putDate" label="投放时间">
          <el-date-picker
            v-model="formData.putDate"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
        
    </PutMangeCard>

    
    <!-- 广告创意名称 -->
    <PutMangeCard :title="'投放计划名称'" class="form-box aptitude">
      <el-form
        ref="planName"
        :model="formData"
        :rules="formDataRules"
        :label-position="'left'" 
        label-width="112px" class="put-form">
        <el-form-item prop="name" label="投放计划名称">
          <el-input v-model.trim="formData.name" clearable placeholder="请输入名称"></el-input>
        </el-form-item>
      </el-form>
    </PutMangeCard>

    <!-- 保存 取消 -->
    <PutMangeCard class="save-box">
      <div class="float-right">
        <el-button :loading='formData.saving' @click="savePlan" style="width: 136px" type="primary">下一步</el-button>
      </div>
    </PutMangeCard>
  </div>
</template>

<script>
import PutMangeCard from '../../../../templates/PutMangeCard' 
import MyRadio from '../../../../../../components/MyRadio' 
export default {
  components: {
    PutMangeCard,
    MyRadio
  },
  data() {
    // 自定义校验 预算    
    let validateBudget = (rules, value, callback) => {
      if (this.formData.budget.type == 0) {
        return callback();
      }
      if (!value) { return callback(new Error('请输入指定预算!')); }
      if (isNaN(value)) { return callback(new Error('请输入数字!')); }
      if (value <= 1000) { return callback(new Error('指定预算不少于1000元!')); }
    }
    return {
      // 投放目的
      goal: {
        activeIndex: 0,
        content:[
          { name: '品牌宣传', value: 0, icon: require('../../../../../../assets/images/plan_title_1.png')},
          { name: '新品上线', value: 1, icon: require('../../../../../../assets/images/plan_title_2.png')},
          { name: '活动宣传', value: 2, icon: require('../../../../../../assets/images/plan_title_3.png')},
          { name: '其他',     value: 3, icon: require('../../../../../../assets/images/plan_title_4.png')}
        ]
      },

      // 预算 0 不限 1 指定
      budget: {
        activeIndex: 0,
        content: [
          { name: '不限', value: 0 },
          { name: '指定预算', value: 1 }
        ]
      },

      // 城市
      city: '',

      formData: {
        name: '',
        saving: false,
        budget: {
          type: 0,
          value: ''
        },
        putCity: '',
        putDate: '',
        goal: ''
      },
      
      formDataRules: {
        name: [
          { required: true, message: '请输入计划名称!', trigger: 'blur' },
          { max: 100, message: '计划名称100字以内!'}
        ],
        putCity: [
          { required: true, message: '请选择投放城市!', trigger: 'blur' }
        ],
        putDate: [
          { required: true, message: '请选择投放时间!', trigger: 'blur' }
        ],
        'budget.value': [
          { validator: validateBudget, trigger: 'blur' }
        ],
      },

      // 广告创意行业
      creativeIndustry: [
        '餐饮',
        '餐饮2',
        '餐饮3',
        '餐饮4'
      ],

      // 日期控件限制
      pickerOptions: {
        disabledDate(date) {
          return date.getTime() < Date.now() - 8.64e7;
        },
      }
    }
  },
  mounted() {
    this.formData.goal = this.goal.content[this.goal.activeIndex].value;
  },
  methods: {
    // 切换预算
    switchBudget(index, type) {
      this.budget.activeIndex = index;
      this.formData.budget.type = type;
      this.formData.budget.value = '';
    },

    // 获取城市列表
    getCityList() {
      if (this.city) return;
      this.$api.CityList.AllList()
        .then(res => {
          this.city = res.result;
        })
        .catch(res => {
          this.city = [];
        })
    },

    // 保存
    savePlan() {
      let isPassEnptyCheck = true,
          validateForms = ['planTop', 'planName'],
          param;

      this.formData.saving = true;
      validateForms.forEach((item, index) => {
        if(this.$refs[item]) {
          this.$refs[item].validate((valid) => {
            if (!valid) { return isPassEnptyCheck = false; } 
          });
        }
      })
      if (!isPassEnptyCheck) {
        this.formData.saving = false;
        return this.$notify({
          title: '警告',
          message: '还有必填字段未填写',
          type: 'warning'
        });
      } 

      param = {
        name: this.formData.name,
        campaignType: this.formData.goal,
        budgetType: this.formData.budget.type,
        totalBudget: this.formData.budget.value,
        city: JSON.stringify(this.formData.putCity),
        beginTime: this.formData.putDate[0],
        endTime: this.formData.putDate[1]
      }

      this.$api.PutPlan.AddPlan(param)
        .then(res => {
          this.formData.saving = false;
          this.$notify({
            title: '成功',
            message: '创建投放计划成功',
            type: 'success'
          });
          this.$router.replace({
            path: '/putManage/create/project',
            query: {
              planId: res.result.id,
              planName: res.result.name,
              beginTime: res.result.beginTime,
              endTime: res.result.endTime
            }
          })
        })
        .catch(res => {
          this.formData.saving = false;
        })

      
    },


  },
  watch: {
    // 生成名字
    'formData.goal': function() {
      let date = new Date();
      this.formData.name = `${this.goal.content[this.goal.activeIndex].name}_${date.getMonth()+1}_${date.getDate()}`
    },
  },
}
</script>

<style lang="scss" scoped>
.put-plan{
  position: relative;
  .mt-20{
    margin-top: 20px !important;
  }
  .mt-12{
    margin-top: 12px !important;
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
  .goal-box{
    .item{
      float: left;
      padding: 0px 23px;
      margin: 30px 40px 0 0;
      width:200px;
      height:100px;
      background:rgba(255,255,255,1);
      border-radius:2px;
      transition: .3s;
      cursor: pointer;
      transition: .3s;
      &:hover{
        transform: translateY(-3px);
      }
      &.active{
        box-shadow: 0px 4px 10px 0px rgba(45,90,255,0.18);
        .name{
          color: $color-main;
        }
        .icon-img{
          opacity: 1;
        }
      }
      .icon-img{
        width: 53px;
        height: auto;
        transition: .3s;
        opacity: 0.4;
      }
      .name{
        margin-left: 8px;
        font-size:16px;
        font-weight:bold;
        color: #A8A8A8;
      }
    }
  }
  .form-box{
    position: relative;
    .put-form{
      margin-top: 18px;
      .budget-value{
        margin-left: -30px;
        width: 240px;
      }
    }
  }
  .save-box{
    margin-top: 40px !important;
  }
}
</style>