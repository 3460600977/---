<template>
  <div class="report-center">
    <left-menu-list :leftMenuList="leftMenuList"></left-menu-list>
    <div class="right-content">
      <!-- 报表中心 列表内容 -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import LeftMenuList from "../../../components/LeftMenuList";

export default {
  name: "reportIndex",
  components: {
    LeftMenuList
  },
  data() {
    return {
      leftMenuList: {
        first_name: "投放报表",
        first_path: "/reportList",
        menu_index: 0,
        menu_icon_show: false,
        menu_icon: require("../../../assets/iconImg/icon_Management@2x.png"),
        menu: [
          {
            name: "投放报表",
            sub_menu: [
              {
                name: "投放计划报表",
                path: "/reportList/plan"
              },
              {
                name: "投放方案报表",
                path: "/reportList/project"
              }
            ]
          }
        ]
      }
    };
  }
};
</script>

<style  lang="scss">
.report-center {
  height: 100%;
  display: flex;
  flex-direction: row;
  background-color: $color-bg;
  overflow-x: hidden;
  .right-content {
    padding: 20px 20px 0;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    flex-grow: 1;
  }
  #chartBox {
    height: 250px;
    width: 100%;
  }
  .report-top-form {
    height: 160px;
    border-radius: 4px;
    background-color: $color-bg-3;
    padding: 30px 0 37px 38px;
    .report-divider {
      .el-divider {
        background-color: $color-main;
        border-radius: 2px;
        width: 3px;
        margin: 0 5px 0 0;
      }
      .report-form-title {
        font-size: 16px;
        font-weight: bold;
        color: $color-text;
      }
    }
    .report-query-form {
      margin-top: 41px;
      .el-range-separator {
        width: 10%;
      }
      .item-space-1 {
        margin: 0 47px 0 0;
      }
      .item-space-end {
        margin: 2px 20px 0 0;
      }
      .el-select .el-input .el-select__caret {
        color: $color-main;
      }
    }
  }
  .report-select-card {
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
    margin-top: 30px;
    .box-card {
      width: calc(20% - 20px);
      height: 120px;
      border-radius: 4px;
      background-color: $color-bg-3;
      display: inline-block;
      margin-left: 25px;
      color: $color-text;
      margin-top: 0;
      cursor: pointer;
      .el-card__body {
        display: table;
        height: 100%;
        width: 100%;
        padding: 0;
        .card-center {
          display: table-cell;
          vertical-align: middle;
          padding-left: 20%;
        }
      }
      .card_name {
        font-size: 14px;
        font-weight: 400;
        margin-bottom: 14px;
      }
      .card_value {
        font-size: 26px;
        font-weight: normal;
        font-family: DINMittelschrift;
      }
      &.select-box {
        background: $color-main;
        box-shadow: 0px 13px 27px 0px rgba(45, 90, 255, 0.25);
        color: $color-bg-3;
      }
    }
    .box-card:first-child {
      margin-left: 0;
    }
  }
  .report-bar-graph {
    background-color: $color-bg-3;
    border-radius: 4px;
    height: 100%;
    width: 100%;
    margin-top: 30px;
    position: relative;
    .select_bar {
      font-size: 14px;
      height: 40px;
      margin: 20px 0 0 28px;
    }
    .report-bar-graph-data {
      height: 531px;
      width: 100%;
    }
  }
  .report-result-list {
    margin-top: 30px;
    .report-head {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-content: flex-start;
      padding: 5px 30px;
      .download-data {
        width: 100px;
        font-size: 16px;
        font-weight: 400;
        color: $color-text;
        background-color: $color-bg-5;
        border-radius: 2px;
        padding: 8px 0;
      }
      .download-data:hover {
        color: $color-bg-3;
        background-color: $color-main;
      }
      .table-title {
        font-size: 16px;
        font-weight: bold;
        color: $color-table-title;
      }
    }
    .report-table {
      margin: 0;
      margin-bottom: 37px;
      background-color: $color-bg !important;
      table {
        width: 100%;
        text-align: center;
      }
      th {
        font-size: 14px;
        font-weight: bold;
        color: $color-table-title;
        background-color: $color-bg;
        border-bottom: 0;
      }
      td {
        border-top: 10px solid $color-bg;
        font-size: 16px;
        font-weight: normal;
        font-family: DINMittelschrift;
        color: $color-text;
        border-bottom: 0;
      }
      tr:first-child td {
        border-top: 0;
      }
      .project-id {
        font-size: 14px;
        font-weight: 400;
        color: $color-text;
        text-decoration: none;
        cursor: pointer;
      }
      tr td:nth-child(2) {
        font-size: 14px;
        font-weight: 400;
        color: $color-text;
      }
      tr td:last-child {
        border-radius: 4px;
      }
      tr:hover > td {
        background-color: $color-bg-3 !important;
      }
      tr > td {
        background-color: $color-bg-3 !important;
      }
      .report-time {
        font-size: 14px;
        font-weight: 400;
        color: $color-text;
        font-family: Microsoft YaHei;
      }
    }
  }
  .report-page {
    background-color: $color-bg-3;
    padding: 43px 0;
    text-align: center;
    border-radius: 4px;
    height: 120px;
    margin-top: 30px;
    li.active {
      background-color: $color-main !important;
    }
  }
}
</style>
