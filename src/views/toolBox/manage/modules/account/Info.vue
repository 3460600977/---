<template>
  <div class="account-info">
    <el-card class="box-card">
      <div class="report-divider">
        <el-divider direction="vertical"></el-divider>
        <span class="report-form-title">账号信息</span>
      </div>
      <div class="detail-list"
           v-for="(itemLabel,index_label) in accountInfoList"
           :key="index_label">
        <i :class="itemLabel.icon"></i>
        <span class="detail-list-label">{{itemLabel.name}}</span>
        <span class="detail-list-title" v-if="itemLabel.name==='联系电话'">
          {{hiddenPhone(itemLabel.label)}}
        </span>
        <span class="detail-list-title" v-else>
          {{itemLabel.label}}
        </span>
      </div>
    </el-card>
  </div>
</template>

<script>
    import {getUserInfo} from '@/utils/auth';

    export default {
        name: "toolAccountInfo",
        data() {
            return {
                accountInfoList: [
                    {name: '公司全称', label: '', icon: 'el-icon-office-building', field: 'company'},
                    {name: '公司行业', label: '', icon: 'el-icon-s-marketing', field: 'industryName'},
                    {name: '联系人', label: '', icon: 'el-icon-s-custom', field: 'contacts'},
                    {name: '联系电话', label: '', icon: 'el-icon-phone', field: 'contactNumber'},
                    {name: '联系邮箱', label: '', icon: 'el-icon-message', field: 'mail'},
                    {name: '公司地址', label: '', icon: 'el-icon-location', field: 'address'},
                ]
            }
        },
        mounted() {
            //请求验证码接口
            let userInfo = getUserInfo()
            this.accountInfoList.forEach(function (item) {
                let property = item.field;
                if (userInfo.hasOwnProperty(property)) {
                    if (!userInfo[property] || userInfo[property].match(/^[ ]*$/)) { // "",null,undefined,NaN
                        item.label = '未填写'
                    } else {
                        item.label = userInfo[property]
                    }
                }
            })
        },
        methods: {
            // 计算属性的 getter
            hiddenPhone: function (phoneNum) {
                if (Number(phoneNum) && String(phoneNum).length === 11) {

                    let mobile = String(phoneNum)

                    let reg = /^(\d{3})\d{4}(\d{4})$/

                    return mobile.replace(reg, '$1****$2')

                } else {
                    return phoneNum
                }
            }
        }
    }
</script>

<style lang="scss">
  .account-info {
    height: 100%;

    .box-card {
      margin-top: 0;
      height: 100%;
    }

    .el-card__body {
      height: 100%;
      padding: 30px 38px;
    }

    .report-divider {
      .el-divider {
        background-color: $color-blue;
        border-radius: 2px;
        width: 3px;
        margin: 0 5px 0 0;
      }

      .report-form-title {
        font-size: 16px;
        font-weight: bold;
        color: $color-text;
      }
    }

    .detail-list {
      margin-top: 43px;
      font-size: 14px;
      font-weight: 400;

      &:first-child {
        margin-top: 0;
      }

      i {
        color: $color-blue;
        padding: 7px;
        background-color: $color-bg;
        border-radius: 4px;
      }

      .detail-list-label {
        display: inline-block;
        color: $color-text;
        width: 150px;
        margin-left: 11px;
      }

      .detail-list-title {
        color: $color-text-1;
      }
    }
  }
</style>
