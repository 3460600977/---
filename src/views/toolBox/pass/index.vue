<template>
  <div class="edit-pass">
    <h3 class="editPassTitle">修改密码</h3>
    <el-form style="width: 490px" ref="editForm" :model="editForm" class="editForm" label-position="left"
             label-width="110px">
      <el-form-item required label="原密码">
        <el-input v-model="editForm.originalPass" show-password placeholder="请输入原密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码" class="new-pass">
        <el-input v-model="editForm.newPass" show-password placeholder="请输入新密码"></el-input>
        <span class="show-validate-message">* 8-18位，必须包含大写字母、小写字母、数字和符号四种形式</span>
      </el-form-item>
      <el-form-item required label="新密码确认">
        <el-input v-model="editForm.confirmPass" show-password placeholder="请再次输入新密码"></el-input>
      </el-form-item>
      <el-form-item class="submit-login">
        <el-button @click="resetForm">取 消</el-button>
        <el-button type="primary" @click="submitConfirm">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
    export default {
        name: "editPassIndex",
        data() {
            return {
                editForm: {
                    originalPass: '',
                    newPass: '',
                    confirmPass: ''
                },
            }
        },
        methods: {
            resetForm() {

            },
            submitConfirm() {

            }
        }
    }
</script>

<style lang="scss">
  .edit-pass {
    position: relative;
    top: 15%;
    margin: auto;
    width: 780px;
    background: $color-bg-3;
    box-shadow: 0px 4px 16px 0px $color-shadow-5;
    border-radius: 8px;

    .editPassTitle {
      font-size: 16px;
      font-weight: bold;
      color: $color-text;
      padding: 30px 0 0 30px;
    }

    .editForm {
      margin: 49px auto 0 auto;

      .el-form-item__label {
        font-size: 14px;
        font-weight: 400;
      }

      .el-input {
        width: 380px;
        height: 36px;
        border-radius: 2px;
      }

      .el-input__inner {
        border-radius: 2px;
      }

      .submit-login {
        margin-top: 60px;
        padding-bottom: 45px;
      }

      .el-button {
        width: 100px;
        height: 34px;
      }

      .el-button--default {
        margin-right: 30px;
      }

      .el-button--primary {
        margin-left: 30px;
      }

      .el-form-item {
        margin-bottom: 40px;
      }

      .new-pass {
        margin-bottom: 20px;
      }

      .show-validate-message {
        font-size: 12px;
        font-weight: 400;
        color: $color-text-1;
      }
    }
  }
</style>
