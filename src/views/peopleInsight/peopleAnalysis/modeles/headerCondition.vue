<template>
  <el-card class="box-card">
    <div class="report-divider">
      <span class="report-form-title">人群分析</span>
    </div>
    
    <div class="condition-box">
      <div class="left-title color-text-1">人群包名称</div>
      <div class="right-content">
        运动型人群包
      </div>
    </div>

    <div class="condition-box">
      <div class="left-title color-text-1">人群包条件</div>
      <div class="right-content btn-list">

        <div class="condition-item-box">
          <span>城市：</span>
          <el-button>全国</el-button>
        </div>

        <div class="condition-item-box">
          <span>年龄：</span>
          <el-button>25-34岁</el-button>
          <el-button>35-44岁</el-button>
          <el-button>45-54岁</el-button>
        </div>

        <div class="condition-item-box">
          <span>教育水平：</span>
          <el-button>大专</el-button>
          <el-button>本科及以上</el-button>
        </div>

        <div class="condition-item-box">
          <span>车产：</span>
          <el-button>有车</el-button>
        </div>

        <div class="condition-item-box">
          <span>兴趣爱好：</span>
          <el-button>运动健身</el-button>
          <el-button>游泳跳水</el-button>
          <el-button>足球</el-button>
          <el-button>篮球</el-button>
          <el-button>羽毛球</el-button>
        </div>

      </div>
    </div>
    
  </el-card>
</template>

<style lang="scss" scoped>
.box-card{
  .report-divider {
    .report-form-title {
      font-size: 16px;
      font-weight: bold;
      color: $color-text;
    }
  }
  .condition-box{
    margin-top: 30px;
    display: flex;
    .left-title{
      width: 100px;
    }
    .right-content{
      .condition-item-box{
        float: left;
        margin-right: 30px;
        margin-top: 20px;
      }
      &.btn-list{
        margin-top: -30px;
      }
    }
  }
}
</style>