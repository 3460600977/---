<template>
  <div class="right-info-wrapper mid-column">
    <!--      <p class="font-16">投放预算</p>-->
    <!--      <div class="mid-between color-text-1 margin2">-->
    <!--        <span>低</span>-->
    <!--        <el-slider-->
    <!--          class="flex1 slider"-->
    <!--          v-model="val"-->
    <!--          @change="budgetChange"-->
    <!--          :format-tooltip="formatTooltip"-->
    <!--        ></el-slider>-->
    <!--        <span>高</span>-->
    <!--      </div>-->
    <div class="padding padding1">
      <p class="margin1 bold">投放预估数</p>
      <ul class="desc">
        <li class="mid-start">
          <p class="label">楼盘数</p>
          <p class="font-number font-16">{{selectedBuildings.length | toThousands}}个</p>
        </li>
        <li class="mid-start">
          <p class="label">单元数</p>
          <p class="font-number font-16">{{unitNum | toThousands}}个</p>
        </li>
        <li class="mid-start">
          <p class="label">点位数</p>
          <p class="font-number font-16">{{deviceCount | toThousands}}个</p>
        </li>
        <li class="mid-start">
          <p class="label">覆盖人数</p>
          <p class="font-number font-16">{{coveredPeople | toThousands}}人</p>
        </li>
      </ul>

      <div class="mid-between margin1">
        <p class="bold">媒体资源</p>
        <el-button type="primary" plain icon="el-icon-plus" @click="addBtnClick">添加</el-button>
      </div>
    </div>
    <ul class="list margin2 border-bottom flex1 customScroll">
      <li class="list-item" v-for="(item, index) in selectedBuildings" :key="item.premisesId">
        <p>{{item.premisesName}}</p>
        <div class="mid-start list-item-2">
          <p class="list-item-1">点位数：{{item.signElevatorNum | toThousands}}</p>
          <p>覆盖人数：{{item.totalPeople | toThousands}}</p>
        </div>
        <span class="iconfont icon-remove icon-error hand" @click="deleteItem(item)"></span>
      </li>
    </ul>
    <div class="right-bottom">
      <el-button class="map-btn" @click="hideMapPoint">取 消</el-button>
      <el-button class="map-btn" type="primary" @click="submitSelectedBuildPoint">保存</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "mapRightInfo",
  props: {
    selectedBuildings: {
      type: Array,
      required: true
    },
    cityFilter: {
      type: Object
    }
  },
  data() {
    return {
      val: 0,
      maxVal: 100,
      deviceCount: 0,
      coveredPeople: 0,
      unitNum: 0
    };
  },
  created() {
    this.renderDatas(this.selectedBuildings);
  },
  watch: {
    selectedBuildings(val) {
      this.renderDatas(val);
    }
  },
  methods: {
    //隐藏地图选点页面
    hideMapPoint() {
      this.$emit("hideMapPoint", false);
    },
    //选中的楼盘数据保存
    submitSelectedBuildPoint() {
      this.$emit(
        "submitSelectedBuildPoint",
        this.selectedBuildings,
        this.cityFilter
      );
      this.$emit("hideMapPoint", false);
    },
    renderDatas(arr) {
      this.deviceCount = 0;
      this.coveredPeople = 0;
      this.unitNum = 0;
      arr.forEach(item => {
        this.deviceCount += item.signElevatorNum;
        this.coveredPeople += item.totalPeople;
        this.unitNum += item.unitNum ? item.unitNum : 0;
      });
    },
    addBtnClick() {
      this.$emit("addBtnClick");
    },
    createPackage() {
      if (!this.selectedBuildings.length) {
        this.$message.error('没有选中的楼盘数据不能创建资源包！');
        return;
      }
      this.$emit("createPackage");
    },
    deleteItem(item) {
      this.$emit("deleteItem", item);
    }
  }
};
</script>

<style scoped lang='scss'>
.right-bottom {
  padding: 25px 20px 20px 20px;
  text-align: justify;
  text-align-last: justify;
  /deep/.el-button {
    width: 136px;
    height: 34px;
    border-radius: 2px;
  }
}
.padding {
  padding-left: 20px;
  padding-right: 20px;
}
.padding1 {
  padding-top: 10px;
}
.padding2 {
  padding-bottom: 15px;
}
.right-info-wrapper {
  width: 352px;
  position: relative;
  height: 100%;
  background: #fff;
  line-height: 1.15;
  /*padding: 20px 20px 15px;*/
  .slider-item {
    position: absolute;
    left: -40px;
    background-color: #fff;
    width: 40px;
    top: 50%;
    transform: translateY(23px);
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    z-index: 1;
  }
  .desc {
    color: $color-text-1;
    li {
      margin-top: 20px;
    }
    .label {
      width: 178px;
    }
  }
  .btn {
    width: 194px;
  }
  .list {
    overflow-y: auto;
    position: relative;
    padding-left: 20px;
    padding-bottom: 10px;
    .list-item-1 {
      width: 122px;
    }
    .list-item-2 {
      font-size: 12px;
      color: $color-text-1;
      margin-top: 10px;
    }
    .list-item {
      position: relative;
      margin-right: 20px;
      padding: 10px 20px 10px 30px;
      margin-bottom: 10px;
      border: 1px dashed $color-main;
      background: rgba(255, 255, 255, 1);
      .icon-remove {
        font-size: 18px;
        background: #ffffff;
        position: absolute;
        top: 50%;
        color: $color-main;
        z-index: 100;
        transform: translateY(-50%);
        right: -9px;
      }
    }
  }
  .slider {
    margin: 0 10px;
  }
  .margin1 {
    margin-top: 20px;
  }
  .margin2 {
    margin-top: 20px;
  }
}
</style>
