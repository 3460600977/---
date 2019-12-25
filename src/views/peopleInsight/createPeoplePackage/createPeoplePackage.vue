<template>
    <div class="container mid-row">
      <div class="left-container flex1 mid-column">
        <p class="title bold">创建人群包</p>
        <div class="flex1 mid-row">
          <div class="left-tab">
            <left-tab
              :tabData="tabData"
              :activeTab="activeTab"
              @changeTab="changeTab"
            ></left-tab>
          </div>
          <div class="left-content">

          </div>
        </div>
      </div>
      <div class="right-container flex1">
        <p class="title bold">已选条件</p>
        <div class="condition">
          <conditions :data="conditions"></conditions>
        </div>
        <div>
          <el-form label-position="top" :model="formLabelAlign">
            <el-form-item label="*人群包名称：">
              <el-input v-model="formLabelAlign.name"></el-input>
            </el-form-item>
            <el-form-item label="人群包描述：">
              <el-input v-model="formLabelAlign.text"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
</template>

<script>
  import leftTab from "./leftTab";
  import conditions from "./conditions";
  export default {
    name: "createPeoplePackage",
    components: {
      leftTab,
      conditions
    },
    data() {
      return {
        activeTab: 0,
        formLabelAlign: {
          name: '',
          text: ''
        },
        conditions: [
          {
            title: '城市：',
            data: [
              {name: '全国', value: 0}
            ]
          }
        ],
        tabData: [
          {name: '人口属性', value: 0},
          {name: '位置属性', value: 1},
          {name: '兴趣爱好', value: 2},
          {name: '行业消费', value: 3},
        ]
      }
    },
    methods: {
      changeTab(item) {
        this.activeTab = item.value
      },
    },
  }
</script>

<style scoped lang='scss'>
.container {
  padding: 20px;
  .right-container{
    background: #ffffff;
    border-radius:4px;
    margin-left: 20px;
    height: 100%;
    .condition {
      padding: 0 30px;
      border-bottom: 1px solid $color-border;
    }
  }
  .left-container {
    background: #ffffff;
    height: 100%;
    border-radius:4px;
    .left-content {
      padding: 0 50px;
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
