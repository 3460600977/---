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

        <div class="normal-box">
          <pieHollowGroup
            width="100%"
            height="100%"
            :color="colors"
            :data="genderArr"
            :title="titles.gender"
          />
        </div>

        <div class="normal-box">
          <histogram
            width="100%"
            height="100%"
            :color="colorType[2]"
            :data="ageData"
            :isShowTitle="isShowTitle"
            :title="titles.age"
          />
        </div>

        <div class="normal-box">
          <histogram
            width="100%"
            height="100%"
            :color="colorType[2]"
            :data="educationData"
            :isShowTitle="isShowTitle"
            :title="titles.education"
          />
        </div>

        <div class="normal-box">
          <histogram
            width="100%"
            height="100%"
            :color="colorType[2]"
            :data="consumeData"
            :title="titles.consume"
          />
        </div>

        <div v-if="privateCarData.length > 0" class="normal-box">
          <pieHollowDouble
            width="100%"
            height="100%"
            :color="colorType[2]"
            :data="privateCarData"
            :title="titles.privateCar"
          />
        </div>

      </div>

    </el-card>


    <!-- 线下消费指数 -->
    <el-card v-if="offlineConsumptionData.xAxis.length > 0" class="box-card">
      <div class="report-form-title">线下消费指数</div>
      <div class="big-box">
        <histogram
          width="100%"
          height="100%"
          :color="colorType[2]"
          :data="offlineConsumptionData"
        />
      </div>
    </el-card>


    <!-- 社区兴趣爱好指数 -->
    <el-card v-if="interestData.xAxis.length > 0" class="box-card">
      <div class="report-form-title">社区兴趣爱好指数</div>
      <div class="big-box">
        <histogram
          width="100%"
          height="100%"
          :color="colorType[2]"
          :data="interestData"
        />
      </div>
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
      loading: false,
      result: {},
      peopleType: '',
      headerTags: [],
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
      privateCarData: [],

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
            {name: '运动型人群包', value: 0.54},
            {name: '全网人群', value: 0.38},
            {name: '运动型人群包', value: 0.24},
            {name: '全网人群', value: 0.17},
        ],

      colors : [
        ['rgba(244, 102, 74, 1)', 'rgba(236, 236, 236, 1)'],
        ['rgba(91, 126, 255, 1)', 'rgba(236, 236, 236, 1)'],
        ['rgba(244, 102, 74, 1)', 'rgba(236, 236, 236, 1)'],
        ['rgba(91, 126, 255, 1)', 'rgba(236, 236, 236, 1)']
      ],
      titles: {
        "gender":"男女",
        "age":"年龄分布",
        "education":"学历",
        "consume":"收入水平",
        "privateCar":"车产状况",
        "marriage":"婚姻状况",
      }


    };
  },
  created() {
    this.search();
  },
  methods: {
    search() {
      let id= this.$route.query.id;
      this.loading = true;
      this.$api.peopleInsight.getPeopleAlalysis({id:id}).then( res => {
        this.loading = false;
        this.result = res.result;
        this.peopleType = res.result.crowdInsightName;
        this.headerTags = JSON.parse(res.result.tagName);
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
          this[item.name].xAxis = piVO[item.key].map(item => item.tag);
          let yData = piVO[item.key].map(item => item.value);
          let country = wholePiVO[item.key].map(item => item.value);
          this[item.name].yAxis[0].data = yData;
          this[item.name].yAxis[1].data = country;
        });
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
        piVO['genderDist'].forEach((gender,gIndex)=>{

        });
        this.genderArr.push()


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
