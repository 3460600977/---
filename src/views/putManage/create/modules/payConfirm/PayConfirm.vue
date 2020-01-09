<template>
  <div v-loading.fullscreen.lock="project.loading" class="create-confirm">
    <!-- 倒计时30分钟 -->
    <PutMangeCard class="time-box mid">
      <div class="left-info font-16 mid">
        <i style="font-size: 28px; margin-right: 14px;" class="iconfont icon-tishi color-red"></i>
        <template v-if="hasCanceled">
          订单已取消，若想继续投放，请重新创建投放方案~
        </template>
        <template v-else>
          已为您预留点位，请及时支付，未支付方案30分钟后将自动取消
        </template>
      </div>

      <div class="right-time mid-center">
        <div class="time mid-center font-nflbengals">{{countDown.minute}}</div>
        <div class="split mid-center">:</div>
        <div class="time mid-center font-nflbengals">{{countDown.second}}</div>
      </div>
    </PutMangeCard>


    <!-- 方案信息 -->
    <PutMangeCard>
      <div class="font-16" style="margin-bottom: 30px;">方案信息</div>
      <el-form class="info-form" label-position='left' label-width="150px">
        <el-form-item label="方案名称">
          <span class="color-text-1">{{project.data.name}}</span>
        </el-form-item>
        <el-form-item label="所属计划">
          <span class="color-text-1">{{project.data.campaignName}}</span>
        </el-form-item>
        <el-form-item label="方案行业">
          <span class="color-text-1">{{project.data.industryName}}</span>
        </el-form-item>
        <el-form-item label="屏幕类型">
          <span class="color-text-1">{{$tools.getObjectItemFromArray(projectConst.screenType, 'value', project.data.type).name}}</span>
        </el-form-item>
        <el-form-item label="投放类型">
          <span class="color-text-1">{{$tools.getObjectItemFromArray(projectConst.putType, 'value', project.data.projectType).name}}</span>
        </el-form-item>
        <el-form-item label="投放时间">
          <span class="color-text-1">{{project.data.beginTime}} ~ {{project.data.endTime}}</span>
        </el-form-item>
        <el-form-item label="投放频次">
          <span class="color-text-1">{{$tools.getObjectItemFromArray(projectConst.putFrequency, 'value', project.data.count).name}}</span>
        </el-form-item>
        <el-form-item label="投放时长">
          <span class="color-text-1">{{$tools.getObjectItemFromArray(projectConst.putDuration, 'value', project.data.second).name}}</span>
        </el-form-item>
      </el-form>
    </PutMangeCard>

    <!-- 点位信息 -->
    <PutMangeCard>
      <div class="font-16" style="margin-bottom: 30px;">点位信息</div>
       <!-- 楼盘定向->选中列表 -->
      <BuildList
        :buildingDirectionActiveType="'payConfirm'"
        :loading="false"/>
    </PutMangeCard>


    <!-- 总计 取消投放 确认并支付 -->
    <PutMangeCard>
      <div class="mid-between">
        <div>总计&nbsp;<span class="color-red font-18 font-number"><span class="font-16">¥ </span>{{this.$tools.toThousands(estimatePriceValue / 100)}}</span></div>
        <div v-if="hasCanceled">
          <router-link to="/putManage?active=project">
            <el-button style="width: 136px;" type="primary">返回列表</el-button>
          </router-link>
        </div>
        <div v-else>
          <el-button style="width: 136px;" @click="canclePut">取消投放</el-button>
          <el-button style="width: 136px;" @click="confirmPay" type="primary">确认并支付</el-button>
        </div>
      </div>
    </PutMangeCard>

    <!-- 确认回调弹窗 -->
    <el-dialog
      :beforeClose="backToList"    
      :visible.sync="confirmPayCallBack.show"
      class="my-confirm-dialog my-dialog"
      width="568px">

      <div class="confirm-title mid" slot="title">
        <i class="icon color-red iconfont icon--zhengque-shiti"></i>
        <div class="info">
          <p class="font-16">支付成功</p>
          <p class="font-14 color-text-1 mt-10">提示：请及时上传广告创意，若未及时上传，投放方案将自动取消</p>
        </div>
      </div>

      <div class="font-14">
        <span>支付金额：</span>
        <span class="color-red">¥ <span class="font-18 font-number">{{this.$tools.toThousands(confirmPayCallBack.data.account / 100)}}</span></span>
      </div>

      <div style="margin-top: 23px;" class="font-14">
        <span>账户余额：</span>
        <span class="color-red">¥ <span class="font-18 font-number">{{this.$tools.toThousands(confirmPayCallBack.data.balance / 100)}}</span></span>
      </div>
      <span slot="footer" class="dialog-footer mid-center">
        <el-button style="width: 100px" @click="backToList">返回列表</el-button>
        <el-button style="width: 100px; margin-left: 60px" type="primary" @click="uploadCreative">上传创意</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import PutMangeCard from '../../../templates/PutMangeCard' 
import BuildList from '@/views/putManage/templates/BuildList' 
import Industry from '../../../templates/Industry'
import { projectConst } from '../../../../../utils/static'

export default {
  components: {
    PutMangeCard,
    BuildList,
    Industry
  },

  data() {
    return {
      projectConst,

      project: {
        loading: true,
        data: ''
      },

      industryList: [],
      
      countDown: {
        minute: 0,
        second: 0
      },

      estimatePriceValue: 0,

      confirmPayCallBack: {
        show: false,
        data: ''
      }, // 确认支付后的回调信息
    }
  },
  
  beforeMount() {
    this.setLeftStep({rootActiveIndex: 2, subActiveIndex: 0})
    this.initConfirmPage(this.$route.query.projectId)
    this.timeDifference()
  },

  methods: {
    ...mapMutations(['setLeftStep', 'setBuildsList']),

    // 方案明细
    initConfirmPage: async function(projectId) {
      this.project = {
        loading: true,
        data: []
      }
      this.industryList = await this.getIndustryList();
      this.$api.PutProject.GetProjectDetailById(projectId)
        .then(res => {
          this.project = {
            loading: false,
            data: res.result
          };
          this.setBuildsList(this.project.data.premiseVOS)
          this.estimatePrice()
        })
        .catch(res => {
          this.project = {
            loading: false,
            data: []
          }
        })
    },

    // POST根据订单信息计算预估总价
    estimatePrice() {
      let param = {
        beginTime:  this.project.data.beginTime,
        endTime:    this.project.data.endTime,
        cityCode:   this.project.data.projectCity,
        count:      this.project.data.count,
        deviceNum:  this.deviceNumber,
        second:     this.project.data.second,
        type:       this.project.data.type
      }
      this.$api.CityList.EstimateTotalPrice(param)
          .then(res => {
            this.estimatePriceValue = res.result;
          })
          .catch(res => {
          })
    },

    // 行业列表
    getIndustryList: async function() {
      return new Promise((resolve, reject) => {
        this.$api.IndustryList.AllList()
          .then(res => {
            resolve(res.result)
          })
          .catch(res => {
          })
      })
    },

    // 倒计时30分钟
    timeDifference() {
      setInterval(() => {  
        if (this.project.data) {
          let oneMinute = 60 * 1000;// 一分钟毫秒数
          let timeDiff = this.project.data.createTime + oneMinute * 30 - Date.now()
          this.countDown = {
            minute: Math.floor(timeDiff / oneMinute) < 0 ? 0 : Math.floor(timeDiff / oneMinute),
            second: Math.floor((timeDiff % oneMinute) / 1000) < 0 ? 0 : Math.floor((timeDiff % oneMinute) / 1000)
          }
        }
      }, 1000);
    },

    // 方案确认支付
    confirmPay() {
      this.project.loading = true;
      this.$api.PutProject.ConfirmPay(this.$route.query.projectId)
        .then(res => {
          this.confirmPayCallBack = {
            show: true,
            data: res.result
          }; 
          this.project.loading = false;
        })
        .catch(res => {
          this.project.loading = false;
        })
    },

    // 去编辑创意
    uploadCreative() {
      this.$router.push({
        path: '/putManage/create/creative',
        query: {
          projectId: this.$route.query.projectId,
          createType: 'step'
        }
      })
    },

    // 返回列表
    backToList() {
      this.$router.push({
        path: '/putManage',
        query: {
          'active': 'project'
        }
      })
    },

    // 取消投放
    canclePut() {
      this.project.loading = false;
      this.$api.PutProject.CancelProject({projectId: this.$route.query.projectId})
        .then(res => {
          this.$notify({
            title: '成功',
            message: res.msg,
            type: 'success'
          });
          this.$router.push({
            path: '/putManage',
            query: {
              'active': 'project'
            }
          })
        })
        .catch(res => {})
    },
    
  },

  computed: {
    ...mapGetters(['deviceNumber']),

    hasCanceled() {
      let res = false;
      if (this.countDown.minute === 0 && this.countDown.second === 0) {
        res = true;
      }
      return res;
    }
  },

}
</script>

<style lang="scss">
  .create-confirm{
    .time-box{
      position: relative;
      height:120px;
      .right-time{
        position: absolute;
        right: 0;
        top: 0;
        width:188px;
        height:120px;
        background-color: $color-main;
        font-size: 20px;
        .time{
          width:28px;
          height:28px;
          background:rgba(255,255,255,1);
          border-radius:4px;
          font-weight:400;
          color:rgba(244,74,74,1);
        }
        .split{
          width: 15px;
          color: #fff;
        }
      }
    }
    .my-confirm-dialog{
      .confirm-title{
        .icon{
          float: left;
          font-size: 32px;
        }
        .info{
          float: left;
          margin-left: 20px;
        }
      }
    }
  }
</style>