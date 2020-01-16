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
      <div class="font-16">点位信息</div>
       <!-- 楼盘定向->选中列表 -->
      <BuildList
        class="margin-top-20"
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
          <el-button v-if="project.data.userType === 1" style="width: 136px;" @click="confirmPay" type="primary">确认并支付</el-button>
          <el-button v-if="project.data.userType === 2" @click="sendMain" type="primary">转广告主确认并支付</el-button>
        </div>
      </div>
    </PutMangeCard>

    <!-- <div v-html="mailContent"></div> -->

    <!-- 确认回调弹窗 -->
    <PaySuccessWindow
      :show="confirmPayCallBack.show" 
      :account="confirmPayCallBack.data.account"
      :balance="confirmPayCallBack.data.balance"
    />    

    <!-- 邮件成功回调弹窗 -->
    <EmailCallBackWindow 
      @hideWindow="emailCallBack.show = false"
      :show="emailCallBack.show"
      :account="emailCallBack.payAmount"
    />    
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import PutMangeCard from '../../../templates/PutMangeCard' 
import PaySuccessWindow from './templates/PaySuccessWindow'
import EmailCallBackWindow from './templates/EmailCallBackWindow'
import BuildList from '@/views/putManage/templates/BuildList' 
import Industry from '../../../templates/Industry'
import { projectConst } from '../../../../../utils/static'
import { getUserInfo } from "@/utils/auth";

export default {
  components: {
    PutMangeCard,
    BuildList,
    Industry,
    PaySuccessWindow,
    EmailCallBackWindow
  },

  data() {
    return {
      projectConst,

      project: {
        loading: true,
        data: ''
      },

      userInfo: getUserInfo(),

      industryList: [],
      
      countDown: {
        minute: '00',
        second: '00'
      },

      estimatePriceValue: 0,

      confirmPayCallBack: {
        show: false,
        data: ''
      }, // 确认支付后的回调信息

      mailContent: '', // 销售邮件内容

      emailCallBack: {
        show: false,
        payAmount: null
      }, // 发邮件的回调信息
    }
  },
  
  beforeMount() {
    this.setLeftStep({rootActiveIndex: 2, subActiveIndex: 0})
    this.initConfirmPage(this.$route.query.projectId)
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
          this.timeDifference()
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
          let minute = Math.floor(timeDiff / oneMinute) < 0 ? 0 : Math.floor(timeDiff / oneMinute);
          let second = Math.floor((timeDiff % oneMinute) / 1000) < 0 ? 0 : Math.floor((timeDiff % oneMinute) / 1000);

          this.countDown = {
            minute: minute < 10 ? '0' + minute : minute,
            second: second < 10 ? '0' + second : second
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

    // 发送邮件给广告主
    sendMain() {
      // this.project.loading = true;
      this.mailContent = `<!doctype html>
                            <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
                              xmlns:o="urn:schemas-microsoft-com:office:office">

                              <head>
                                <!-- NAME: ANNOUNCE -->
                                <!--[if gte mso 15]>
                                  <xml>
                                      <o:OfficeDocumentSettings>
                                      <o:AllowPNG/>
                                      <o:PixelsPerInch>96</o:PixelsPerInch>
                                      </o:OfficeDocumentSettings>
                                  </xml>
                                <![endif]-->
                                <meta charset="UTF-8">
                                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                                <meta name="viewport" content="width=device-width, initial-scale=1">
                                <title>新潮传媒集团</title>

                                <style type="text/css">
                                  p {
                                    margin: 10px 0;
                                    padding: 0;
                                  }

                                  table {
                                    border-collapse: collapse;
                                  }

                                  h1,
                                  h2,
                                  h3,
                                  h4,
                                  h5,
                                  h6 {
                                    display: block;
                                    margin: 0;
                                    padding: 0;
                                  }

                                  img,
                                  a img {
                                    border: 0;
                                    height: auto;
                                    outline: none;
                                    text-decoration: none;
                                  }

                                  body,
                                  #bodyTable,
                                  #bodyCell {
                                    height: 100%;
                                    margin: 0;
                                    padding: 0;
                                    width: 100%;
                                  }

                                  .mcnPreviewText {
                                    display: none !important;
                                  }

                                  #outlook a {
                                    padding: 0;
                                  }

                                  img {
                                    -ms-interpolation-mode: bicubic;
                                  }

                                  table {
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                  }

                                  .ReadMsgBody {
                                    width: 100%;
                                  }

                                  .ExternalClass {
                                    width: 100%;
                                  }

                                  p,
                                  a,
                                  li,
                                  td,
                                  blockquote {
                                    mso-line-height-rule: exactly;
                                  }

                                  a[href^=tel],
                                  a[href^=sms] {
                                    color: inherit;
                                    cursor: default;
                                    text-decoration: none;
                                  }

                                  p,
                                  a,
                                  li,
                                  td,
                                  body,
                                  table,
                                  blockquote {
                                    -ms-text-size-adjust: 100%;
                                    -webkit-text-size-adjust: 100%;
                                  }

                                  .ExternalClass,
                                  .ExternalClass p,
                                  .ExternalClass td,
                                  .ExternalClass div,
                                  .ExternalClass span,
                                  .ExternalClass font {
                                    line-height: 100%;
                                  }

                                  a[x-apple-data-detectors] {
                                    color: inherit !important;
                                    text-decoration: none !important;
                                    font-size: inherit !important;
                                    font-family: inherit !important;
                                    font-weight: inherit !important;
                                    line-height: inherit !important;
                                  }

                                  .templateContainer {
                                    max-width: 600px !important;
                                  }

                                  a.mcnButton {
                                    display: block;
                                  }

                                  .mcnImage,
                                  .mcnRetinaImage {
                                    vertical-align: bottom;
                                  }

                                  .mcnTextContent {
                                    word-break: break-word;
                                  }

                                  .mcnTextContent img {
                                    height: auto !important;
                                  }

                                  .mcnDividerBlock {
                                    table-layout: fixed !important;
                                  }

                                  /*
                                @tab Page
                                @section Heading 1
                                @style heading 1
                                */
                                  h1 {
                                    /*@editable*/
                                    color: #222222;
                                    /*@editable*/
                                    font-family: Helvetica;
                                    /*@editable*/
                                    font-size: 40px;
                                    /*@editable*/
                                    font-style: normal;
                                    /*@editable*/
                                    font-weight: bold;
                                    /*@editable*/
                                    line-height: 150%;
                                    /*@editable*/
                                    letter-spacing: normal;
                                    /*@editable*/
                                    text-align: center;
                                  }

                                  /*
                                @tab Page
                                @section Heading 2
                                @style heading 2
                                */
                                  h2 {
                                    /*@editable*/
                                    color: #222222;
                                    /*@editable*/
                                    font-family: Helvetica;
                                    /*@editable*/
                                    font-size: 34px;
                                    /*@editable*/
                                    font-style: normal;
                                    /*@editable*/
                                    font-weight: bold;
                                    /*@editable*/
                                    line-height: 150%;
                                    /*@editable*/
                                    letter-spacing: normal;
                                    /*@editable*/
                                    text-align: left;
                                  }

                                  /*
                                @tab Page
                                @section Heading 3
                                @style heading 3
                                */
                                  h3 {
                                    /*@editable*/
                                    color: #444444;
                                    /*@editable*/
                                    font-family: Helvetica;
                                    /*@editable*/
                                    font-size: 22px;
                                    /*@editable*/
                                    font-style: normal;
                                    /*@editable*/
                                    font-weight: bold;
                                    /*@editable*/
                                    line-height: 150%;
                                    /*@editable*/
                                    letter-spacing: normal;
                                    /*@editable*/
                                    text-align: left;
                                  }

                                  /*
                                @tab Page
                                @section Heading 4
                                @style heading 4
                                */
                                  h4 {
                                    /*@editable*/
                                    color: #949494;
                                    /*@editable*/
                                    font-family: Georgia;
                                    /*@editable*/
                                    font-size: 20px;
                                    /*@editable*/
                                    font-style: italic;
                                    /*@editable*/
                                    font-weight: normal;
                                    /*@editable*/
                                    line-height: 125%;
                                    /*@editable*/
                                    letter-spacing: normal;
                                    /*@editable*/
                                    text-align: center;
                                  }

                                  /*
                                @tab Header
                                @section Header Container Style
                                */
                                  #templateHeader {
                                    /*@editable*/
                                    background-color: #f7d4d4;
                                    /*@editable*/
                                    background-image: url("https://gallery.mailchimp.com/38194040000d7d15a22d18ac5/images/0fd76a4a-771b-48bb-9446-867d640c41bc.png");
                                    /*@editable*/
                                    background-repeat: no-repeat;
                                    /*@editable*/
                                    background-position: center;
                                    /*@editable*/
                                    background-size: contain;
                                    /*@editable*/
                                    border-top: 0;
                                    /*@editable*/
                                    border-bottom: 0;
                                    /*@editable*/
                                    padding-top: 17px;
                                    /*@editable*/
                                    padding-bottom: 17px;
                                  }

                                  /*
                                @tab Header
                                @section Header Interior Style
                                */
                                  .headerContainer {
                                    /*@editable*/
                                    background-color: transparent;
                                    /*@editable*/
                                    background-image: none;
                                    /*@editable*/
                                    background-repeat: no-repeat;
                                    /*@editable*/
                                    background-position: center;
                                    /*@editable*/
                                    background-size: cover;
                                    /*@editable*/
                                    border-top: 0;
                                    /*@editable*/
                                    border-bottom: 0;
                                    /*@editable*/
                                    padding-top: 0;
                                    /*@editable*/
                                    padding-bottom: 0;
                                  }

                                  /*
                                @tab Header
                                @section Header Text
                                */
                                  .headerContainer .mcnTextContent,
                                  .headerContainer .mcnTextContent p {
                                    /*@editable*/
                                    color: #757575;
                                    /*@editable*/
                                    font-family: Helvetica;
                                    /*@editable*/
                                    font-size: 16px;
                                    /*@editable*/
                                    line-height: 150%;
                                    /*@editable*/
                                    text-align: left;
                                  }

                                  /*
                                @tab Header
                                @section Header Link
                                */
                                  .headerContainer .mcnTextContent a,
                                  .headerContainer .mcnTextContent p a {
                                    /*@editable*/
                                    color: #007C89;
                                    /*@editable*/
                                    font-weight: normal;
                                    /*@editable*/
                                    text-decoration: underline;
                                  }

                                  /*
                                @tab Body
                                @section Body Container Style
                                */
                                  #templateBody {
                                    /*@editable*/
                                    background-color: #FFFFFF;
                                    /*@editable*/
                                    background-image: none;
                                    /*@editable*/
                                    background-repeat: no-repeat;
                                    /*@editable*/
                                    background-position: center;
                                    /*@editable*/
                                    background-size: cover;
                                    /*@editable*/
                                    border-top: 0;
                                    /*@editable*/
                                    border-bottom: 0;
                                    /*@editable*/
                                    padding-top: 36px;
                                    /*@editable*/
                                    padding-bottom: 54px;
                                  }

                                  /*
                                @tab Body
                                @section Body Interior Style
                                */
                                  .bodyContainer {
                                    /*@editable*/
                                    background-color: transparent;
                                    /*@editable*/
                                    background-image: none;
                                    /*@editable*/
                                    background-repeat: no-repeat;
                                    /*@editable*/
                                    background-position: center;
                                    /*@editable*/
                                    background-size: cover;
                                    /*@editable*/
                                    border-top: 0;
                                    /*@editable*/
                                    border-bottom: 0;
                                    /*@editable*/
                                    padding-top: 0;
                                    /*@editable*/
                                    padding-bottom: 0;
                                  }

                                  /*
                                @tab Body
                                @section Body Text
                                */
                                  .bodyContainer .mcnTextContent,
                                  .bodyContainer .mcnTextContent p {
                                    /*@editable*/
                                    color: #757575;
                                    /*@editable*/
                                    font-family: Helvetica;
                                    /*@editable*/
                                    font-size: 16px;
                                    /*@editable*/
                                    line-height: 150%;
                                    /*@editable*/
                                    text-align: left;
                                  }

                                  /*
                                @tab Body
                                @section Body Link
                                */
                                  .bodyContainer .mcnTextContent a,
                                  .bodyContainer .mcnTextContent p a {
                                    /*@editable*/
                                    color: #007C89;
                                    /*@editable*/
                                    font-weight: normal;
                                    /*@editable*/
                                    text-decoration: underline;
                                  }

                                  /*
                                @tab Footer
                                @section Footer Style
                                */
                                  #templateFooter {
                                    /*@editable*/
                                    background-color: #333333;
                                    /*@editable*/
                                    background-image: none;
                                    /*@editable*/
                                    background-repeat: no-repeat;
                                    /*@editable*/
                                    background-position: center;
                                    /*@editable*/
                                    background-size: cover;
                                    /*@editable*/
                                    border-top: 0;
                                    /*@editable*/
                                    border-bottom: 0;
                                    /*@editable*/
                                    padding-top: 0px;
                                    /*@editable*/
                                    padding-bottom: 0px;
                                  }

                                  /*
                                @tab Footer
                                @section Footer Interior Style
                                */
                                  .footerContainer {
                                    /*@editable*/
                                    background-color: transparent;
                                    /*@editable*/
                                    background-image: none;
                                    /*@editable*/
                                    background-repeat: no-repeat;
                                    /*@editable*/
                                    background-position: center;
                                    /*@editable*/
                                    background-size: cover;
                                    /*@editable*/
                                    border-top: 0;
                                    /*@editable*/
                                    border-bottom: 0;
                                    /*@editable*/
                                    padding-top: 0;
                                    /*@editable*/
                                    padding-bottom: 0;
                                  }

                                  /*
                                @tab Footer
                                @section Footer Text
                                */
                                  .footerContainer .mcnTextContent,
                                  .footerContainer .mcnTextContent p {
                                    /*@editable*/
                                    color: #FFFFFF;
                                    /*@editable*/
                                    font-family: Helvetica;
                                    /*@editable*/
                                    font-size: 12px;
                                    /*@editable*/
                                    line-height: 150%;
                                    /*@editable*/
                                    text-align: center;
                                  }

                                  /*
                                @tab Footer
                                @section Footer Link
                                */
                                  .footerContainer .mcnTextContent a,
                                  .footerContainer .mcnTextContent p a {
                                    /*@editable*/
                                    color: #FFFFFF;
                                    /*@editable*/
                                    font-weight: normal;
                                    /*@editable*/
                                    text-decoration: underline;
                                  }

                                  @media only screen and (min-width:768px) {
                                    .templateContainer {
                                      width: 600px !important;
                                    }

                                  }

                                  @media only screen and (max-width: 480px) {

                                    body,
                                    table,
                                    td,
                                    p,
                                    a,
                                    li,
                                    blockquote {
                                      -webkit-text-size-adjust: none !important;
                                    }

                                  }

                                  @media only screen and (max-width: 480px) {
                                    body {
                                      width: 100% !important;
                                      min-width: 100% !important;
                                    }

                                  }

                                  @media only screen and (max-width: 480px) {
                                    .mcnRetinaImage {
                                      max-width: 100% !important;
                                    }

                                  }

                                  @media only screen and (max-width: 480px) {
                                    .mcnImage {
                                      width: 100% !important;
                                    }

                                  }

                                  @media only screen and (max-width: 480px) {

                                    .mcnCartContainer,
                                    .mcnCaptionTopContent,
                                    .mcnRecContentContainer,
                                    .mcnCaptionBottomContent,
                                    .mcnTextContentContainer,
                                    .mcnBoxedTextContentContainer,
                                    .mcnImageGroupContentContainer,
                                    .mcnCaptionLeftTextContentContainer,
                                    .mcnCaptionRightTextContentContainer,
                                    .mcnCaptionLeftImageContentContainer,
                                    .mcnCaptionRightImageContentContainer,
                                    .mcnImageCardLeftTextContentContainer,
                                    .mcnImageCardRightTextContentContainer,
                                    .mcnImageCardLeftImageContentContainer,
                                    .mcnImageCardRightImageContentContainer {
                                      max-width: 100% !important;
                                      width: 100% !important;
                                    }

                                  }

                                  @media only screen and (max-width: 480px) {
                                    .mcnBoxedTextContentContainer {
                                      min-width: 100% !important;
                                    }

                                  }

                                  @media only screen and (max-width: 480px) {
                                    .mcnImageGroupContent {
                                      padding: 9px !important;
                                    }

                                  }

                                  @media only screen and (max-width: 480px) {

                                    .mcnCaptionLeftContentOuter .mcnTextContent,
                                    .mcnCaptionRightContentOuter .mcnTextContent {
                                      padding-top: 9px !important;
                                    }

                                  }

                                  @media only screen and (max-width: 480px) {

                                    .mcnImageCardTopImageContent,
                                    .mcnCaptionBottomContent:last-child .mcnCaptionBottomImageContent,
                                    .mcnCaptionBlockInner .mcnCaptionTopContent:last-child .mcnTextContent {
                                      padding-top: 18px !important;
                                    }

                                  }

                                  @media only screen and (max-width: 480px) {
                                    .mcnImageCardBottomImageContent {
                                      padding-bottom: 9px !important;
                                    }

                                  }

                                  @media only screen and (max-width: 480px) {
                                    .mcnImageGroupBlockInner {
                                      padding-top: 0 !important;
                                      padding-bottom: 0 !important;
                                    }

                                  }

                                  @media only screen and (max-width: 480px) {
                                    .mcnImageGroupBlockOuter {
                                      padding-top: 9px !important;
                                      padding-bottom: 9px !important;
                                    }

                                  }

                                  @media only screen and (max-width: 480px) {

                                    .mcnTextContent,
                                    .mcnBoxedTextContentColumn {
                                      padding-right: 18px !important;
                                      padding-left: 18px !important;
                                    }

                                  }

                                  @media only screen and (max-width: 480px) {

                                    .mcnImageCardLeftImageContent,
                                    .mcnImageCardRightImageContent {
                                      padding-right: 18px !important;
                                      padding-bottom: 0 !important;
                                      padding-left: 18px !important;
                                    }

                                  }

                                  @media only screen and (max-width: 480px) {
                                    .mcpreview-image-uploader {
                                      display: none !important;
                                      width: 100% !important;
                                    }

                                  }

                                  @media only screen and (max-width: 480px) {

                                    /*
                                @tab Mobile Styles
                                @section Heading 1
                                @tip Make the first-level headings larger in size for better readability on small screens.
                                */
                                    h1 {
                                      /*@editable*/
                                      font-size: 30px !important;
                                      /*@editable*/
                                      line-height: 125% !important;
                                    }

                                  }

                                  @media only screen and (max-width: 480px) {

                                    /*
                                @tab Mobile Styles
                                @section Heading 2
                                @tip Make the second-level headings larger in size for better readability on small screens.
                                */
                                    h2 {
                                      /*@editable*/
                                      font-size: 26px !important;
                                      /*@editable*/
                                      line-height: 125% !important;
                                    }

                                  }

                                  @media only screen and (max-width: 480px) {

                                    /*
                                @tab Mobile Styles
                                @section Heading 3
                                @tip Make the third-level headings larger in size for better readability on small screens.
                                */
                                    h3 {
                                      /*@editable*/
                                      font-size: 20px !important;
                                      /*@editable*/
                                      line-height: 150% !important;
                                    }

                                  }

                                  @media only screen and (max-width: 480px) {

                                    /*
                                @tab Mobile Styles
                                @section Heading 4
                                @tip Make the fourth-level headings larger in size for better readability on small screens.
                                */
                                    h4 {
                                      /*@editable*/
                                      font-size: 18px !important;
                                      /*@editable*/
                                      line-height: 150% !important;
                                    }

                                  }

                                  @media only screen and (max-width: 480px) {

                                    /*
                                @tab Mobile Styles
                                @section Boxed Text
                                @tip Make the boxed text larger in size for better readability on small screens. We recommend a font size of at least 16px.
                                */
                                    .mcnBoxedTextContentContainer .mcnTextContent,
                                    .mcnBoxedTextContentContainer .mcnTextContent p {
                                      /*@editable*/
                                      font-size: 14px !important;
                                      /*@editable*/
                                      line-height: 150% !important;
                                    }

                                  }

                                  @media only screen and (max-width: 480px) {

                                    /*
                                @tab Mobile Styles
                                @section Header Text
                                @tip Make the header text larger in size for better readability on small screens.
                                */
                                    .headerContainer .mcnTextContent,
                                    .headerContainer .mcnTextContent p {
                                      /*@editable*/
                                      font-size: 16px !important;
                                      /*@editable*/
                                      line-height: 150% !important;
                                    }

                                  }

                                  @media only screen and (max-width: 480px) {

                                    /*
                                @tab Mobile Styles
                                @section Body Text
                                @tip Make the body text larger in size for better readability on small screens. We recommend a font size of at least 16px.
                                */
                                    .bodyContainer .mcnTextContent,
                                    .bodyContainer .mcnTextContent p {
                                      /*@editable*/
                                      font-size: 16px !important;
                                      /*@editable*/
                                      line-height: 150% !important;
                                    }

                                  }

                                  @media only screen and (max-width: 480px) {

                                    /*
                                @tab Mobile Styles
                                @section Footer Text
                                @tip Make the footer content text larger in size for better readability on small screens.
                                */
                                    .footerContainer .mcnTextContent,
                                    .footerContainer .mcnTextContent p {
                                      /*@editable*/
                                      font-size: 14px !important;
                                      /*@editable*/
                                      line-height: 150% !important;
                                    }

                                  }
                                </style>
                              </head>

                              <body>
                                <!--*|IF:MC_PREVIEW_TEXT|*-->
                                <!--[if !gte mso 9]><!----><span class="mcnPreviewText"
                                  style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden; mso-hide:all;">*|MC_PREVIEW_TEXT|*</span>
                                <!--<![endif]-->
                                <!--*|END:IF|*-->
                                <center>
                                  <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable">
                                    <tr>
                                      <td align="center" valign="top" id="bodyCell">
                                        <!-- BEGIN TEMPLATE // -->
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                          <tr>
                                            <td align="center" valign="top" id="templateHeader" data-template-container>
                                              <!--[if (gte mso 9)|(IE)]>
                                                <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                                <tr>
                                                <td align="center" valign="top" width="600" style="width:600px;">
                                              <![endif]-->
                                              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                                                <tr>
                                                  <td valign="top" class="headerContainer">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock"
                                                      style="min-width:100%;">
                                                      <tbody class="mcnImageBlockOuter">
                                                        <tr>
                                                          <td valign="top" style="padding:9px" class="mcnImageBlockInner">
                                                            <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0"
                                                              class="mcnImageContentContainer" style="min-width:100%;">
                                                              <tbody>
                                                                <tr>
                                                                  <td class="mcnImageContent" valign="top"
                                                                    style="padding-right: 9px; padding-left: 9px; padding-top: 0; padding-bottom: 0; text-align:center;">
                                                                    <img align="center" alt="" src="*|BRAND:LOGO|*" width="196"
                                                                      style="max-width: 196px; padding-bottom: 0px; vertical-align: bottom; display: inline !important; border-radius: 0%;"
                                                                      class="mcnImage">
                                                                  </td>
                                                                </tr>
                                                              </tbody>
                                                            </table>
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock"
                                                      style="min-width:100%;">
                                                      <tbody class="mcnImageBlockOuter">
                                                        <tr>
                                                          <td valign="top" style="padding:9px" class="mcnImageBlockInner">
                                                            <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0"
                                                              class="mcnImageContentContainer" style="min-width:100%;">
                                                              <tbody>
                                                                <tr>
                                                                  <td class="mcnImageContent" valign="top"
                                                                    style="padding-right: 9px; padding-left: 9px; padding-top: 0; padding-bottom: 0; text-align:center;">


                                                                    <img align="center" alt="" src="*|BRAND:LOGO|*" width="196"
                                                                      style="max-width: 196px; padding-bottom: 0px; vertical-align: bottom; display: inline !important; border: 1px none;"
                                                                      class="mcnImage">


                                                                  </td>
                                                                </tr>
                                                              </tbody>
                                                            </table>
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                              </table>
                                              <!--[if (gte mso 9)|(IE)]>
                                                  </td>
                                                  </tr>
                                                  </table>
                                              <![endif]-->
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align="center" valign="top" id="templateBody" data-template-container>
                                              <!--[if (gte mso 9)|(IE)]>
                                                <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                                <tr>
                                                <td align="center" valign="top" width="600" style="width:600px;">
                                              <![endif]-->
                                              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                                                <tr>
                                                  <td valign="top" class="bodyContainer">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock"
                                                      style="min-width:100%;">
                                                      <tbody class="mcnTextBlockOuter">
                                                        <tr>
                                                          <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                                                          <!--[if mso]>
                                                            <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                                                            <tr>
                                                          <![endif]-->

                                                          <!--[if mso]>
                                                            <td valign="top" width="600" style="width:600px;">
                                                          <![endif]-->
                                                            <table align="left" border="0" cellpadding="0" cellspacing="0"
                                                              style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                                                              <tbody>
                                                                <tr>
                                                                  <td valign="top" class="mcnTextContent"
                                                                    style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                                                                    <p><span style="font-size:14px">尊敬的【${this.userInfo.company}】：</span></p>
                                                                    <p>
                                                                      <span style="font-size:14px">&nbsp; &nbsp; &nbsp; &nbsp;您好！<br> &nbsp; &nbsp; &nbsp;&nbsp;
                                                                        您在新潮传媒的销售代理【${this.userInfo.contacts}】为你创建了如下投放方案，请确认支付，确认后系统将自动扣款！若有疑问，请联系销售代理。
                                                                      </span>
                                                                      <br>
                                                                    </p>
                                                                  </td>
                                                                </tr>
                                                              </tbody>
                                                            </table>
                                                            <!--[if mso]>
                                                              </td>
                                                            <![endif]-->

                                                            <!--[if mso]>
                                                              </tr>
                                                              </table>
                                                            <![endif]-->
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock"
                                                      style="min-width:100%;">
                                                      <tbody class="mcnDividerBlockOuter">
                                                        <tr>
                                                          <td class="mcnDividerBlockInner" style="min-width: 100%; padding: 9px 18px;">
                                                            <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%"
                                                              style="min-width: 100%;border-top: 1px solid #E0E0E0;">
                                                              <tbody>
                                                                <tr>
                                                                  <td>
                                                                    <span></span>
                                                                  </td>
                                                                </tr>
                                                              </tbody>
                                                            </table>
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock"
                                                      style="min-width:100%;">
                                                      <tbody class="mcnDividerBlockOuter">
                                                        <tr>
                                                          <td class="mcnDividerBlockInner" style="min-width: 100%; padding: 9px 18px 0px;">
                                                            <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%"
                                                              style="min-width:100%;">
                                                              <tbody>
                                                                <tr>
                                                                  <td>
                                                                    <span></span>
                                                                  </td>
                                                                </tr>
                                                              </tbody>
                                                            </table>
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock"
                                                      style="min-width:100%;">
                                                      <tbody class="mcnTextBlockOuter">
                                                        <tr>
                                                          <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                                                            <!--[if mso]>
                                                              <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                                                              <tr>
                                                            <![endif]-->

                                                            <!--[if mso]>
                                                              <td valign="top" width="600" style="width:600px;">
                                                            <![endif]-->
                                                            <table align="left" border="0" cellpadding="0" cellspacing="0"
                                                              style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                                                              <tbody>
                                                                <tr>

                                                                  <td valign="top" class="mcnTextContent"
                                                                    style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">

                                                                    <h3><span style="font-size:18px">方案信息</span></h3>

                                                                    <ul>
                                                                      <li><span style="font-size:14px">方案名称：${this.project.data.name}</span></li>
                                                                      <li><span style="font-size:14px">所属计划：${this.project.data.campaignName}</span></li>
                                                                      <li><span style="font-size:14px">方案行业：${this.project.data.industryName}</span></li>
                                                                    </ul>

                                                                    <ul>
                                                                      <li><span style="font-size:14px">屏幕类型：${this.$tools.getObjectItemFromArray(this.projectConst.screenType, 'value', this.project.data.type).name}</span></li>
                                                                      <li><span style="font-size:14px">投放类型：${this.$tools.getObjectItemFromArray(this.projectConst.putType, 'value', this.project.data.projectType).name}</span></li>
                                                                      <li><span style="font-size:14px">投放时间：${this.project.data.beginTime} ~ ${this.project.data.endTime}</span></li>
                                                                      <li><span style="font-size:14px">投放频次：${this.$tools.getObjectItemFromArray(this.projectConst.putFrequency, 'value', this.project.data.count).name}</span></li>
                                                                      <li><span style="font-size:14px">投放时长：${this.$tools.getObjectItemFromArray(this.projectConst.putDuration, 'value', this.project.data.second).name}</span></li>
                                                                    </ul>

                                                                    <ul>
                                                                      <li><span style="font-size:14px">楼盘数：${this.buildsNumber}个</span></li>
                                                                      <li><span style="font-size:14px">单元数：${this.unitNum}个</span></li>
                                                                      <li><span style="font-size:14px">点位数：${this.deviceNumber}个</span></li>
                                                                      <li><span style="font-size:14px">覆盖人数：${this.$tools.toThousands(this.peopleNumber, false) || 0}人</span></li>
                                                                    </ul>

                                                                    <div style="width: 100%; height: 1px; background: #E0E0E0; margin: 30px 0;"></div>
                                                                    <span style="font-size:14px">&nbsp;费用总计：</span><span
                                                                      style="font-size:18px"><strong><span
                                                                          style="color:#FF0000">￥${this.$tools.toThousands(this.estimatePriceValue / 100)}</span></strong></span><br>
                                                                    &nbsp;
                                                                    <p>&nbsp;</p>

                                                                  </td>
                                                                </tr>
                                                              </tbody>
                                                            </table>
                                                            <!--[if mso]>
                                                              </td>
                                                            <![endif]-->

                                                            <!--[if mso]>
                                                              </tr>
                                                              </table>
                                                            <![endif]-->
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock"
                                                      style="min-width:100%;">
                                                      <tbody class="mcnDividerBlockOuter">
                                                        <tr>
                                                          <td class="mcnDividerBlockInner" style="min-width: 100%; padding: 18px 18px 0px;">
                                                            <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%"
                                                              style="min-width:100%;">
                                                              <tbody>
                                                                <tr>
                                                                  <td>
                                                                    <span></span>
                                                                  </td>
                                                                </tr>
                                                              </tbody>
                                                            </table>
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock"
                                                      style="min-width:100%;">
                                                      <tbody class="mcnTextBlockOuter">
                                                        <tr>
                                                          <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                                                            <!--[if mso]>
                                                              <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                                                              <tr>
                                                            <![endif]-->

                                                            <!--[if mso]>
                                                              <td valign="top" width="600" style="width:600px;">
                                                            <![endif]-->
                                                            <table align="left" border="0" cellpadding="0" cellspacing="0"
                                                              style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                                                              <tbody>
                                                                <tr>
                                                                  <td valign="top" class="mcnTextContent"
                                                                    style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                                                                  </td>
                                                                </tr>
                                                              </tbody>
                                                            </table>
                                                            <!--[if mso]>
                                                              </td>
                                                            <![endif]-->

                                                            <!--[if mso]>
                                                              </tr>
                                                              </table>
                                                            <![endif]-->
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnButtonBlock"
                                                      style="min-width:100%;">
                                                      <tbody class="mcnButtonBlockOuter">
                                                        <tr>
                                                          <td style="padding-top:0; padding-right:18px; padding-bottom:18px; padding-left:18px;"
                                                            valign="top" align="center" class="mcnButtonBlockInner">
                                                            <table border="0" cellpadding="0" cellspacing="0" width="100%"
                                                              class="mcnButtonContentContainer"
                                                              style="border-collapse: separate !important;border-radius: 0px;background-color: #F35E5E;">
                                                              <tbody>
                                                                <tr>
                                                                  <td align="center" valign="middle" class="mcnButtonContent"
                                                                    style="font-family: Merriweather Sans, Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 16px;">
                                                                    <a class="mcnButton " title="确认支付" href="${process.env.BASE_API}/#/mailPayCallBack?mailNum=${this.project.data.mailNo}" target="_blank"
                                                                      style="font-weight: normal;letter-spacing: 5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF; padding: 20px">确认支付</a>
                                                                  </td>
                                                                </tr>
                                                              </tbody>
                                                            </table>
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                              </table>
                                              <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                </tr>
                                                </table>
                                              <![endif]-->
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align="center" valign="top" id="templateFooter" data-template-container>
                                              <!--[if (gte mso 9)|(IE)]>
                                                <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                                <tr>
                                                <td align="center" valign="top" width="600" style="width:600px;">
                                              <![endif]-->
                                              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                                                <tr>
                                                  <td valign="top" class="footerContainer">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock"
                                                      style="min-width:100%;">
                                                      <tbody class="mcnTextBlockOuter">
                                                        <tr>
                                                          <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                                                            <!--[if mso]>
                                                              <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                                                              <tr>
                                                            <![endif]-->

                                                            <!--[if mso]>
                                                              <td valign="top" width="600" style="width:600px;">
                                                            <![endif]-->
                                                            <table align="left" border="0" cellpadding="0" cellspacing="0"
                                                              style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                                                              <tbody>
                                                                <tr>

                                                                  <td valign="top" class="mcnTextContent"
                                                                    style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">

                                                                    <div style="text-align: center;">&nbsp; &nbsp; &nbsp;<span style="color:#696969">
                                                                        &nbsp; 本邮件由系统自动发出，请勿回复</span>
                                                                      <br>
                                                                      <span style="color:#696969">&nbsp; &nbsp; &nbsp; &nbsp; Copyright
                                                                        ©生活圈智投平台</span></div>

                                                                  </td>
                                                                </tr>
                                                              </tbody>
                                                            </table>
                                                            <!--[if mso]>
                                                              </td>
                                                            <![endif]-->

                                                            <!--[if mso]>
                                                              </tr>
                                                              </table>
                                                            <![endif]-->
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                              </table>
                                              <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                </tr>
                                                </table>
                                              <![endif]-->
                                            </td>
                                          </tr>
                                        </table>
                                        <!-- // END TEMPLATE -->
                                      </td>
                                    </tr>
                                  </table>
                                </center>
                              </body>

                            </html>`
      let param = {
        content: this.mailContent,
        payAmount: this.estimatePriceValue,
        title: '扣款确认'
      }

      this.$api.PutProject.ProjectMail(param)
        .then(res => {
          this.emailCallBack = {
            show: true,
            payAmount: res.result.payAmount
          };
          this.project.loading = false;
        })
        .catch(err => {
          this.project.loading = false;
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
    ...mapGetters([
      "buildsNumber", 
      "deviceNumber", 
      "peopleNumber", 
      "unitNum"
    ]),

    hasCanceled() {
      let res = false;
      if (+this.countDown.minute == 0 && +this.countDown.second == 0) {
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
          letter-spacing: 1px;
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