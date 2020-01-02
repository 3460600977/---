<template>
  <div class="edit-pass">
    <el-form style="width: 490px" ref="editForm" :model="editForm" class="editForm" label-position="left"
             label-width="110px" :rules="rules">
      <el-form-item label="原密码" prop="oldPwd">
        <el-input v-model.trim="editForm.oldPwd" show-password placeholder="请输入原密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码" :class="{'new-pass':true,'hide-mess':hideMess}" class="new-pass" prop="newPwd">
        <el-input v-model.trim="editForm.newPwd" show-password placeholder="请输入新密码"></el-input>
        <span class="show-validate-message">* 8-18位，必须包含大写字母、小写字母、数字和符号四种形式</span>
      </el-form-item>
      <el-form-item label="新密码确认" prop="confirmNewPwd">
        <el-input v-model.trim="editForm.confirmNewPwd" show-password placeholder="请再次输入新密码"></el-input>
      </el-form-item>
      <el-form-item class="submit-login">
        <el-button @click="resetForm('editForm')">取 消</el-button>
        <el-button type="primary" @click="submitConfirm('editForm')" v-loading="loading">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { Notification } from 'element-ui'
  import { removeUserInfo } from '@/utils/auth';

  export default {
    name: "editPassIndex",
    data() {
      const validatePass = (rule, value, callback) => {
        let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[1-9])(?=.*[\W])(?=.*[\S])^[0-9A-Za-z\S]{8,18}$/;
        if (value === '') {
          this.hideMess = true
          callback(new Error('请输入新密码'));
        } else if (!reg.test(value)) {
          this.hideMess = true
          callback(new Error('8-18位，必须包含大写字母、小写字母、数字和符号四种形式'));
        } else {
          this.hideMess = false
          callback();
        }
      }
      const validateConfirmPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入新密码'));
        } else if (value !== this.editForm.newPwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }
      return {
        loading: false,
        hideMess: false,
        editForm: {
          oldPwd: '',
          newPwd: '',
          confirmNewPwd: '',
        },
        rules: {
          oldPwd: [
            {required: true, message: '请输入原密码', trigger: ['blur', 'change']}
          ],
          newPwd: [
            {required: true, trigger: ['blur', 'change'], validator: validatePass},
          ],
          confirmNewPwd: [
            {
              required: true,
              trigger: ['blur', 'change'],
              validator: validateConfirmPass
            }
          ],
        }
      }
    },
    methods: {
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.$emit("changeDialogEditPass", false);
      },
      submitConfirm(formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            return false;
          } else {
            let param = {
              newPwd: this.editForm.newPwd,
              oldPwd: this.editForm.oldPwd,
              confirmNewPwd: this.editForm.confirmNewPwd,
            }
            //请求登录接口
            this.loading = true;
            this.$api.Login.ChangePass(param).then(res => {
              this.loading = false;
              Notification({
                title: '成功修改密码',
                type: 'success'
              });
              removeUserInfo()
              this.$store.commit('setToken', '')
              this.$router.replace('/login');
            }).catch(res => {
              this.loading = false;
            })
          }
        });
      }
    }
  }
</script>

<style lang="scss">
  .edit-pass-dialog {
    .el-dialog__title {
      font-size: 16px;
      font-weight: bold;
      color: $color-text;
      padding: 30px 0 0 30px;
    }
    .el-dialog__body {
      padding-top: 40px;
    }
    .edit-pass {
      width: 100%;
      height: 100%;
      background: $color-bg-3;
      box-shadow: none;
      .editForm {
        margin: 0px auto 0 auto;
        .el-form-item__label {
          height: 12px;
          font-size: 14px;
          font-weight: 400;
          color: $color-text-1;
        }
        .el-input {
          width: 380px;
          height: 36px;
          border-radius: 2px;
          margin-top: 5px;
        }
        .el-input__inner {
          border-radius: 2px;
        }
        ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
          font-size: 14px;
          font-weight: 400;
          color: $color-text;
        }
        .submit-login {
          margin-top: 60px;
          margin-bottom: 20px;
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
        .show-validate-message {
          font-size: 12px;
          font-weight: 400;
          color: $color-text-1;
          line-height: 1;
          padding-top: 8px;
          position: absolute;
          top: 100%;
          left: 0;
        }
        .el-form-item__error {
          font-size: 12px;
          font-weight: 400;
          padding-top: 8px;
        }
        .hide-mess {
          .show-validate-message {
            display: none;
          }
        }
      }
    }
  }
</style>
