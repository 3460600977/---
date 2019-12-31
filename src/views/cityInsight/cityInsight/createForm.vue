<template>
  <div class="form">
    <el-form label-position="top" :model="form" :rules="rules" ref="ruleForm">
      <el-form-item label="资源包名称：" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="资源包描述：" style="margin-bottom: 20px">
        <el-input type="textarea" v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item class="text-center">
          <el-button @click="hide" class="btn">取消</el-button>
          <el-button type="primary" @click="" class="btn" @click="submitForm('ruleForm')">确认</el-button>
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
          description: ''
        },
      }
    },
    methods: {
      resetForm() {
        this.form = {
          name: '',
          description: ''
        }
      },
      hide() {
        this.$emit('hide')
      },
      submitForm(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.$emit('submit', this.form)
            this.resetForm()
          } else {
            return false;
          }
        });
      },
    }
  }
</script>

<style scoped lang='scss'>
  .form {
    padding-bottom: 30px;
    .el-input {
      width: 100%;
    }
    .btn {
      width: 136px;
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
