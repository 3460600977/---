<template>
  <div class="put-goal">
    <!-- HI, 请选择投放目的 -->
    <PutMangeCard :title="'HI, 请选择投放目的'" class="form-box put-goal">
      <!-- 目的 -->
      <ul class="goal-box clearfix">
        <li class="item mid-center"
          @click="goal.activeIndex = index"
          :class="{'active': goal.activeIndex === index}"
          v-for="(item, index) in goal.content"
          :key="index">
          <img class="icon-img" width="78px" height="66px" :src="item.icon">
          <p class="name">{{item.name}}</p>
        </li>
      </ul>

      <el-form
        ref="creativeForm"
        :label-position="'left'"
        :model="formData"
        :rules="formDataRules" 
        label-width="112px" class="put-form">

        <el-form-item prop="budget" label="总预算">
          <MyRadio
            v-for="(item, index) in budget.content"
            @click.native="switchBudget(index)"
            :active="budget.activeIndex === index"
            :key="index"
            v-model="formData.budget.type">{{item.name}}</MyRadio>

          <el-input 
            class="budget-value"
            v-if="formData.budget.type === 'assign'" 
            placeholder="请输入内容" 
            v-model="formData.budget.value">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        
        <el-form-item prop="name" label="广告创意行业">
          <el-select v-model="formData.putCity" placeholder="请选择">
            <el-option
              v-for="(item, index) in city"
              :key="index"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item prop="name" label="投放时间">
          <el-date-picker
            v-model="formData.putDate"
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
        ref="creativeFormName"
        :model="formData"
        :rules="formDataRules"
        :label-position="'left'" 
        label-width="112px" class="put-form">
        <el-form-item prop="name" label="投放计划名称">
          <el-input v-model="formData.name" placeholder="请输入名称"></el-input>
        </el-form-item>
      </el-form>
    </PutMangeCard>

    <!-- 保存 取消 -->
    <PutMangeCard class="save-box">
      <div class="float-right">
        <el-button @click="saveCreative" type="primary">下一步</el-button>
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
    return {
      // 投放目的
      goal: {
        activeIndex: 0,
        content:[
          { name: '品牌宣传', icon: require('../../../../../../assets/images/test.png')},
          { name: '新品上线', icon: require('../../../../../../assets/images/test.png')},
          { name: '活动宣传', icon: require('../../../../../../assets/images/test.png')}
        ]
      },

      // 预算
      budget: {
        activeIndex: 0,
        content: [
          { name: '不限', value: 'unlimited' },
          { name: '指定预算', value: 'assign' }
        ]
      },

      // 城市
      city: [
        { name: '北京', code: 123},
        { name: '上海', code: 45},
        { name: '广州', code: 654},
        { name: '深圳', code: 675}
      ],

      formData: {
        name: '',
        budget: {
          type: 'assign',
          value: ''
        },
        putCity: '',
        putDate: '',
        goal: '品牌宣传'
      },
      
      formDataRules: {
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
    // 切换预算
    switchBudget(index) {
      console.log(index)
      this.budget.activeIndex = index;
    },
    // 保存
    saveCreative() {
      let isPassEnptyCheck = true;
      let validateForms = ['creativeFormMaterialTop', 'creativeFormMaterialBottom880', 'creativeFormMaterialBottom720', 'creativeFormName'];
      
      validateForms.forEach((item, index) => {
        if(this.$refs[item]) {
          this.$refs[item].validate((valid) => {
            if (!valid) { isPassEnptyCheck = false; } 
          });
        }
      })
      if (!isPassEnptyCheck) {
        return this.$message.warning('还有必填字段未填写!')
      }

      alert('上传成功')
    },

  },
}
</script>

<style lang="scss" scoped>
.put-goal{
  position: relative;
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
      margin: 30px 40px 0 0;
      width:200px;
      height:100px;
      background:rgba(255,255,255,1);
      box-shadow:0px 2px 12px 0px rgba(118,118,118,0.2);
      border-radius:2px;
      transition: .3s;
      cursor: pointer;
      color: $color-text-1;
      transition: .3s;
      &:hover{
        transform: translateY(-3px);
      }
      &.active{
        color: $color-main;
        .icon-img{
          opacity: 1;
        }
      }
      .icon-img{
        transition: .3s;
        opacity: 0.4;
      }
      .name{
        margin-left: 8px;
        font-size:16px;
        font-weight:bold;
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