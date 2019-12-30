<template>
  <div class="form">
    <el-form label-position="top" :model="form" :rules="rules" ref="ruleForm">
      <el-form-item label="资源包名称：" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="资源包描述：" style="margin-bottom: 20px">
        <el-input type="textarea" v-model="form.text"></el-input>
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
    .el-input {
      width: 100%;
    }
    .el-button {
      width: 100px;
    }
    & /deep/ .el-textarea__inner {
      width: 100%;
      height:90px;
    }
    & /deep/ .el-form-item {
      margin-bottom: 10px;
    }
  }
</style>
