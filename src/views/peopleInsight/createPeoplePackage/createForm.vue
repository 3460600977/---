<template>
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
</template>

<script>
  export default {
    name: "createForm",
    data() {
      return {
        rules: {
          name: [
            {required: true, message: '请输入人群包名称', trigger: 'blur'}
          ],
        },
        form: {
          name: '',
          text: ''
        },
      }
    },
    methods: {
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
    }
  }
</script>

<style scoped lang='scss'>
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
</style>
