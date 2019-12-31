<template>
  <div class="container mid-column">
    <div class="flex1 clearfix">
      <div class="left-container float-left mid-column">
        <p class="title bold">创建人群包</p>
        <div class="flex1 mid-row">
          <div class="left-tab">
            <left-tab
              :tabData="tabData"
              :activeTab="activeTab"
              :seriesValue="seriesValue"
              @changeTab="changeTab"
            ></left-tab>
          </div>
          <div class="left-content">
            <keep-alive>
              <component :is="currentTabComponent"></component>
            </keep-alive>
<!--            <location-attr></location-attr>-->
<!--            <hobby></hobby>-->
<!--            <industry-consume></industry-consume>-->
          </div>
        </div>
      </div>
      <div class="right-container float-left">
        <p class="title bold">已选条件</p>
        <div class="condition">
          <conditions></conditions>
        </div>
        <div>
          <create-form></create-form>
        </div>
      </div>
    </div>
    <div class="flex-shrink">
      <back @handleBack="handleBack"></back>
    </div>
  </div>
</template>

<script>
  import leftTab from "../../../components/leftTab";
  import conditions from "./conditions";
  import Back from "../../../components/Back";
  import Hobby from "./Hobby";
  import locationAttr from "./locationAttr";
  import industryConsume from "./industryConsume";
  import demographicAttr from "./demographicAttr";
  import createForm from "./createForm";

  const seriesValue = 'tid';

  export default {
    name: "createPeoplePackage",
    components: {
      leftTab,
      Back,
      Hobby,
      createForm,
      locationAttr,
      industryConsume,
      demographicAttr,
      conditions
    },
    data() {
      return {
        activeTab: 0,
        seriesValue: seriesValue,
        tabData: [],
        currentTabComponent: '',
        tabMapping: {
          133: demographicAttr,
          105: locationAttr,
          42: Hobby,
          30000001: industryConsume
        },
      }
    },
    created() {
      this.$api.peopleInsight.getMenuList().then((data) => {
        this.tabData = data.result;
        this.activeTab = data.result[0][seriesValue]
      })
    },
    watch: {
      activeTab(val) {
        this.currentTabComponent = this.tabMapping[val]
      },
    },
    methods: {
      changeTab(item) {
        this.activeTab = item[seriesValue]
      },
      //回到之前的页面
      handleBack() {
        this.$router.push("/peopleInsight")
      },
    },
  }
</script>

<style scoped lang='scss'>
.container {
  padding: 1.04%;
  overflow-y: auto;
  line-height: 1.15;
  .right-container{
    background: #ffffff;
    border-radius:4px;
    margin-left: 1.06%;
    width: 34.04%;
    height: 100%;
    .condition {
      margin-top: 10px;
      border-bottom: 1px solid $color-border;
    }
  }
  .left-container {
    background: #ffffff;
    height: 100%;
    width: 64.89%;
    border-radius:4px;
    .left-content {
      padding: 0 4.9%;
      width: 100%;
      & /deep/ .label {
        width: 119px;
      }
      & /deep/ .content {
        max-width: 420px;
      }
    }
  }
  .title {
    font-size: 16px;
    padding-left: 30px;
    line-height: 50px;
  }
  .left-tab {
    width: 200px;
    height: 100%;
  }
}
</style>
