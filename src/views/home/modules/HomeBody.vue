<template>
  <div class="home-body" v-loading.fullscreen.lock="false">
    <el-card class="box-card mid shadow">
      <div class="company-msg mid">
        <img width="48px" :src="images.grayHead" alt="头像" />
        <div class="msg-box">
          <span class="company-name">{{summaryDetailList.company}}</span>
          <span class>{{summaryDetailList.brandName}}</span>
        </div>
      </div>
      <!--  -->
      <div
        :style="`background-image:url('${images.moneyBg}')`"
        class="account-money-box color-white"
      >
        <div class="accouint-title">资金账户</div>
        <div
          class="account-val font-number"
        >¥ {{$tools.toThousands(summaryDetailList.accountBalance / 100)}}</div>
      </div>
      <div
        :style="`background-image:url('${images.xinchaoBin}')`"
        class="account-money-box color-white"
      >
        <div class="accouint-title">新潮币</div>
        <div class="account-val font-number">{{$tools.toThousands(summaryDetailList.xcMoney / 100)}}</div>
      </div>
      <el-button class="create-put" type="primary" icon="el-icon-plus" @click="ToPathPlan">创建投放方案</el-button>
    </el-card>
    <el-card class="box-card data_card mid-center shadow">
      <div class="card_list">
        <div @click="goToPath('goToPlan')" class="goToPath">
          <span class="blue">{{summaryDetailList.countCampaign}}</span>
          <p>
            投放计划
            <i class="el-icon-arrow-right"></i>
          </p>
        </div>
        <div @click="goToPath('goToProject')" class="goToPath">
          <span>{{summaryDetailList.countProjectUse}}</span>
          <p>
            投放中方案
            <i class="el-icon-arrow-right"></i>
          </p>
        </div>
        <div @click="goToPath('goToUnPayProject')" class="goToPath">
          <span class="red">{{summaryDetailList.countProjectNoUse}}</span>
          <p class="un-pay-p">
            未支付方案
            <i class="el-icon-arrow-right un-pay-p"></i>
          </p>
        </div>
        <div @click="goToPath('goToDenyCreative')" class="goToPath">
          <span class="red">{{summaryDetailList.countCreativeNoPass}}</span>
          <p>
            审核拒绝创意
            <i class="el-icon-arrow-right"></i>
          </p>
        </div>
      </div>
    </el-card>
    <el-card class="box-card line-echarts shadow">
      <div class="echarts_content">
        <h2>数据趋势</h2>
        <div class="line-echarts_change">
          <div>
            <el-select
              placeholder="花费（元）"
              class="select_bar_line"
              v-model="selectLine.firstValue"
              @change="changeFirstValue"
            >
              <el-option
                v-for="item in costList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>对比
            <el-select
              placeholder="曝光数"
              class="select_bar_line"
              v-model="selectLine.secondValue"
              @change="changeSecondValue"
            >
              <el-option
                v-for="item in exposureList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <el-date-picker
            :clearable="false"
            v-model="selectLine.selectTime"
            type="daterange"
            range-separator="--"
            :picker-options="pickerOptions"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeSelectTime"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
          <div class="line-echarts_tip">
            <span>
              <i class="blue_bg"></i>
              {{selectLine.selectFirstLabel}}
            </span>
            <span>
              <i class="red_bg"></i>
              {{selectLine.selectSecondLabel}}
            </span>
          </div>
        </div>
      </div>
      <!-- <div ref="lineBox" class="lineBox" style="width:1000px;height:450px;"></div> -->
      <home-data-line :summaryLineData="summaryLineData"></home-data-line>
    </el-card>
    <el-card class="box-card cases_broadcast shadow">
      <h2>合作标杆</h2>
      <div class="el-carousel">
        <el-carousel arrow="always">
          <el-carousel-item v-for="(item,imgIndex) in imgList" :key="imgIndex">
            <img class="imgItem" :src="item" @click="showPlayVideo(imgIndex)" />
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-card>
    <el-card class="box-card news_list shadow">
      <h2>新闻资讯</h2>
      <div class="news_case_list">
        <div class="news_case_item" @click="toPathNew(158)">
          <div class="news_case_time">
            <span>2019</span>
            <p>12-31</p>
          </div>
          <div class="news_case_content">
            <h4>新潮传媒携手时间的朋友，探索2020年的基本盘</h4>
            <p>12月31日晚，2019年的最后一夜，罗振宇2019-2020“时间的朋友”跨年演讲在上海举行。今年跨年演讲的主题围绕着“基本盘”三个字展开，带着各位“时间的朋友”探索中国商业2020年的“基本盘”，厘清2020年的趋势和方向。新潮传媒作为联合特约合作伙伴，全程支持本次活动。</p>
          </div>
        </div>
        <div class="news_case_item" @click="toPathNew(156)">
          <div class="news_case_time">
            <span>2019</span>
            <p>12-26</p>
          </div>
          <div class="news_case_content">
            <h4>四川广告人荣耀之夜：新潮传媒解析如何用科技重新定义电梯媒体</h4>
            <p>12月26日，由四川省市场监管局指导、四川省广告协会主办的“2019四川广告人荣耀之夜”在成都举行。此次盛典集政府领导、高校教授、媒体、知名品牌等齐聚一堂，打造广告产业链条融合交流的高效平台，推动广告传媒行业的繁荣发展。</p>
          </div>
        </div>
        <div class="news_case_item" @click="toPathNew(157)">
          <div class="news_case_time">
            <span>2019</span>
            <p>12-25</p>
          </div>
          <div class="news_case_content">
            <h4>川商总会2020新年演讲：新潮传媒张继学解码线下媒体数字化</h4>
            <p>12月25日，川商总会2020年新年演讲在成都举行。全国工商联副主席、四川省政协副主席、四川省工商联主席陈放，川商总会会长、新希望集团董事长刘永好，川商总会常务副会长、泸州老窖董事长刘淼等嘉宾齐聚盛典，聚焦商业前沿理念，探讨时代发展新趋势。</p>
          </div>
        </div>
        <div class="news_case_item" @click="toPathNew(155)">
          <div class="news_case_time">
            <span>2019</span>
            <p>12-19</p>
          </div>
          <div class="news_case_content">
            <h4>2019中国创新营销峰会：新潮传媒斩获年度创新营销行业金奖</h4>
            <p>12月19日，2019中国创新营销峰会暨中国创新营销大奖颁奖典礼在北京举行。本次峰会以Smart+为主题，聚焦前沿营销技术、新零售、数字化转型等议题，捕捉行业趋势，精准输出心智。</p>
          </div>
        </div>
      </div>
    </el-card>

    <el-dialog center width="900px" :visible.sync="isShow" class="play-dialog-video">
      <play-video :playVideoUrl="playVideoUrl" @closePlayDialog="closePlayDialog"></play-video>
    </el-dialog>
  </div>
</template>

<script>
import { getUserInfo, setUserInfo } from "@/utils/auth";
import HomeDataLine from "../../../components/echarts/HomeDataLine";
import PlayVideo from "../../../components/PlayVideo";
import echarts from "echarts";
export default {
  name: "HomeBody",
  components: { HomeDataLine, PlayVideo },
  data() {
    return {
      costList: [
        { label: "设备数", value: 0 },
        { label: "花费（元）", value: 1 },
        { label: "曝光数", value: 2 }
      ],
      exposureList: [
        { label: "设备数", value: 0 },
        { label: "花费（元）", value: 1 },
        { label: "曝光数", value: 2 }
      ],
      timeList: [{ label: "过去七天", value: 1 }],
      imgList: [
        "https://cdn.xinchao.com/goods/201806/5b2367bc96f13.png",
        "https://cdn.xinchao.com/goods/201807/5b5ab83c7e3bd.jpg",
        "https://cdn.xinchao.com/goods/201803/5a9df89704b31.jpg"
      ],
      playVideoList: [
        {
          video:
            "https://cdn.xinchao.com/goods/201912/b23d7a29773d52cfe3d0e5572d7c00a41576664715.mp4",
          img: "https://cdn.xinchao.com/goods/201803/5aa73f41d9812.jpg"
        },
        {
          video:
            "https://cdn.xinchao.com/goods/201912/f9ec76497c75c2fdf378aae3ab7cfb801576666433.mp4",
          img: "https://cdn.xinchao.com/goods/201807/5b5ab8636ed5b.jpg"
        },
        {
          video:
            "https://cdn.xinchao.com/goods/201912/3678d23889d5a75cffd3c829062388d71576668059.mp4",
          img: "https://cdn.xinchao.com/goods/201803/5a9df89f94f37.jpg"
        }
      ],
      playVideoUrl: {},
      loading: false,
      images: {
        userHead: require("../../../assets/images/icons/icon_tx.png"),
        grayHead: require("../../../assets/images/icons/icon_head portrait.png"),
        moneyBg: require("../../../assets/images/icon_money_bg_red.png"),
        noData: require("../../../assets/images/icon_no_data.png"),
        xinchaoBin: require("../../../assets/images/icon_xcb.png"),
        iconRight: require("../../../assets/images/icons/right.png")
      },
      width: "600px",
      height: "700px",
      name: "",
      isShow: false,
      //每次进入路由，需要刷新的数据
      summaryDetailList: {},
      summaryLineData: {
        sFirstData: [],
        xdata: [],
        sSecondData: [],
        selectLine: {}
      },
      selectLine: {
        firstValue: 1,
        secondValue: 2,
        selectFirstLabelLine: "花费（元）¥ ",
        selectSecondLabelLine: "曝光数",
        selectFirstLabel: "花费（元）",
        selectSecondLabel: "曝光数",
        startTime: this.$tools.getFormatDate(
          "YYYY-mm-dd",
          this.$tools.getLastWeek()
        ),
        endTime: this.$tools.getFormatDate("YYYY-mm-dd", new Date()),
        selectTime: []
      }
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getRefresh();
      vm.getSummaryDetail();
      vm.getSummaryData();
    });
  },
  // mounted() {
  //   //请求验证码接口
  //   let userInfo = getUserInfo();
  //   this.company = userInfo.company;
  //   this.accountBalance = userInfo.accountBalance;
  // },
  computed: {
    // 日期限制
    pickerOptions() {
      return {
        disabledDate(date) {
          return date.getTime() > Date.now();
        }
      };
    }
  },
  methods: {
    //展示走马灯图片对应的视频展示框
    showPlayVideo(index) {
      this.isShow = true;
      this.playVideoUrl = this.playVideoList[index];
    },
    //隐藏走马灯图片对应的视频展示框
    closePlayDialog() {
      this.isShow = false;
    },
    //时间改变，对应的数据趋势图发生改变
    changeSelectTime(selectTimeVal) {
      this.startTime = selectTimeVal[0];
      this.endTime = selectTimeVal[1];
      this.getSummaryDataChange();
    },
    //选择第一个，对应的数据趋势图发生改变
    changeFirstValue(selectFirst) {
      let obj = {};
      obj = this.costList.find(item => {
        return item.value === selectFirst;
      });
      this.selectLine.selectFirstLabel = obj.label;
      this.selectLine.firstValue = selectFirst;
      this.selectLine.selectFirstLabelLine = obj.label;
      if (this.selectLine.firstValue === 1) {
        this.selectLine.selectFirstLabelLine = "花费（元）¥ ";
      }
      this.getSummaryDataChange();
    },
    //选择第二个，对应的数据趋势图发生改变
    changeSecondValue(selectSecond) {
      let obj = {};
      obj = this.exposureList.find(item => {
        return item.value === selectSecond;
      });
      this.selectLine.selectSecondLabel = obj.label;
      this.selectLine.secondValue = selectSecond;
      this.selectLine.selectSecondLabelLine = obj.label;
      if (this.selectLine.secondValue === 1) {
        this.selectLine.selectSecondLabelLine = "花费（元）¥ ";
      }
      this.getSummaryDataChange();
    },
    //首页跳转到新闻页面
    toPathNew(pathIndex) {
      window.open("https://www.xinchao.com/articleDetail/" + pathIndex);
    },
    //首页跳转到投放计划,首页跳转到投放中方案,首页跳转到未支付方案,首页跳转到审核拒绝创意
    goToPath(pathName) {
      switch (pathName) {
        case "goToPlan":
          this.$router.push({ path: "/putManage?active=plan", query: {} });
          break;
        case "goToProject":
          this.$router.push({
            path: "/putManage?active=project&status=1",
            query: {}
          });
          break;
        case "goToUnPayProject":
          this.$router.push({
            path: "/putManage?active=project&status=4",
            query: {}
          });
          break;
        case "goToDenyCreative":
          this.$router.push({
            path: "putManage?active=creative&status=1",
            query: {}
          });
          break;
      }
    },

    ToPathPlan() {
      this.$router.push("putManage/create/plan");
    },
    getRefresh: async function() {
      //请求验证码接口
      this.loading = true;
      let userInfo = await this.$tools.refreshUserInfo();
      if ("-999" === userInfo) {
        userInfo = getUserInfo();
      }
      this.accountBalance = userInfo.accountBalance;
      this.company = userInfo.company;
      if (userInfo.avatar) {
        this.images.grayHead = userInfo.avatar;
      }
      this.loading = false;
    },
    //刷新首页 概况详情=》统计计划，方案，未支付方案，审核拒绝创意数
    getSummaryDetail: async function() {
      this.loading = true;
      let summaryDetail = await this.$tools.getSummaryDetail();
      if ("-998" === summaryDetail) {
      }
      this.loading = false;
      this.summaryDetailList = summaryDetail;
    },
    //刷新首页 用户统计数据=》数据趋势
    getSummaryData: async function() {
      this.selectLine.selectTime = [
        this.$tools.getFormatDate("YYYY-mm-dd", this.$tools.getLastWeek()),
        this.$tools.getFormatDate("YYYY-mm-dd", new Date())
      ];
      let param = {
        startTime: this.selectLine.selectTime[0],
        endTime: this.selectLine.selectTime[1],
        first: this.selectLine.firstValue,
        second: this.selectLine.secondValue
      };
      let summaryData = await this.$tools.getSummaryData(param);
      summaryData.first.forEach(fItem => {
        if (this.selectLine.firstValue === 1) {
          fItem.summary = this.$tools.toThousands(fItem.summary / 100, 2);
        }
        this.summaryLineData.sFirstData.push(fItem.summary);
        this.summaryLineData.xdata.push(fItem.date);
      });
      summaryData.second.forEach(sItem => {
        if (this.selectLine.secondValue === 1) {
          sItem.summary = this.$tools.toThousands(sItem.summary / 100, 2);
        }
        this.summaryLineData.sSecondData.push(sItem.summary);
      });
      this.summaryLineData.selectLine = this.selectLine;
      this.loading = false;
    },
    getSummaryDataChange: function() {
      let param = {
        startTime: this.selectLine.startTime,
        endTime: this.selectLine.endTime,
        first: this.selectLine.firstValue,
        second: this.selectLine.secondValue
      };
      this.summaryLineData.sFirstData = [];
      this.summaryLineData.xdata = [];
      this.summaryLineData.sSecondData = [];
      this.$api.Login.GetSummaryData(param)
        .then(res => {
          let summaryData = res.result;
          summaryData.first.forEach(fItem => {
            if (this.selectLine.firstValue === 1) {
              fItem.summary = this.$tools.toThousands(fItem.summary / 100, 2);
            }
            this.summaryLineData.sFirstData.push(fItem.summary);
            this.summaryLineData.xdata.push(fItem.date);
          });
          summaryData.second.forEach(sItem => {
            if (this.selectLine.secondValue === 1) {
              sItem.summary = this.$tools.toThousands(sItem.summary / 100, 2);
            }
            this.summaryLineData.sSecondData.push(sItem.summary);
          });
          this.summaryLineData.selectLine = this.selectLine;
        })
        .catch(res => {});
    },
    calMax(arr) {
      let max = arr[0];
      for (let i = 1; i < arr.length; i++) {
        // 求出一组数组中的最大值
        if (max < arr[i]) {
          max = arr[i];
        }
      }
      let maxint = Math.ceil(max / 10); // 向上取整
      let maxval = maxint * 10; // 最终设置的最大值
      return maxval; // 输出最大值
    }
  }
};
</script>

<style lang="scss" scoped>
.home-body {
  width: 1200px;
  margin: 0 auto;
  .goToPath {
    cursor: pointer;
  }
  .un-pay-p {
    color: $color-main;
  }
  .box-card {
    position: relative;
    .company-msg {
      float: left;
      height: 100px;
      .msg-box {
        display: flex;
        flex-direction: column;
        margin: 0 33px 0 14px;
        .company-name {
          width: 240px;
          font-size: 14px;
          line-height: 28px;
          color: rgba(24, 24, 25, 1);
        }
      }
    }
    .accouint-title {
      height: 14px;
      font-size: 14px;
      line-height: 14px;
    }
    .account-money-box {
      float: left;
      padding: 28px 24px;
      width: 282px;
      height: 124px;
      border-radius: 2px;
      background-size: cover;
      .account-val {
        margin-top: 19px;
        height: 26px;
        line-height: 26px;
        font-size: 26px;
        font-weight: normal;
      }
    }
    .create-put {
      position: absolute;
      top: 73px;
      right: 30px;
      box-shadow: 3px 4px 14px 0px $color-shadow-7;
      border-radius: 2px;
    }
    &.no-data {
      height: calc(100vh - 305px);
      .description {
        font-size: 18px;
        color: #979eba;
      }
    }
    &.data_card {
      height: 110px;
      /deep/ .el-card__body {
        width: 100%;
        .card_list {
          width: 100%;
          display: flex;
          justify-content: space-around;

          div {
            text-align: center;
            span {
              font-size: 26px;
              font-weight: bold;
            }
            .blue {
              color: $color-origin-blue;
            }
            .red {
              color: $color-red;
            }
            p {
              margin-top: 20px;
              margin-left: 15px;
              i {
                display: inline-block;
                margin-left: 10px;
                width: 8px;
                height: 14px;
                background-size: cover;
                vertical-align: middle;
              }
            }
          }
        }
      }
    }
    &.line-echarts {
      width: 1200px;
      height: 540px;
      .line-echarts_change {
        margin-top: 15px;
        display: flex;
        justify-content: space-between;
        /deep/ .el-input {
          width: 114px;
        }
        .select_bar_line {
          width: 114px;
          margin: 0 1px;
        }
        .line-echarts_tip {
          margin-top: 15px;
          span {
            padding: 0 5px;
          }
          .red_bg {
            display: inline-block;
            margin: 0 3px;
            width: 10px;
            height: 10px;
            background: rgba(244, 74, 74, 1);
            border-radius: 2px;
          }
          .blue_bg {
            display: inline-block;
            margin: 0 3px;
            width: 10px;
            height: 10px;
            background: rgba(45, 90, 255, 1);
            border-radius: 2px;
          }
        }
      }
    }
    &.cases_broadcast {
      width: 390px;
      height: 540px;
      float: left;
      margin-bottom: 46px;
      /deep/ .el-carousel__arrow {
        color: $color-main;
        background-color: transparent;
        border: 1px solid $color-main;
        margin-top: 55px;
      }
      .el-carousel {
        margin-top: 40px;
        height: 460px;
        text-align: center;
        /deep/ .el-carousel__item {
          height: 440px;
        }

        /deep/ .el-carousel__indicators {
          bottom: 5px;
          .el-carousel__button {
            width: 10px;
            height: 10px;
            border-radius: 10px;
            background: #e1e1e1;
          }
          .el-carousel__button:hover {
            width: 10px;
            height: 10px;
            border-radius: 10px;
            background: rgba(244, 74, 74, 1);
          }
          .el-carousel__indicator.is-active button {
            background: rgba(244, 74, 74, 1);
          }
        }
        img {
          width: 240px;
          height: 424px;
        }
      }
    }
    &.news_list {
      width: 790px;
      height: 540px;
      float: right;
      .news_case_list {
        .news_case_item {
          margin-top: 45px;
          display: flex;
          cursor: pointer;
          .news_case_time {
            height: 66px;
            width: 80px;
            padding: 5px 15px;
            color: #cfcfcf;
            border: 1px solid rgba(244, 74, 74, 0);
            span {
              font-weight: bold;
              font-size: 18px;
            }
            p {
              margin-top: 10px;
            }
          }
          .news_case_content {
            padding-left: 15px;
            // border-left: 3px solid #ddd;
            p {
              color: #cfcfcf;
              margin: 8px 0 4px 0;
              line-height: 18px;
            }
          }
        }
        .news_case_item:hover {
          .news_case_time {
            color: rgba(244, 74, 74, 1);
            border: 1px solid rgba(244, 74, 74, 1);
          }
          .news_case_content {
            h4 {
              color: rgba(244, 74, 74, 1);
            }
          }
        }
      }
    }
    .logo {
      display: flex;
      float: right;
      width: 160px;
      height: 50px;
      background: url(../../../assets/images/logo_new.png) no-repeat;
      background-size: 100%;
      margin-bottom: 15px;
    }
  }
  .play-dialog-video {
    /deep/ .el-dialog {
      margin-top: 8vh !important;
    }
    /deep/ .el-dialog__header {
      display: none;
    }
    /deep/ .el-dialog__body {
      padding: 0;
    }
  }
}
</style>
