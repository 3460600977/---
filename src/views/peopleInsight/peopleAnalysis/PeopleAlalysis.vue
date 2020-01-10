<template>
  <div class="people-alalysis" v-loading="loading">
    <!-- 人群分析 -->
    <headerCondition :peopleName="peopleType" :headerTags="headerTags"/>

    <!-- 地域分析 -->
    <arealDistribution v-if="areasList !== null" :areasList="areasList"/>

    <!-- 常规属性 -->
    <el-card class="box-card area-distibution">
      <div class="report-form-title">常规属性</div>
      <div class="chart-box">

        <div v-if="genderArr.length > 0" class="normal-box">
          <img class="nannv-icon" :src="nanpvIcon">
          <pieHollowGroup
            width="100%"
            height="100%"
            :color="colors"
            :data="genderArr"
            :title="titles.gender"
            :legend="legendTitle"
          />
        </div>

        <div v-if="ageData.xAxis.length > 0" class="normal-box">
          <histogram
            width="100%"
            height="100%"
            :color="colorType[2]"
            :data="ageData"
            :isShowTitle="isShowTitle"
            :title="titles.age"
            :legend="legendTitle"
            :isShowLine="true"
          />
        </div>

        <div v-if="educationData.xAxis.length > 0" class="normal-box">
          <histogram
            width="100%"
            height="100%"
            :color="colorType[2]"
            :data="educationData"
            :isShowTitle="isShowTitle"
            :title="titles.education"
            :legend="legendTitle"
            :isShowLine="true"
          />
        </div>

        <div v-if="consumeData.xAxis.length > 0" class="normal-box">
          <histogram
            width="100%"
            height="100%"
            :color="colorType[2]"
            :data="consumeData"
            :title="titles.consume"
            :legend="legendTitle"
            :isShowLine="true"
          />
        </div>

        <div v-if="privateCarData.length > 0" class="normal-box">
          <pieHollowDouble
            width="100%"
            height="100%"
            :color="colorType[2]"
            :data="privateCarData"
            :title="titles.privateCar"
            :legend="legendTitle"
            :isShowLine="true"
          />
          <div style="position: relative;width: 100%">
            <p class="text" :style="{'left': positionType[2][0][0]}">{{legendTitle[0]}}</p>
            <p class="text" :style="{'left': positionType[2][1][0]}">{{legendTitle[1]}}</p>
          </div>
        </div>


      </div>

    </el-card>


    <!-- 社区商品交易指数 -->
    <el-card v-if="offlineConsumptionData.xAxis.length > 0" class="box-card">
      <!--<div class="report-form-title">社区商品交易指数</div>-->
      <div class="big-box">
        <histogram
          width="100%"
          height="100%"
          :title="titles.offlineConsumption"
          :color="colorType[2]"
          :data="offlineConsumptionData"
          :isShowLine="true"
          :grid="grid"
        />
      </div>
    </el-card>


    <!-- 社区兴趣爱好指数 -->
    <el-card v-if="interestDistData.xAxis.length > 0" class="box-card">
      <!--<div class="report-form-title">社区兴趣爱好指数</div>-->
      <div class="big-box">
        <histogram
          width="100%"
          height="100%"
          :title="titles.interest"
          :color="colorType[2]"
          :data="interestDistData"
          :isShowLine="true"
          :grid="grid"
        />
      </div>
    </el-card>

    <el-card class="btns padding text-right">
      <el-button  @click="toList">返回</el-button>
      <el-button type="primary"  @click="toSelectPoint">新建资源包</el-button>
    </el-card>


  </div>
</template>

<script>
import headerCondition from "./modeles/headerCondition";
import arealDistribution from "./modeles/arealDistribution";
import Histogram from "@/components/chart/Histogram.vue";
import pieHollowGroup from "@/components/chart/pieHollowGroup";
import pieHollowDouble from "@/components/chart/pieHollowDouble";

export default {
  components: {
    headerCondition,
    arealDistribution,
    Histogram,
    pieHollowGroup,
    pieHollowDouble
  },
  data() {
    return {
      id:0,
      loading: false,
      result: {},
      peopleType: '',
      legendName: '',
      headerTags: [],
      cityCode: '',
      areasList: null,
      isShowTitle: true,
      colorType: {
        0: [
          {
            type: "radial",
            x: 0,
            y: 0,
            r: 1,
            colorStops: [
              {
                offset: 0,
                color: "#FF6A89" // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#FACE62" // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          },
          {
            type: "radial",
            x: 0,
            y: 0,
            r: 1,
            colorStops: [
              {
                offset: 0,
                color: "#FF8A81" // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#FF2E5C" // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        ],
        1: [
          {
            type: "radial",
            x: 0,
            y: 0,
            r: 1,
            colorStops: [
              {
                offset: 0,
                color: "#5F81FF" // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#2D5AFF" // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          },
          {
            type: "radial",
            x: 0,
            y: 0,
            r: 1,
            colorStops: [
              {
                offset: 0,
                color: "#FACE62" // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#F08D6B" // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        ],
        2: [
          {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(251,180,103,1)" // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(250,126,82,1)" // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          },
          {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(250,206,98,1)" // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(254,217,42,1)" // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        ],
        3: [
          {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#FBB467" // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#FA7E52" // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        ],
        4: [
          {
            type: "linear",
            x: 1,
            y: 0,
            x2: 0,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: "rgba(251,180,103,1)" // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(250,126,82,1)" // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          },
          {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(250,206,98,1)" // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(254,217,42,1)" // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        ]
      },
      legendTitle: [],
      ageData: {
        xAxis: [],
        yAxis: [
          {
            "name": "",
            "type": "bar",
            "data": [],
            "barWidth": '35%',
            "barGap": '10%',
          },
          {
            "name": "全网人群",
            "type": "bar",
            "data": [
            ],
            "barWidth": '35%',
            "barGap": '10%',
          }
        ]
      },
      educationData: { //学历
        xAxis: [],
        yAxis: [
          {
            "name": "",
            "type": "bar",
            "data": [],
            "barWidth": '16%',
            "barGap": '10%',
          },
          {
            "name": "全网人群",
            "type": "bar",
            "data": [
            ],
            "barWidth": '16%',
            "barGap": '10%',
          }
        ]
      },
      consumeData: { //消费水平
        xAxis: [],
        yAxis: [
          {
            "name": "",
            "type": "bar",
            "data": [],
            "barWidth": '16%',
            "barGap": '10%',
          },
          {
            "name": "全网人群",
            "type": "bar",
            "data": [
            ],
            "barWidth": '16%',
            "barGap": '10%',
          }
        ]
      },
      privateCarData: [],
      nanpvIcon: require('@/assets/images/nannv.png'),
      offlineConsumptionData: {  //线下消费
        xAxis: [],
        yAxis: [
          {
            "name": "",
            "type": "bar",
            "data": [],
            "barWidth": '25%',
            "barGap": '20%',
          },
          {
            "name": "全网人群",
            "type": "bar",
            "data": [],
            "barWidth": '25%',
            "barGap": '20%',
          }
        ]
      },
      interestDistData: {  //社区兴趣
        xAxis: [],
        yAxis: [
          {
            "name": "",
            "type": "bar",
            "data": [],
            "barWidth": '20%',
            "barGap": '20%',
          },
          {
            "name": "全网人群",
            "type": "bar",
            "data": [],
            "barWidth": '20%',
            "barGap": '20%',
          }
        ]
      },
      genderArr: [],
      colors : [
        ['rgba(244, 102, 74, 1)', 'rgba(236, 236, 236, 1)'],
        ['rgba(91, 126, 255, 1)', 'rgba(236, 236, 236, 1)'],
        ['rgba(244, 102, 74, 1)', 'rgba(236, 236, 236, 1)'],
        ['rgba(91, 126, 255, 1)', 'rgba(236, 236, 236, 1)']
      ],
      titles: {
        "gender":"性别",
        "age":"年龄分布",
        "education":"学历",
        "consume":"收入水平",
        "privateCar":"车产状况",
        "marriage":"婚姻状况",
        "offlineConsumption":"社区商品交易排行",
        "interest":"社区兴趣爱好排行",
      },
      positionType: {
        2: [
          ['29%', '55%'],
          ['69%', '55%']
        ]
      },
      grid:{
        left: '3%',
        right: '3%',
        bottom: 22,
      },
    };
  },
  created() {
    this.search();
  },
  methods: {
    search() {
      this.id= this.$route.query.id;
      this.loading = true;
      this.$api.peopleInsight.getPeopleAlalysis({id:this.id}).then( res => {
        this.loading = false;
        this.result = res.result;
        this.legendName = this.peopleType = res.result.crowdInsightName;
        this.headerTags = JSON.parse(res.result.tagName);
        this.cityCode = res.result.cityCode;
        if(this.legendName.length > 20){
          this.legendName = this.legendName.substring(0,20) + '...';
        }
        this.legendTitle = [this.legendName,"全网人群"];
        let obj = {};
        obj.provinceTa = res.result.provinceTa;
        obj.cityTa = res.result.cityTa;
        this.areasList = {...obj};

        let piVO = res.result.crowdInsightPoiVO;
        let wholePiVO = res.result.crowdInsightPoiVO.wholeNetworkPoiVO;

        let barAarr = [
          {
            name: 'ageData',
            key: 'ageDist'
          },
          {
            name: 'educationData',
            key: 'educationDist'
          },
          {
            name: 'consumeData',
            key: 'consumptionDist'
          },
         /* {
            name: 'privateCarData',
            key: 'privateCarDist'
          },*/
          /*{
            name: 'offlineConsumptionData',
            key: 'offlineConsumption'
          },*/
         /* {
            name: 'interestDistData',
            key: 'interestDist'
          }*/
        ];
        barAarr.forEach(item => {
          this[item.name].xAxis = piVO[item.key].map(item => item.tag);
          let yData = piVO[item.key].map(item => item.value);
          let country = wholePiVO[item.key].map(item => item.value);
          this[item.name].yAxis[0].data = yData;
          this[item.name].yAxis[0].name = this.legendName;
          this[item.name].yAxis[1].data = country;
        });



        if (piVO['offlineConsumption'].length > 0) {

          this.downSort('offlineConsumption',piVO,wholePiVO);
        }

        if (piVO['interestDist'].length > 0) {
          this.downSort('interestDist',piVO,wholePiVO);
        }

        //车产
        piVO['privateCarDist'].forEach((itemOther,index)=>{
          itemOther.name = itemOther.tag;
          wholePiVO['privateCarDist'][index].name = wholePiVO['privateCarDist'][index].tag;
          piVO['genderDist'][index].name = piVO['genderDist'][index].tag;
          wholePiVO['genderDist'][index].name = wholePiVO['genderDist'][index].tag;
        });
        this.privateCarData.push(piVO['privateCarDist']);
        this.privateCarData.push(wholePiVO['privateCarDist']);
        this.privateCarData.name = this.legendTitle;

        //gender
        let man = [];
        let woman = [];
        piVO['genderDist'].forEach(g=>{
          g.name = this.legendName;
          if (g.tag === '女') {
            man.push(g)
          }else {
            woman.push(g)
          }
        });
        wholePiVO['genderDist'].forEach(gw=>{
          gw.name = '全网人群';
          if (gw.tag === '女') {
            man.push(gw)
          }else {
            woman.push(gw)
          }
        });
        this.genderArr = man.concat(woman);

      }).catch(res => {
        this.loading = false;
      })
    },
    toList() {
      this.$router.push('/peopleInsight/list')
    },
    toSelectPoint() {
      let cityName = '';
      let cityFilter = {};
      let crowdInfo = {};
      this.headerTags.forEach(tag=>{
        if (tag.name === "城市"){
          cityName = tag.tags[0].name;
        }
      });
      cityFilter.cityCode = Number(this.cityCode);
      cityFilter.name = cityName;
      crowdInfo.id = this.id;
      crowdInfo.name = this.peopleType;
      this.$router.push({
        path:'/cityInsight/selectPoint',
        query:{data: JSON.stringify({cityFilter:cityFilter,crowdInfo:crowdInfo})}
      });
    },
    downSort(data,piVO,wholePiVO) {
      let voArray = [];
      piVO[data].forEach((pivo,indexPi)=>{
        voArray.push({
          'name':pivo.tag,
          'city':pivo.value,
          'whole':wholePiVO[data][indexPi].value
        })
      });
      voArray.sort(function (a,b) {
        return (b.city - a.city)
      });
      for (let i =0;i<voArray.length;i++){
        if (i > 9){
          break;
        }
        this[data+'Data'].xAxis.push(voArray[i].name);
        this[data+'Data'].yAxis[0].name = this.legendName;
        this[data+'Data'].yAxis[0].data.push(voArray[i].city);
        this[data+'Data'].yAxis[1].data.push(voArray[i].whole);
      }
    }
  }
};
</script>

<style lang="scss">
.people-alalysis {
  padding: 0 20px 20px;
  .area-distibution{
    .chart-box{
      position: relative;
      margin: 0 -20px;
      .normal-box{
        float: left;
        width:30%;
        height:306px;
        margin: 10px 10px 20px 10px;
        border:1px solid rgba(236,236,236,1);
      }
      .text {
        color: $color-text-1;
        position: absolute;
        bottom: 20px;
        display: inline-block;
        transform: translateX(-50%);
      }
      .left {
        width: 290px;
        .img {
          width: 100%;
          height: 180px;
          background: red;
        }
        .ul {
          font-size: 0;
          li {
            display: inline-block;
            font-size: 14px;
            text-align: center;
          }
          .color-text-1 {
            margin-top: 10px;
            font-weight: 400;
          }
        }
      }
      .nannv-icon{
        position: absolute;
        top: 109px;
        left: 86px;
        width: 30px;
      }
    }
  }
  .big-box{
    //width:100%;
    height:400px;
    //border-radius:4px;
  }
  .el-card{
    margin-top: 15px;
  }
}

</style>
