<template>
  <div class="people-alalysis" v-loading="loading">
    <!-- 人群分析 -->
    <headerCondition :peopleName="peopleType" :headerTags="headerTags"/>

    <!-- 地域分析 -->
    <arealDistribution :areasList="areasList"/>

    <!-- 常规属性 -->
    <el-card class="box-card area-distibution">
      <div class="report-form-title">常规属性</div>
      <div class="chart-box">
        <div class="normal-box">
          <pieHollowGroup
            width="100%"
            height="100%"
            :color="colors"
            :data="genderArr"
          >

          </pieHollowGroup>
        </div>

        <div class="normal-box">
          <histogram
            width="100%"
            height="100%"
            :color="colorType[2]"
            :data="ageData"
            :isShowTitle="isShowTitle"
            titleText="年龄分布"
          ></histogram>
        </div>

        <div class="normal-box">
          <histogram
            width="100%"
            height="100%"
            :color="colorType[2]"
            :data="educationData"
            :isShowTitle="isShowTitle"
            titleText="学历"
          ></histogram>
        </div>

        <div class="normal-box">
          <histogram
            width="100%"
            height="100%"
            :color="colorType[2]"
            :data="consumeData"
            :isShowTitle="isShowTitle"
            titleText="消费水平"
          ></histogram>
        </div>

        <div class="normal-box">
          <histogram
            width="100%"
            height="100%"
            :color="colorType[1]"
            :data="privateCarData"
          ></histogram>
        </div>

      </div>

    </el-card>


    <!-- 线下消费指数 -->
    <el-card class="box-card">
      <div class="report-form-title">线下消费指数</div>
      <div class="big-box">
        <histogram
          width="100%"
          height="100%"
          :color="colorType[2]"
          :data="offlineConsumptionData"
        ></histogram>
      </div>
    </el-card>


    <!-- 社区兴趣爱好指数 -->
    <el-card class="box-card">
      <div class="report-form-title">社区兴趣爱好指数</div>
      <div class="big-box">
        <histogram
          width="100%"
          height="100%"
          :color="colorType[2]"
          :data="interestData"
        ></histogram>
      </div>
    </el-card>


  </div>
</template>

<script>
import headerCondition from "./modeles/headerCondition";
import arealDistribution from "./modeles/arealDistribution";
import Histogram from "@/components/chart/Histogram.vue";
import pieHollowGroup from "@/components/chart/pieHollowGroup";

export default {
  components: {
    headerCondition,
    arealDistribution,
    Histogram,
    pieHollowGroup
  },
  data() {
    return {
      loading: false,
      result: {},
      peopleType: '',
      headerTags: [],
      areasList: { //地域分析
        provinceTa: [],
        cityTa: []
      },
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
      legendTitle: ['运动型人群包', '全网人群'],
      ageData: {
        xAxis: [],
        yAxis: [
          {
            "name": '运动型人群包',
            "type": "bar",
            "data": [],
            "barWidth": 18
          },
          {
            "name": "全网人群",
            "type": "bar",
            "data": [
            ],
            "barWidth": 18
          }
        ]
      },
      educationData: { //学历
        xAxis: [],
        yAxis: [
          {
            "name": '运动型人群包',
            "type": "bar",
            "data": [],
            "barWidth": 18
          },
          {
            "name": "全网人群",
            "type": "bar",
            "data": [
            ],
            "barWidth": 18
          }
        ]
      },
      consumeData: { //消费水平
        xAxis: [],
        yAxis: [
          {
            "name": '运动型人群包',
            "type": "bar",
            "data": [],
            "barWidth": 18
          },
          {
            "name": "全网人群",
            "type": "bar",
            "data": [
            ],
            "barWidth": 18
          }
        ]
      },
      privateCarData: {  //车产状况
        xAxis: [],
        yAxis: [
          {
            "name": '运动型人群包',
            "type": "bar",
            "data": [],
            "barWidth": 18
          },
          {
            "name": "全网人群",
            "type": "bar",
            "data": [
            ],
            "barWidth": 18
          }
        ]
      },

      offlineConsumptionData: {  //线下消费
        xAxis: [],
        yAxis: [
          {
            "name": "运动型人群包",
            "type": "bar",
            "data": [],
            "barWidth": 18
          },
          {
            "name": "全网人群",
            "type": "bar",
            "data": [],
            "barWidth": 18
          }
        ]
      },
      interestData: {  //社区兴趣
        xAxis: [],
        yAxis: [
          {
            "name": "运动型人群包",
            "type": "bar",
            "data": [],
            "barWidth": 18
          },
          {
            "name": "全网人群",
            "type": "bar",
            "data": [],
            "barWidth": 18
          }
        ]
      },

      genderArr: [
            {name: '男', value: 54},
            {name: '男-全国', value: 38},
            {name: '女', value: 24},
            {name: '女-全国', value: 17},
        ],

      colors : [
        ['rgba(244, 102, 74, 1)', 'rgba(236, 236, 236, 1)'],
        ['rgba(91, 126, 255, 1)', 'rgba(236, 236, 236, 1)'],
        ['rgba(244, 102, 74, 1)', 'rgba(236, 236, 236, 1)'],
        ['rgba(91, 126, 255, 1)', 'rgba(236, 236, 236, 1)']],


    };
  },
  created() {
    this.search();
  },
  methods: {
    search() {
      // let barY = [
      //   {
      //     "name": '运动型人群包',
      //     "type": "bar",
      //     "data": [],
      //     "barWidth": 18
      //   },
      //   {
      //     "name": "全网人群",
      //     "type": "bar",
      //     "data": [],
      //     "barWidth": 18
      //   }
      // ]
      let id= this.$route.query.id;
      this.loading = true;
      this.$api.peopleInsight.getPeopleAlalysis({id:id}).then( res => {
        this.loading = false;
        this.result = res.result;
        this.peopleType = res.result.crowdInsightName;
        this.headerTags = JSON.parse(res.result.tagName);
        this.areasList.provinceTa = res.result.provinceTa;
        this.areasList.cityTa = res.result.cityTa;

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
          {
            name: 'privateCarData',
            key: 'privateCarDist'
          },
          {
            name: 'offlineConsumptionData',
            key: 'offlineConsumption'
          },
          {
            name: 'interestData',
            key: 'interestDist'
          }
        ];
        barAarr.forEach(item => {
          //console.log(this[item.name])
          this[item.name].xAxis = res.result.crowdInsightPoiVO[item.key].map(item => item.tag);
          let yData = res.result.crowdInsightPoiVO[item.key].map(item => item.value);
          let country = res.result.crowdInsightPoiVO.wholeNetworkPoiVO[item.key].map(item => item.value);
          this[item.name].yAxis[0].data = yData;
          this[item.name].yAxis[1].data = country;
        })

      }).catch(res => {
        this.loading = false;
      })
    }
  }
};
</script>

<style lang="scss">
.people-alalysis {
  padding: 0 20px 20px;
  .area-distibution{
    .chart-box{
      margin: 0 -20px;
      .normal-box{
        float: left;
        width:30%;
        height:306px;
        margin: 20px;
        border:1px solid rgba(236,236,236,1);
      }
    }
  }
  .big-box{
    width:1880px;
    height:400px;
    border-radius:4px;
  }
}
</style>
