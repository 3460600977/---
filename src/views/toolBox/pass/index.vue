<template>
  <div class="edit-pass">
    <h3 class="editPassTitle">修改密码</h3>
    <el-form style="width: 490px" ref="editForm" :model="editForm" class="editForm" label-position="left"
             label-width="110px" :rules="rules">
      <el-form-item label="原密码" prop="oldPwd">
        <el-input v-model="editForm.oldPwd" show-password placeholder="请输入原密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码" :class="{'new-pass':true,'hide-mess':hideMess}" class="new-pass" prop="newPwd">
        <el-input v-model="editForm.newPwd" show-password placeholder="请输入新密码"></el-input>
        <span class="show-validate-message">* 8-18位，必须包含大写字母、小写字母、数字和符号四种形式</span>
      </el-form-item>
      <el-form-item label="新密码确认" prop="confirmNewPwd">
        <el-input v-model="editForm.confirmNewPwd" show-password placeholder="请再次输入新密码"></el-input>
      </el-form-item>
      <el-form-item class="submit-login">
        <el-button @click="resetForm('editForm')">取 消</el-button>
        <el-button type="primary" @click="submitConfirm('editForm')" v-loading="loading">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
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
                        {trigger: ['blur', 'change'], validator: validatePass},
                    ],
                    confirmNewPwd: [
                        {
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

            },
            submitConfirm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        console.log('error submit!!');
                        return false;
                    } else {
                        let param = {
                            newPwd: this.editForm.newPwd,
                            oldPwd: this.editForm.oldPwd,
                            confirmNewPwd: this.editForm.confirmNewPwd,
                        }
                        //请求登录接口
                        this.loading = true;
                        this.$api.Login.ChangePass(param)
                            .then(res => {

                            })
                            .catch(res => {
                                this.loading = false;
                            })
                    }
                });
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

      .show-validate-message {
        font-size: 12px;
        font-weight: 400;
        color: $color-text-1;
        line-height: 1;
        padding-top: 4px;
        position: absolute;
        top: 100%;
        left: 0;

      }

      .hide-mess {
        .show-validate-message {
          display: none;
        }
      }
    }
  }
</style>
