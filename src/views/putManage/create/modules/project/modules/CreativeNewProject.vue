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
              v-for="(item, index) in 2"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 投放类型 -->
        <el-form-item class="mt-20" prop="type" label="投放类型">
          <div class="mid-between" style="width: 240px">
            <el-button 
              @click="switchMediaType(index)"
              v-for="(item, index) in putType.values" 
              :type="index == putType.activeIndex ? 'primary' : 'info'" 
              :key="index">
              {{item.name}}
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
            v-for="(item, index) in putWay.values"
            @click.native="switchBudget(index, item.value)"
            :active="putWay.activeIndex === index"
            :key="index">{{item.name}}</MyRadio>
        </el-form-item>

        <!-- 投放频次 -->
        <el-form-item class="mt-20" prop="frequency" label="投放频次">
          <el-select v-model="formData.putCity" placeholder="请选择">
            <el-option
              v-for="(item, index) in 10"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 投放时长 -->
        <el-form-item class="mt-20" prop="duration" label="投放时长">
          <el-select v-model="formData.putCity" placeholder="请选择">
            <el-option
              v-for="(item, index) in 10"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        
        <!-- 屏幕类型 -->
        <el-form-item class="mt-20" prop="screenType" label="屏幕类型">
          <el-select v-model="formData.putCity" placeholder="请选择">
            <el-option
              v-for="(item, index) in 10"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
        
    </PutMangeCard>

    
    <!-- 楼盘定向 -->
    <PutMangeCard :title="'楼盘定向'" class="form-box">
      <el-tabs class="thin-tab mt-15" v-model="activeBuildingDirection">
        <el-tab-pane label="新建楼盘定向"   name="create">
          <div style="margin-top: 5px;">
            <label class="color-text-1" for="">选点方式</label>
            <el-button type="primary" style="margin-left: 64px">地图选点</el-button>
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
          <el-input v-model.trim="formData.name" placeholder="请输入名称"></el-input>
        </el-form-item>
      </el-form>
    </PutMangeCard>

    <!-- 保存 取消 -->
    <PutMangeCard class="save-box">
      <div class="float-right">
        <el-button @click="savePlan" plain>取消</el-button>
        <el-button @click="savePlan" type="primary">确定</el-button>
      </div>
    </PutMangeCard>
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

      // 楼盘定向
      activeBuildingDirection: 'create',

      formData: {
        name: '',
        industry: '',
        type: '',
        date:'',
        way: '',
        frequency:'',
        duration: '',
        screenType:'',
        buildingDirection: '',
      },

      formDataRules: {},
      
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
    switchBudget(index, type) {
      console.log(index)
      this.budget.activeIndex = index;
      this.formData.budget.type = type;
    },
    // 保存
    savePlan() {
      let isPassEnptyCheck = true;
      let validateForms = ['planTop', 'planName'];
      
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