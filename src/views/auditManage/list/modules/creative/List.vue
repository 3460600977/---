<template>
  <div class="creative-list">
    <div class="report-top-form">
      <div class="report-divider">
        <p class="db-title">创意审核</p>
      </div>
      <el-form :inline="true" :model="auditList" class="report-query-form">
        <el-form-item class="item-space-1">
          <el-input v-model.trim="auditList.name" clearable placeholder="请输入创意名称"></el-input>
        </el-form-item>
        <el-form-item class="item-space-end">
          <el-select
            v-model="auditList.statusName"
            placeholder="全部状态"
            @change="changeCreativeStatus"
            clearable
          >
            <el-option
              v-for="(check,checkIndex) in creativeStatus"
              :key="checkIndex"
              :label="check.label"
              :value="check.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="submitCreativeList">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="query_result">
      <el-table
        :data="reviewCreativeList.data"
        v-loading="reviewCreativeList.loading"
        class="list_table"
      >
        <el-table-column
          :min-width="getColumnWidth(colIndex)"
          :prop="col.prop"
          :label="col.label"
          v-for="(col,colIndex) in reviewCreativeList.column"
          :key="colIndex"
          :fixed="getLastPosition(colIndex)"
        >
          <template slot-scope="scope">
            <div v-if="col.prop === 'status'">
              <span v-if="scope.row[scope.column.property] === 0">待审核</span>
              <span v-if="scope.row[scope.column.property] === 2">审核通过</span>
              <span v-if="scope.row[scope.column.property] === 1" class="deny status">审核拒绝</span>
            </div>
            <div v-else-if="col.prop === 'screenType'">
              <div v-if="parseInt(scope.row.screenType) === 1">
                <span>上屏</span>
              </div>
              <div v-else-if="parseInt(scope.row.screenType)  === 2">
                <span>下屏</span>
              </div>
              <div v-else-if="parseInt(scope.row.screenType)  === 3">
                <span>联动</span>
              </div>
              <div v-else>
                <span>暂无</span>
              </div>
            </div>
            <div v-else-if="col.prop === 'action'">
              <div v-if="scope.row.status === 0">
                <span class="icon-space" @click="passCreative(scope.row.id,scope.row.name)">
                  <i class="iconfont icon--zhengque-shiti icon-color"></i>通过
                </span>
                <span class="icon-space" @click="denyCreative(scope.row.id,scope.row.name)">
                  <i class="iconfont icon-error icon-color"></i>拒绝
                </span>
              </div>
            </div>
            <div v-else-if="col.prop === 'creativeContent'">
              <div
                class="show-contents"
                @click="showContent(scope.row.id); detailDialogMsg = scope.row;"
              >
                <span>查看</span>
              </div>
            </div>
            <div v-else>{{scope.row[scope.column.property]}}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="report-page">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        :page-sizes="pageSizeSelectable"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        class="list-page"
      ></el-pagination>
    </div>

    <el-dialog
      width="1000px"
      title="审核拒绝"
      :visible.sync="dialogDenyVisible"
      class="deny-dialog dialog-mid dialog-height-80"
    >
      <el-form :model="denyFrom" class="deny-from">
        <el-form-item
          :label-width="formLabelWidth"
          v-for="(denyItem,denyIndex) in DenyDialogReason"
          :key="denyIndex"
          :denyIndex="denyIndex"
        >
          <h3 class="deny-title">{{denyIndex+1+'、'+denyItem.title}}</h3>
          <div
            class="deny-reson"
            :class="{'text-danger':reason.select}"
            @click="chooseButton(denyIndex,reasonIndex)"
            v-for="(reason,reasonIndex) in denyItem.reasons"
            :key="reasonIndex"
          >
            <div :label="denyIndex +'-'+ reasonIndex" :checked="reason.select">{{reason.value}}</div>
          </div>
        </el-form-item>
      </el-form>

      <textarea
        maxlength="100"
        name="remarks"
        class="choose-deny-list"
        placeholder="审核意见"
        required="required"
        v-model="submit.rejectReason"
        @input="changeDenyArea"
      ></textarea>
      <p v-if="showTextArea" class="rejectError">请输入拒绝原因</p>
      <p class="rejectLength">
        还可输入
        <span>{{100 - submit.rejectReason.length}}</span>个字
      </p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDenyVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitDenyCreative()"
          :loading="submitCreative.loading"
        >确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      width="1000px"
      title="创意内容"
      :visible.sync="dialogShowContent"
      class="creative-dialog dialog-mid dialog-height-80"
    >
      <el-tabs v-model="activeName">
        <div
          class="no-pass"
          v-if="detailDialogMsg.status === 1 && detailDialogMsg.rejectReason&&activeName==='aptitude'"
        >
          <img class="no-pass-img" :src="noPassImg" alt srcset />
          <div>{{JSON.parse(detailDialogMsg.rejectReason).join(',')}}</div>
        </div>
        <el-tab-pane label="创意资质" name="aptitude" class="aptitude">
          <div v-for="(aItem,aIndex) in reviewCreativeDetail.data" :key="aIndex" class="text-col">
            <span class="text-title">{{aItem.label}}</span>
            <div class="demo-image__preview" v-if="aItem.label==='创意资质'">
              <div v-if="aItem.value!==null">
                <el-image
                  v-for="(item, index) in aItem.value"
                  :key="index"
                  style="width: 100px; height: 158px;border-radius: 2px;margin-right:10px"
                  :src="item"
                  :preview-src-list="aItem.value"
                ></el-image>
              </div>
              <div class="color-text-1" v-else>未上传</div>
            </div>
            <label class="text-info" v-else>{{aItem.value}}</label>
          </div>
        </el-tab-pane>
        <el-tab-pane label="创意素材" name="material" class="material">
          <el-row :gutter="20">
            <el-col :span="12">
              <div
                class="top-screen"
                v-if="downloadCreative.data.screenType==='001'||downloadCreative.data.screenType==='003'"
              >
                <p>上屏</p>
                <div class="top-screen-box">
                  <preview-top-box
                    :innerWidth="324"
                    :top="downloadCreative.data.topList.pre"
                    class="top-screen-pre"
                    v-if="dialogShowContent&&activeName==='material'"
                  ></preview-top-box>
                </div>
                <p>
                  <a
                    :href="downloadCreative.data.topList.downloadUrl"
                    :download="downloadCreative.data.topList.downloadUrl"
                    class="topDownVideo"
                  >下载视频</a>
                </p>
              </div>
            </el-col>
            <el-col :span="12">
              <div
                class="bottom-screen"
                v-if="downloadCreative.data.screenType==='002'||downloadCreative.data.screenType==='003'"
              >
                <p>下屏</p>
                <div class="bottom-screen-box">
                  <div class="left-pre">
                    <el-image
                      style="width: 100%; height: 100%"
                      fit="cover"
                      :src="downloadCreative.data.downList.url1"
                      :preview-src-list="downloadCreative.data.downList.strList1"
                    ></el-image>
                  </div>
                  <div class="right-pre">
                    <el-image
                      style="width: 100%; height: 100%"
                      fit="cover"
                      :src="downloadCreative.data.downList.url2"
                      :preview-src-list="downloadCreative.data.downList.strList2"
                    ></el-image>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
const PAGE_SIZE = [10, 20, 30, 40, 50];
import { DenyDialogReason } from "../../../../../utils/static";
import PreviewTopBox from "../../../../../components/PreviewTopBox";

export default {
  name: "auditList",
  components: {
    PreviewTopBox
  },
  data() {
    return {
      showTextArea: false,
      DenyDialogReason,
      checkReason: [],
      checkReasonHistory: [],
      downloadVideoSrc: "",
      activeName: "aptitude",
      dialogDenyVisible: false,
      dialogShowContent: false,
      formLabelWidth: "120px",
      currentPage: 50,
      noPassImg: require("@/assets/images/icon_not_passed.png"),
      checkFormInline: {
        selectCreativeName: "",
        selectCreativeStatus: ""
      },
      //屏幕类型
      screenTypeList: [
        { id: "001", type: "上屏" },
        { id: "002", type: "下屏" },
        { id: "003", type: "联动" }
      ],
      //创意审核列表
      reviewCreativeList: {
        data: null,
        loading: false,
        column: [
          { label: "创意组ID", prop: "id" },
          { label: "创意内容", prop: "creativeContent" },
          { label: "创意名称", prop: "name" },
          { label: "企业名称", prop: "companyName" },
          { label: "企业行业", prop: "companyIndustry" },
          { label: "创意行业", prop: "industry" },
          { label: "屏幕类型", prop: "screenType" },
          { label: "提交时间", prop: "createTime" },
          { label: "审核时间", prop: "reviewTime" },
          { label: "创意状态", prop: "status" },
          { label: "操作", prop: "action" }
        ]
      },
      creativeStatus: [
        { value: 0, label: "待审核" },
        { value: 1, label: "审核拒绝" },
        { value: 2, label: "审核通过" }
      ],
      //创意名称列表
      creativeNameList: {
        data: null,
        loading: false
      },
      //创意素材下载
      downloadCreative: {
        data: {
          screenType: 0,
          topList: { previewUrl: "", downloadUrl: "", pre: {} },
          downList: { strList1: [], url1: "", strList2: [], url2: "", pre: {} }
        },
        loading: false
      },
      //创意审核资质
      reviewCreativeDetail: {
        data: [
          { value: "新潮传媒集团", label: "企业名称", field: "companyName" },
          { value: "餐饮", label: "企业行业", field: "companyIndustry" },
          { value: "餐饮", label: "创意行业", field: "industry" },
          { value: "联动", label: "屏幕类型", field: "screenType" },
          {
            value: null,
            label: "创意资质",
            field: "industryIdentify",
            srcList: null
          }
        ],
        loading: false
      },
      //创意审核提交
      submitCreative: {
        data: null,
        loading: false
      },
      auditList: {
        id: "",
        name: "",
        status: "",
        statusName: "",
        rejectReason: ""
      },
      submit: {
        id: "",
        name: "",
        status: "",
        rejectReason: ""
      },
      denyFrom: {},
      totalCount: 0, // 总共条数
      pageSizeSelectable: PAGE_SIZE,
      resultData: null,
      pageIndex: 1,
      pageSize: 10,
      loading: false,

      detailDialogMsg: ""
    };
  },
  created() {
    this.getAuditCreativeList();
  },
  computed: {
    denyDialogReasonList: function() {
      let tmp = [];
      this.DenyDialogReason.forEach((item, itemIndex) => {
        item.reasons.forEach((reason, reasonIndex) => {
          tmp.push({
            name: reason.value,
            index: `${itemIndex}-${reasonIndex}`,
            select: false
          });
        });
      });
      tmp.forEach(denyItem => {
        this.checkReason.forEach(item => {
          if (denyItem.index === item) {
            denyItem.select = true;
          }
        });
      });
      return tmp;
    }
  },
  methods: {
    //查询创意
    submitCreativeList() {
      this.pageIndex = 1;
      this.getAuditCreativeList();
    },
    //远程模糊搜索创意名称，获取对应创意列表
    remoteCreativeName(query) {
      this.creativeNameList.loading = true;
      if (query !== "") {
        setTimeout(() => {
          let queryParam = {
            name: query
          };
          //请求方案报表列表查询接口
          this.$api.AuditCreative.getAuditCreativeList(queryParam)
            .then(res => {
              this.creativeNameList.loading = false;
              this.creativeNameList.data = res.result;
            })
            .catch(res => {
              this.creativeNameList.loading = false;
            });
        }, 200);
      } else {
        this.creativeNameList.data = [];
        this.creativeNameList.loading = false;
      }
    },
    //改变选择的创意名称
    changeCreativeName(val) {
      this.auditList.id = val;
      let changeObj = {};
      changeObj = this.creativeNameList.data.find(item => {
        return item.id === val;
      });
      this.auditList.name = changeObj.name;
    },
    //清空选择的创意名称
    clearCreativeName() {
      this.auditList.name = "";
      this.auditList.id = "";
    },
    //改变状态
    changeCreativeStatus(status) {
      this.auditList.status = status;
      let changeObj = {};
      changeObj = this.creativeStatus.find(item => {
        return item.value === status;
      });
      if (changeObj) {
        this.auditList.statusName = changeObj.label;
      } else {
        this.auditList.statusName = "";
      }
    },
    //获取审核创意列表
    getAuditCreativeList() {
      //必须参数
      let queryParam = {
        name: this.auditList.name,
        status: this.auditList.status,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      };
      //请求方案报表列表查询接口
      this.reviewCreativeList.loading = true;
      this.$api.AuditCreative.getAuditCreativeList(queryParam)
        .then(res => {
          this.reviewCreativeList.loading = false;
          this.totalCount = res.page.totalCount;
          res.result.forEach(item => {
            if (item.reviewTime === null || item.reviewTime === undefined) {
              item.reviewTime = "暂无";
            } else {
              item.reviewTime = this.$tools.formatDate(
                item.reviewTime,
                "yyyy-MM-dd hh:mm:ss"
              );
            }
            if (item.createTime === null || item.createTime === undefined) {
              item.createTime = "暂无";
            } else {
              item.createTime = this.$tools.formatDate(
                item.createTime,
                "yyyy-MM-dd hh:mm:ss"
              );
            }
            if (item.screenType === null || item.screenType === undefined) {
              item.screenType = -1;
            } else {
              item.screenType = parseInt(item.screenType);
            }
          });
          this.reviewCreativeList.data = res.result;
        })
        .catch(res => {
          this.reviewCreativeList.loading = false;
        });
    },
    // 审核创意素材下载
    downloadAuditCreative() {
      //必须参数
      let queryParam = {
        id: this.auditList.id
      };
      //请求方案报表列表查询接口
      this.downloadCreative.loading = true;
      this.$api.AuditCreative.downloadAuditCreative(queryParam)
        .then(res => {
          let videoList = res.result;
          this.downloadCreative.loading = false;
          if (videoList.top != null && 0 in videoList.top) {
            this.downloadCreative.data.topList = videoList.top[0];
            this.downloadCreative.data.topList.pre = {
              type: this.$tools
                .getType(videoList.top[0].previewUrl)
                .toLowerCase(),
              url: videoList.top[0].previewUrl
            };
          }
          if (videoList.down != null) {
            if (0 in videoList.down) {
              this.downloadCreative.data.downList.strList1 = [
                videoList.down[0].previewUrl
              ];
              this.downloadCreative.data.downList.url1 =
                videoList.down[0].previewUrl;
            }

            if (1 in videoList.down) {
              this.downloadCreative.data.downList.strList2 = [
                videoList.down[1].previewUrl
              ];
              this.downloadCreative.data.downList.url2 =
                videoList.down[1].previewUrl;
            }
          }
          this.downloadCreative.data.screenType = videoList.screenType;
        })
        .catch(res => {
          this.downloadCreative.loading = false;
        });
    },
    // 审核创意资质查看
    getAuditCreativeReviewDetail() {
      //必须参数
      let queryParam = {
        id: this.auditList.id
      };
      //请求方案报表列表查询接口
      this.reviewCreativeDetail.loading = true;
      this.$api.AuditCreative.getAuditCreativeReviewDetail(queryParam)
        .then(res => {
          this.reviewCreativeDetail.loading = false;
          let reviewList = res.result;
          let industryIdentify = JSON.parse(reviewList.industryIdentify);
          this.reviewCreativeDetail.data.forEach(item => {
            let property = item.field;
            if (reviewList.hasOwnProperty(property)) {
              if (property === "industryIdentify") {
                item.value = industryIdentify;
              } else if (property === "screenType") {
                let screenType = reviewList[property];
                this.screenTypeList.forEach((screen, index) => {
                  if (screen["id"] === screenType) {
                    item.value = screen["type"];
                  }
                });
              } else if (
                reviewList[property] === "" ||
                reviewList[property] === null
              ) {
                item.value = 0;
              } else {
                item.value = reviewList[property];
              }
            }
          });
        })
        .catch(res => {
          this.reviewCreativeDetail.loading = false;
        });
    },
    //点击通过,创意变为通过
    passCreative(id, name) {
      this.submit.id = id;
      this.submit.status = 2;
      this.submit.rejectReason = "";
      this.submit.name = name;
      this.submitAuditCreative(name);
    },
    //点击拒绝,创意变为拒绝
    denyCreative(id, name) {
      this.submit.id = id;
      this.submit.status = 1;
      this.submit.name = name;
      this.dialogDenyVisible = true;
      this.checkReason = [];
      this.checkReasonHistory = [];
      this.submit.rejectReason = "";
      this.DenyDialogReason.forEach(reasonsList => {
        reasonsList.reasons.forEach(item => {
          item.select = false;
        });
      });
    },
    //文本输入框，输入了文字
    changeDenyArea(val) {
      if (this.showTextArea) {
        this.showTextArea = false;
      }
    },

    //用户选择拒绝原因按钮
    chooseButton(denyIndex, reasonIndex) {
      if (this.showTextArea) {
        this.showTextArea = false;
      }
      if (this.submit.rejectReason === "") {
        this.submit.rejectReason = this.DenyDialogReason[denyIndex].reasons[
          reasonIndex
        ].value;
        this.DenyDialogReason[denyIndex].reasons[reasonIndex].select = true;
      } else {
        let tmp =
          this.submit.rejectReason +
          "，" +
          this.DenyDialogReason[denyIndex].reasons[reasonIndex].value;
        if (tmp.length > 100) return false;
        this.submit.rejectReason = tmp;
        this.DenyDialogReason[denyIndex].reasons[reasonIndex].select = true;
      }
    },
    //用户选择完拒绝原因，点击提交按钮
    submitDenyCreative() {
      if (this.submit.rejectReason.length <= 0) {
        this.showTextArea = true;
      } else {
        this.submit.rejectReason = JSON.stringify([this.submit.rejectReason]);
        this.submitAuditCreative(this.submit.name);
      }
    },
    //创意审核提交
    submitAuditCreative(creativeName) {
      //必须参数
      let queryParam = {
        id: this.submit.id,
        status: this.submit.status,
        rejectReason: this.submit.rejectReason
      };
      //请求创意审核提交接口
      this.reviewCreativeList.loading = true;
      this.submitCreative.loading = true;
      this.$api.AuditCreative.submitAuditCreative(queryParam)
        .then(res => {
          if (this.submit.status === 2) {
            this.$message({
              message: "创意" + creativeName + ", 已通过审查",
              type: "success"
            });
          }
          if (this.submit.status === 1) {
            this.$message({
              message: "已拒绝, 创意" + creativeName,
              type: "success"
            });
            this.dialogDenyVisible = false;
          }
          this.submitCreative.loading = false;
          this.reviewCreativeList.loading = false;
          this.getAuditCreativeList();
        })
        .catch(res => {
          this.submitCreative.loading = false;
          this.reviewCreativeList.loading = false;
        });
    },
    //查看创意
    showContent(id) {
      this.dialogShowContent = true;
      this.auditList.id = id;
      this.getAuditCreativeReviewDetail();
      this.downloadAuditCreative();
    },
    getColumnWidth(index) {
      let width;
      switch (index) {
        case 2:
          width = 130;
          break;
        case 3:
          width = 200;
          break;
        case 7:
        case 8:
          width = 100;
          break;
        case 10:
          width = 200;
          break;
        default:
          width = 100;
          break;
      }
      return width;
    },
    getLastPosition(index) {
      let position;
      switch (index) {
        case 9:
        case 10:
          position = "right";
          break;
        default:
          position = false;
          break;
      }
      return position;
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.getAuditCreativeList();
    },
    handleCurrentChange(currentPage) {
      this.pageIndex = currentPage;
      this.getAuditCreativeList();
    }
  }
};
</script>

<style lang="scss">
.creative-list {
  .no-pass {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    background: rgba(83, 160, 255, 0.08);
    line-height: 1.5;
    .no-pass-img {
      width: 65px;
      height: 46px;
      flex-shrink: 0;
      margin-right: 23px;
    }
  }
  .report-top-form {
    height: 160px;
    border-radius: 4px;
    background-color: $color-bg-3;
    padding: 30px 0 37px 38px;
    .report-divider {
      .el-divider {
        background-color: $color-blue;
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
      .el-input {
        width: 200px;
      }
      .el-range-separator {
        width: 10%;
      }
      .item-space-1 {
        margin: 0 50px 0 0;
      }
      .item-space-end {
        margin: 0px 20px 0 0;
      }
      .el-select .el-input .el-select__caret {
        color: $color-blue;
      }
    }
  }
  .query_result {
    background-color: $color-bg;
    .list_table {
      .status {
        display: inline-block;
        border-radius: 4px;
        width: 70px;
        height: 24px;
        text-align: center;
        &.pass {
          background: $color-blue;
          box-shadow: 0px 2px 4px 0px $color-shadow-2;
          color: $color-bg-3;
        }
        &.pending {
          background: $color-bg-2;
          box-shadow: 0px 2px 4px 0px $color-shadow-1;
        }
        &.deny {
          background: $color-red;
          box-shadow: 0px 2px 4px 0px $color-shadow-3;
          color: $color-bg-3;
        }
      }
      span i.icon-color {
        color: $color-blue;
        margin-right: 8px;
      }
      span.icon-space {
        display: inline-block;
        margin: 10px 35px 10px 0;
        cursor: pointer;
      }
    }
    .list_table {
      background-color: $color-bg;
      /deep/ .el-table__body {
        margin-bottom: 20px;
      }
      margin-bottom: 20px;
      .cell {
        padding-left: 1px;
        padding-right: 1px;
        word-break: break-word;
        white-space: initial;
      }
      td,
      th {
        font-size: 14px;
        color: $color-text;
      }
      td {
        padding: 5px 0 5px 17px;
        border-top: 10px solid $color-bg;
      }
      th {
        padding: 25px 0 25px 17px;
      }
      tr {
        text-align: center;
      }
      tr:first-child td {
        border-top: 0;
      }
      tr td:first-child {
        border-radius: 4px;
      }
      tr td:last-child {
        border-radius: 4px;
      }
      th {
        background-color: $color-bg;
        color: $color-table-title;
        border-bottom: 0;
      }
      tr:hover > td {
        background-color: $color-bg-3 !important;
      }
      tr > td {
        background-color: $color-bg-3 !important;
      }
      .show-contents {
        font-size: 14px;
        font-weight: 400;
        cursor: pointer;
        a {
          color: $color-origin-blue;
          text-decoration: none;
        }
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
    font-weight: 400;
    .el-pagination__total {
      font-size: 14px;
      color: $color-text-1;
    }
    .el-pagination {
      font-size: 14px;
      font-weight: 400;
    }
    .el-input__inner {
      font-size: 14px;
      font-weight: 400;
      color: $color-text-1;
    }
    ul.el-pager li,
    .btn-prev,
    .btn-next {
      background-color: $color-bg-3;
      border: 1px solid $color-border;
      border-radius: 2px;
    }
    .btn-prev:hover,
    .btn-next:hover {
      background-color: $color-bg-3;
      border: 1px solid $color-blue;
      i {
        color: $color-blue;
      }
    }
    .btn-prev i,
    .btn-next i {
      color: $color-split-line2;
    }
    li.active {
      background-color: $color-blue !important;
    }
  }
  .deny-dialog {
    .deny-from {
      .el-form-item__content {
        margin-left: 0 !important;
        .deny-title {
          font-size: 14px;
          font-weight: 400;
          color: $color-text;
          height: 13px;
          line-height: 13px;
        }
        .deny-reason-group {
          .el-checkbox-button {
            background-color: $color-bg-3;
            border-radius: 12px;
            margin-right: 10px;
            margin-top: 10px;
          }
          .el-checkbox-button__inner {
            font-size: 12px;
            font-weight: 400;
            color: $color-text-1;
            border-radius: 12px;
            border: 1px solid $color-bg-7;
            background-color: $color-bg-7;
            padding: 6px 20px;
          }
          .is-checked {
            .el-checkbox-button__inner {
              background-color: $color-blue;
              border: 1px solid $color-blue;
              color: $color-bg-3;
            }
          }
        }
      }
    }
    .el-dialog__header {
      border-bottom: 1px solid $color-border;
      padding: 24px 0 21px 30px;
      .el-dialog__title {
        font-size: 16px;
        font-weight: 400;
        color: $color-text;
      }
    }
    .dialog-footer {
      text-align: center;
      .el-button {
        width: 136px;
        height: 34px;
        border-radius: 2px;
        + .el-button {
          margin-left: 45px;
        }
      }
    }
    .deny-reson {
      display: inline-block;
      font-size: 12px;
      font-weight: 400;
      color: $color-text-1;
      background: $color-bg-7;
      border-radius: 12px;
      padding: 0 5px;
      margin-top: 10px;
      margin-right: 10px;
      cursor: pointer;
      height: 24px;
      line-height: 24px;
    }
    .text-danger {
      background: $color-main;
      color: $color-bg-3;
    }
    .rejectLength {
      margin-top: 10px;
      font-size: 14px;
      font-weight: 400;
    }
    .rejectError {
      margin-top: 10px;
      color: $color-main;
    }
    .choose-deny-list {
      min-height: 160px;
      background: $color-bg-7;
      border-radius: 4px;
      padding: 20px;
      width: 100%;
      font-size: 12px;
      font-weight: 400;
      .el-tag {
        background: $color-blue;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 400;
        color: $color-bg-3;
        position: relative;
      }
      i.el-icon-close {
        padding: 5px;
        position: absolute;
        top: -30%;
        background-color: $color-bg-3;
        color: $color-blue;
      }
      i.el-icon-close:hover {
        background-color: $color-blue;
        color: $color-bg-3;
      }
      .el-tag .el-icon-close::before {
        position: absolute;
        top: 6%;
        left: 13%;
      }
      .displayTag {
        display: none;
      }
      .showTag {
        display: inline-block;
        margin: 0 20px 10px 0;
        font-size: 12px;
        height: 24px;
        line-height: 24px;
      }
    }
  }
  .creative-dialog {
    .el-dialog {
      margin-top: 5vh !important;
    }
    .el-dialog__header {
      border-bottom: 1px solid $color-border;
      padding: 24px 20px 21px 30px;
      .el-dialog__title {
        font-size: 16px;
        font-weight: 400;
        color: $color-text;
      }
    }
    .el-dialog__body {
      padding: 24px 30px 24px 30px;
    }
    .aptitude {
      .text-col {
        font-size: 14px;
        font-weight: 400;
        margin-top: 31px;
        display: flex;
      }
      .text-title {
        color: $color-table-title;
      }
      .text-info {
        color: $color-text-1;
        margin-left: 90px;
      }
      .demo-image__preview {
        margin-left: 90px;
      }
    }
    .material {
      .top-screen {
        position: relative;
        margin-top: 20px;
        .top-screen-box {
          margin-top: 20px;
        }
        .top-screen-pre {
          display: inline-block;
        }
        a {
          margin-top: 24px;
          display: inline-block;
          text-decoration: none;
          line-height: 1;
          white-space: nowrap;
          cursor: pointer;
          background: #ffffff;
          border: 1px solid $color-blue;
          color: $color-blue;
          -webkit-appearance: none;
          text-align: center;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          outline: none;
          -webkit-transition: 0.1s;
          transition: 0.1s;
          font-weight: 400;
          -moz-user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
          padding: 11px 20px;
          font-size: 12px;
          border-radius: 2px;
        }
        a:hover,
        a:active,
        a:link,
        a:visited {
          color: $color-blue;
        }
      }
      .bottom-screen {
        margin-top: 20px;
        .bottom-screen-box {
          margin-top: 20px;
        }
        .left-pre {
          display: inline-block;
          width: 260px;
          height: 212px;
          background: rgb(228, 223, 223);
          border: 1px solid rgba(229, 231, 233, 1);
          border-radius: 2px;
        }
        .right-pre {
          margin-top: 20px;
          display: inline-block;
          width: 260px;
          height: 146px;
          background: rgba(248, 248, 248, 1);
          border: 1px solid rgba(229, 231, 233, 1);
          border-radius: 2px;
        }
      }
    }
  }
}
</style>
