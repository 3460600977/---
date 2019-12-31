<template>
  <div class="people-alalysis">
    <!-- 人群分析 -->
    <headerCondition />

    <!-- 地域分析 -->
    <arealDistribution/>

    <!-- 常规属性 -->
    <el-card class="box-card area-distibution">
      <div class="report-form-title">常规属性</div>
      <div class="chart-box">
        <div class="normal-box">
          <histogram
            width="100%"
            height="100%"
            :color="colorType[2]"
            :data="ageArr"
          ></histogram>
        </div>

        <div class="normal-box">
          <histogram
            width="100%"
            height="100%"
            :color="colorType[2]"
            :data="ageArr"
          ></histogram>
        </div>

        <div class="normal-box">
          <histogram
            width="100%"
            height="100%"
            :color="colorType[2]"
            :data="ageArr"
          ></histogram>
        </div>

        <div class="normal-box">
          <histogram
            width="100%"
            height="100%"
            :color="colorType[2]"
            :data="ageArr"
          ></histogram>
        </div>

        <div class="normal-box">
          <histogram
            width="100%"
            height="100%"
            :color="colorType[1]"
            :data="ageArr"
          ></histogram>
        </div>

        <div class="normal-box">
          <histogram
            width="100%"
            height="100%"
            :color="colorType[1]"
            :data="ageArr"
          ></histogram>
        </div>
      </div>

    </el-card>


    <!-- 社区商品交易指数 -->
    <el-card class="box-card">
      <div class="report-form-title">社区商品交易指数</div>
      <div class="big-box">
        <histogram
          width="100%"
          height="100%"
          :color="colorType[2]"
          :data="ageArrBig"
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
          :data="ageArrBig"
        ></histogram>
      </div>
    </el-card>


  </div>
</template>

<script>
import headerCondition from "./modeles/headerCondition";
import arealDistribution from "./modeles/arealDistribution";
import Histogram from "@/components/chart/Histogram.vue";

export default {
  components: {
    headerCondition,
    arealDistribution,
    Histogram
  },
  data() {
    return {
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

      ageArr: {
        "xAxis": [
          "18以下",
          "18-24",
          "25-34",
          "35-44",
          "45-54",
          "55-64",
          "65以上"
        ],
        "yAxis": [
          {
            "name": "长信综合楼",
            "type": "bar",
            "data": [
              0.0434,
              0.2486,
              0.3137,
              0.2269,
              0.152,
              0.0126,
              0.0028
            ],
            "barWidth": 18
          },
          {
            "name": "成都市",
            "type": "bar",
            "data": [
              0.0573,
              0.1685,
              0.305,
              0.2182,
              0.2198,
              0.0258,
              0.0054
            ],
            "barWidth": 18
          }
        ]
      },

      ageArrBig: {
        "xAxis": [
          "18以下",
          "18-24",
          "25-34",
          "35-44",
          "45-54",
          "55-64",
          "65以上"
        ],
        "yAxis": [
          {
            "name": "长信综合楼",
            "type": "bar",
            "data": [
              0.0434,
              0.2486,
              0.3137,
              0.2269,
              0.152,
              0.0126,
              0.0028
            ],
            "barWidth": 18
          },
          {
            "name": "成都市",
            "type": "bar",
            "data": [
              0.0573,
              0.1685,
              0.305,
              0.2182,
              0.2198,
              0.0258,
              0.0054
            ],
            "barWidth": 18
          }
        ]
      }
                    
    };
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