<template>
  <div class="container mid-column">
    <div class="flex1 clearfix">
      <div class="left-container float-left mid-column">
        <p class="title bold">创建人群包</p>
        <div class="flex1 mid-row">
          <div class="left-tab">
            <left-tab
              :tabData="tabData"
              :activeTab="activeTab"
              @changeTab="changeTab"
            ></left-tab>
          </div>
          <div class="left-content">
            <demographic-attr></demographic-attr>
<!--            <location-attr></location-attr>-->
<!--            <hobby></hobby>-->
<!--            <industry-consume></industry-consume>-->
          </div>
        </div>
      </div>
      <div class="right-container float-left">
        <p class="title bold">已选条件</p>
        <div class="condition">
          <conditions :data="conditions"></conditions>
        </div>
        <div class="form">
          <el-form label-position="top" :model="form" :rules="rules" ref="ruleForm">
            <el-form-item label="人群包名称：" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="人群包描述：" style="margin-bottom: 30px">
              <el-input type="textarea" v-model="form.text"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="cancle('ruleForm')">取消</el-button>
              <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="flex-shrink">
      <back></back>
    </div>
  </div>
</template>

<script>
  import leftTab from "./leftTab";
  import conditions from "./conditions";
  import Back from "../../../components/Back";
  import Hobby from "./Hobby";
  import locationAttr from "./locationAttr";
  import industryConsume from "./industryConsume";
  import demographicAttr from "./demographicAttr";
  export default {
    name: "createPeoplePackage",
    components: {
      leftTab,
      Back,
      Hobby,
      locationAttr,
      industryConsume,
      demographicAttr,
      conditions
    },
    data() {
      return {
        activeTab: 0,
        rules: {
          name: [
            {required: true, message: '请输入人群包名称', trigger: 'blur'}
          ],
        },
        form: {
          name: '',
          text: ''
        },
        conditions: [
          {
            title: '城市：',
            data: [
              {name: '全国', value: 0}
            ]
          }
        ],
        tabData: [
          {name: '人口属性', value: 0},
          {name: '位置属性', value: 1},
          {name: '兴趣爱好', value: 2},
          {name: '行业消费', value: 3},
        ]
      }
    },
    methods: {
      changeTab(item) {
        this.activeTab = item.value
      },
      cancle() {},
      submitForm(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    },
  }
</script>

<style scoped lang='scss'>
.container {
  padding: 1.04%;
  overflow-y: auto;
  line-height: 1.15;
  .right-container{
    background: #ffffff;
    border-radius:4px;
    margin-left: 1.06%;
    width: 34.04%;
    height: 100%;
    .condition {
      margin-top: 10px;
      border-bottom: 1px solid $color-border;
    }
    .form {
      padding: 15px 30px;
      .el-input {
        width: 260px;
      }
      .el-button {
        width: 100px;
      }
      & /deep/ .el-textarea__inner {
        width:260px;
        height:90px;
      }
      .el-button + .el-button {
        margin-left: 60px;
      }
    }
  }
  .left-container {
    background: #ffffff;
    height: 100%;
    width: 64.89%;
    border-radius:4px;
    .left-content {
      padding: 0 4.9%;
      width: 100%;
      & /deep/ .label {
        width: 119px;
      }
      & /deep/ .content {
        max-width: 420px;
      }
    }
  }
  .title {
    font-size: 16px;
    padding-left: 30px;
    line-height: 50px;
  }
  .left-tab {
    width: 200px;
    height: 100%;
  }
}
</style>
