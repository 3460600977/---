<template>
  <div class="put-plan" v-loading="edit.loading">
    <!-- HI, 请选择投放目的 -->
    <PutMangeCard :title="'HI, 请选择投放目的'" class="form-box put-goal">
      <!-- 目的 -->
      <ul class="goal-box clearfix">
        <li class="item mid"
          @click="formData.goal=item.value"
          :class="{'active': item.value === formData.goal}"
          v-for="(item, index) in PutGoal"
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
            v-for="(item, index) in Budget"
            @click.native="formData.budget.type = item.value"
            :active="formData.budget.type === item.value"
            :key="index">{{item.name}}</MyRadio>

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
            value-key="cityCode"
            placeholder="请选择">
            <el-option
              v-for="(item, index) in city"
              :key="index"
              :label="item.name"
              :value="item">
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
        <el-button :loading='formData.saving' @click="savePlan" style="width: 136px" type="primary">{{edit.isEdit ? '保存并关闭' : '下一步'}}</el-button>
      </div>
    </PutMangeCard>
  </div>
</template>

<script>
import PutMangeCard from '../../../../templates/PutMangeCard' 
import { PutGoal, Budget } from '../../../../../../utils/static'
import MyRadio from '../../../../../../components/MyRadio' 
import { resolve } from 'q'
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
      PutGoal,// 投放目的
      Budget, // 预算
      edit: {
        loading: !!this.$route.query.editPlanId,
        isEdit: !!this.$route.query.editPlanId,
        planId: this.$route.query.editPlanId,
        planDetail: ''
      },

      city: '',// 所有城市

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

    }
  },

  mounted() {
    if (this.edit.isEdit) {
      this.editInit();
    } else {
      this.formData.goal = this.PutGoal[0].value;
    }
  },

  methods: {
    // 获取城市列表
    getCityList: async function() {
      if (this.city) return;
      return new Promise((resolve, reject) => {
        this.$api.CityList.AllList()
          .then(res => {
            this.city = res.result;
            resolve(res.result)
          })
          .catch(res => {
            this.city = [];
          })
      })
    },

    // 编辑回显数据
    editInit: async function() {
      this.city = await this.getCityList();
      this.edit.planDetail = await this.getPlanDetailById(this.edit.planId);
      this.edit.loading = false;
      this.formData.goal = this.edit.planDetail.campaignType;
      this.formData.name = this.edit.planDetail.name;
      this.formData.putCity = this.edit.planDetail.cityList;
      this.formData.putDate = [
        this.$tools.getFormatDate('YY-mm-dd', this.edit.planDetail.beginTime), 
        this.$tools.getFormatDate('YY-mm-dd', this.edit.planDetail.endTime)
      ];
      this.formData.budget = {
        type: this.edit.planDetail.budgetType,
        value: this.edit.planDetail.totalBudget / 100
      }
    },

    // 获取计划详情
    getPlanDetailById: async function(planId) {
      return new Promise((resolve, reject) => {
        this.$api.PutPlan.PlanDetail(planId)
          .then(res => {
            resolve(res.result)
          })
          .catch(res => {
            this.edit.loading = false;
          })
      }) 
      
    },
    // 下一步/保存并关闭
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
        totalBudget: this.formData.budget.value * 100,
        cityList: this.formData.putCity,
        beginTime: this.formData.putDate[0],
        endTime: this.formData.putDate[1]
      };

      // 编辑
      if (this.edit.isEdit) {
        param.id = this.$route.query.editPlanId;
        this.$api.PutPlan.EditPlan(param)
          .then(res => {
            this.formData.saving = false;
            this.$notify({
              title: '成功',
              message: '修改投放计划成功',
              type: 'success'
            });
            this.$router.push({
              path: '/putManage',
            })
          })
          .catch(res => {
            this.formData.saving = false;
          })
      } 
      // 新建
      else {
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
              }
            })
          })
          .catch(res => {
            this.formData.saving = false;
          })
      }
    },


  },

  watch: {
    // 生成名字
    'formData.goal': function() {
      if (this.edit.isEdit) return;
      let date = new Date();
      this.formData.name = `${this.$tools.getObjectItemFromArray(PutGoal, 'value', this.formData.goal).name}_${date.getMonth()+1}_${date.getDate()}`
    },
  },

  computed: {
    pickerOptions() {
      let _this = this;
      return {
        disabledDate(date) {
          if (_this.edit.isEdit) {
            return false;
          }
          return date.getTime() < Date.now() - 8.64e7;
        }
      }
    }
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