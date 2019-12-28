<template>
  <div>
    <div class="ul border-right hand">
      <p class="border-right ul-p" :class="isShow[0]?'active': ''" @click="toggle(0)">
        <span class="iconfont icon2 icon-ziyuan"></span>
        <span class="text">成都市</span>
        <span class="iconfont icon1 icon-icon-test" :class="isShow[0]?'icon-down': 'icon-up'"></span>
      </p>
      <p class="border-right ul-p" :class="isShow[1]?'active': ''" @click="toggle(1)">
        <span class="iconfont icon2 icon-icon-"></span>
        <span class="text">筛选</span>
        <span class="iconfont icon1 icon-icon-test" :class="isShow[1]?'icon-down': 'icon-up'"></span>
      </p>
    </div>
    <div class="city-select select-style" v-show="isShow[0]">
      <singleSelect-popup
        v-if="cityDatas.length"
        title="城市列表"
        :selectDatas="cityDatas"
        :filters="cityFilter"
        @hide="() => hide(0)"
        @returnResult="(val) => returnResult(val, 0)"
      ></singleSelect-popup>
    </div>
    <div class="filter-container select-style" v-show="isShow[1]">
      <filter-container

      ></filter-container>
    </div>
  </div>
</template>

<script>
  const CITY_MAPPING = {
    1: '一线城市:',
    2: '二线城市:',
    3: '三线城市:'
  }
  import filterContainer from "./filterContainer";
  import singleSelectPopup from "../../../components/map/singleSelectPopup";
  export default {
    name: "leftInfo",
    components: {
      singleSelectPopup,
      filterContainer
    },
    props: {
      cityFilter: {
        type: Object,
        required: true
      },
    },
    watch: {
      cityFilter() {
        // console.log('4444')
      },
    },
    data() {
      return {
        cityDatas: [],
        isShow: {
          0: false,
          1: false
        },
        isShowCity: true,
      }
    },
    created() {
      this.loadCitys()
    },
    methods: {
      returnResult(val, index) {
        console.log(val, index)
        this.$emit('returnResult', val, index)
      },
      hideAll () {
        for (let key in this.isShow) {
          this.isShow[key] = false
        }
      },
      toggle(val) {
        if (this.isShow[val]) {
          this.hide(val)
        } else {
          this.hideAll()
          this.isShow[val] = true
        }
      },
      hide(val) {
        this.isShow[val] = false
      },
      loadCitys() {
        this.$api.CityList.TypeList().then((data) => {
          if (data.result) {
            this.cityDatas = data.result.map((item) => {
              return {title: CITY_MAPPING[item.level], values: item.citys}
            })
          }
        })
      },
    },
  }
</script>

<style scoped lang='scss'>
  .ul {
    background:rgba(255,255,255,1);
    box-shadow:0px 3px 5px 0px rgba(0, 0, 0, 0.1);
    line-height: 50px;
  }
  .active {
    color: $color-main;
    .iconfont {
      color: $color-main;
    }
  }
  .icon-up {
    transform: rotate(-180deg);
  }
  .icon-down {
    transform: rotate(0deg);
  }
  .text {
    margin: 0 8px;
  }
  .icon1 {
    color: $color-split-line2;
    transition: 0.5s;
  }
  .icon2 {
    color: #ACACAC;
    font-size: 12px;
  }
  .ul-p {
    line-height: 20px;
    display: inline-block;
    vertical-align: middle;
    position: relative;
    padding: 0 10px;
  }
  .select-style {
    position: absolute;
    top: 60px;
  }
  .city-select {
    left: 0px;
  }
  .filter-container {
    left: 40px;
  }
</style>
