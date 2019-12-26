<template>
  <div class="creative-list">
    <div class="report-top-form">
      <div class="report-divider">
        <el-divider direction="vertical"></el-divider>
        <span class="report-form-title">创意审核</span>
      </div>
      <el-form :inline="true" :model="auditList" class="report-query-form">
        <el-form-item class="item-space-1">
          <el-select
            v-model="auditList.name"
            placeholder="输入创意名称"
            :loading="creativeNameList.loading"
            :remote-method="remoteCreativeName"
            @change="changeCreativeName"
            @clear="clearCreativeName"
            filterable
            remote
            clearable>
            <el-option v-for="item in creativeNameList.data" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="item-space-end">
          <el-select v-model="auditList.statusName"
                     placeholder="全部状态"
                     @change="changeCreativeStatus"
                     clearable>
            <el-option
              v-for="(check,checkIndex) in creativeStatus"
              :key="checkIndex"
              :label="check.label"
              :value="check.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="submitCreativeList">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="query_result">
      <el-table :data="reviewCreativeList.data" :loading="reviewCreativeList.loading" class="list_table">
        <el-table-column
          :min-width="getColumnWidth(colIndex)"
          :prop="col.prop" :label="col.label"
          v-for="(col,colIndex) in reviewCreativeList.column"
          :key="colIndex"
          :fixed="getLastPosition(colIndex)">
          <template slot-scope="scope">
            <div v-if="col.prop === 'status'">
              <span v-if="scope.row[scope.column.property] === 0" class="pending status">待审核</span>
              <span v-if="scope.row[scope.column.property] === 1" class="pass status">审核通过</span>
              <span v-if="scope.row[scope.column.property] === 2" class="deny status">审核拒绝</span>
            </div>
            <div v-else-if="col.prop === 'screenType'">
              <div v-if="scope.row.screenType === 0">
                <span>上屏</span>
              </div>
              <div v-else-if="scope.row.screenType  === 1">
                <span>下屏</span>
              </div>
              <div v-else-if="scope.row.screenType  === 2">
                <span>上下屏</span>
              </div>
              <div v-else>
                <span>暂无</span>
              </div>
            </div>
            <div v-else-if="col.prop === 'action'">
              <div v-if="scope.row.status === 0">
                <span class="icon-space" @click="passCreative(scope.row.id,scope.row.name)"><i
                  class="el-icon-success icon-color"></i>通过</span>
                <span class="icon-space" @click="denyCreative(scope.row.id,scope.row.name)"><i
                  class="el-icon-error icon-color"></i>拒绝</span>
              </div>
            </div>
            <div v-else-if="col.prop === 'creativeContent'">
              <div class="show-contents" @click="dialogShowContent = true">
                <a href="#"><span>查看</span></a>
              </div>
            </div>
            <div v-else>
              {{scope.row[scope.column.property]}}
            </div>
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
    <el-dialog title="审核拒绝" :visible.sync="dialogDenyVisible" class="deny-dialog">
      <el-form :model="denyFrom" class="deny-from">
        <el-form-item :label-width="formLabelWidth" v-for="(denyItem,denyIndex) in DenyDialogReason" :key="denyIndex"
                      :denyIndex="denyIndex">
          <h3 class="deny-title">{{denyIndex+1+'、'+denyItem.title}}</h3>
          <el-checkbox-group v-model="checkReason" class="deny-reason-group"
                             @change="handleCheckedReasonChange" :min="0">
            <el-checkbox-button v-for="(reason,reasonIndex) in denyItem.reasons" :key="reasonIndex"
                                :label="denyIndex +'-'+ reasonIndex">
              {{reason.value}}
            </el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <textarea class="choose-deny-list">
        <el-tag closable>不得使用或者变相使用中华人民共和国的国旗、国歌、国徽、军旗、军歌、军徽</el-tag>
        <el-tag closable>涉及虚假误导宣传</el-tag>
      </textarea>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDenyVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitDengyCreative()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="创意内容" :visible.sync="dialogShowContent" class="creative-dialog">
      <el-tabs v-model="activeName" @tab-click="handleContentClick">
        <el-tab-pane label="创意资质" name="aptitude" class="aptitude">
          <div v-for="(aItem,aIndex) in aptitudeData" :key="aIndex" class="text-col">
            <span class="text-title">{{aItem.label}}</span>
            <div class="demo-image__preview" v-if="aItem.label==='创意资质'">
              <el-image
                style="width: 100px; height: 158px;border-radius: 2px"
                :src="aItem.value"
                :preview-src-list="aItem.srcList">
              </el-image>
            </div>
            <label class="text-info" v-else> {{aItem.value}}</label>
          </div>
        </el-tab-pane>
        <el-tab-pane label="创意素材" name="material" class="material">
          <div class="top-screen">
            <p>上屏</p>
            <el-button plain type="primary">下载视频</el-button>
          </div>
          <div class="bottom-screen">
            <p>下屏</p>
            <div class="bottom-screen-box">
              <div class="left-pre"></div>
              <div class="right-pre"></div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
  const PAGE_SIZE = [10, 20, 30, 40, 50];
  import {Notification} from 'element-ui'
  import {DenyDialogReason} from '../../../../../utils/static'

  export default {
    name: "auditList",
    data() {
      return {
        DenyDialogReason,
        checkReason: [],
        activeName: 'aptitude',
        dialogDenyVisible: false,
        dialogShowContent: false,
        aptitudeData: [
          {value: '新潮传媒集团', label: '企业名称'},
          {value: '餐饮', label: '企业行业'},
          {value: '餐饮', label: '创意行业'},
          {value: '联动', label: '屏幕类型'},
          {
            value: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2966610753,437054214&fm=26&gp=0.jpg',
            label: '创意资质',
            srcList: [
              'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2966610753,437054214&fm=26&gp=0.jpg',
            ]
          }
        ],
        denyDialogReason: [
          {
            title: '效果承诺',
            reasons: [
              {
                value: '不得含有对未来效果、收益或者与其相关的情况作出保证性承诺，明示或者暗示保本、无风险或者保收益等内容'
              },
              {

                value: '不得涉及前后效果对比'
              },
              {

                value: '不得对升学，提高成绩，拿证或培训效果作出保证性承诺'
              },
              {
                value: '不得以受益人，专家学者等机构的名义推广'
              },
              {
                value: '涉及虚假误导宣传'
              },
            ]
          },
          {
            title: '政治面貌敏感，极端词语类',
            reasons: [
              {
                value: '不得使用或者变相使用中华人民共和国的国旗、国歌、国徽、军旗、军歌、军徽'
              },
              {
                value: '不得使用”国家级””最高级””最佳”等极端用语'
              },
              {
                value: '不得含有污秽、色情、赌博、迷信、恐怖、暴力的内容'
              },
              {
                value: '含有名族、种族、宗教、性别歧视的内容'
              },
              {
                value: '不得涉及时事热点政治敏感内容'
              },
              {
                value: '不得使用国家机关或国家机关工作人员的形象名义作为推广'
              },
            ]
          },

          {
            title: '风险提示类',
            reasons: [
              {
                value: '请在画面添加备注预售号'
              },
              {

                value: '涉及招商加盟，请备注风险提示语：“投资有风险，加盟需谨慎”'
              },
              {
                value: '画面请备注风险提示语“投资有风险”'
              },
            ]
          },
          {
            title: '素材质量类',
            reasons: [
              {
                value: '素材画面整体质量较低'
              },
              {
                value: '画面内容容易引起不适，易引起投诉'
              },
              {
                value: '请合理规范使用标点符号'
              },
            ]
          },
          {
            title: '医疗行业类',
            reasons: [
              {
                value: '不得涉及真人医患形象，真人代言，医疗器械，手术直播过程'
              },
              {
                value: '非医疗行业不得涉及医疗相关描述'
              },
              {
                value: '请在画面添加备注医广号'
              },
            ]
          },
          {
            title: '暂不接受投放类',
            reasons: [
              {
                value: '暂不接受该行业投放，请知悉'
              },
            ]
          },
        ],
        formLabelWidth: '120px',
        currentPage: 50,
        checkFormInline: {
          selectCreativeName: '',
          selectCreativeStatus: '',
        },
        //屏幕类型
        screenTypeList: [
          {id: '001', type: '上屏'}, {id: '002', type: '下屏'}, {id: '003', type: '上下屏'}
        ],
        //创意审核列表
        reviewCreativeList: {
          data: null,
          loading: false,
          column: [
            {label: '创意组ID', prop: 'id'},
            {label: '创意内容', prop: 'creativeContent'},
            {label: '创意名称', prop: 'name'},
            {label: '企业名称', prop: 'companyName'},
            {label: '企业行业', prop: 'companyIndustry'},
            {label: '创意行业', prop: 'industry'},
            {label: '屏幕类型', prop: 'screenType'},
            {label: '提交时间', prop: 'createTime'},
            {label: '审核时间', prop: 'reviewTime'},
            {label: '创意状态', prop: 'status'},
            {label: '操作', prop: 'action'}
          ]
        },
        creativeStatus: [{value: 0, label: '待审核'}, {value: 1, label: '审核拒绝'}, {value: 2, label: '审核通过'}],
        //创意名称列表
        creativeNameList: {
          data: null,
          loading: false,
        },
        //创意素材下载
        downloadCreative: {
          data: null,
          loading: false,
        },
        //创意审核资质
        reviewCreativeDetail: {
          data: null,
          loading: false,
        },
        //创意审核提交
        submitCreative: {
          data: null,
          loading: false,
        },
        auditList: {
          id: '',
          name: '',
          status: '',
          statusName: '',
          rejectReason: ''
        },
        submit: {
          id: '',
          name: '',
          status: '',
          rejectReason: ''
        },
        denyFrom: {},
        totalCount: 0, // 总共条数
        pageSizeSelectable: PAGE_SIZE,
        resultData: null,
        pageIndex: 1,
        pageSize: 10,
        loading: false,
      }
    },
    created() {
      this.getAuditCreativeList()
    },
    methods: {
      //查询创意
      submitCreativeList() {
        this.getAuditCreativeList()
      },
      //远程模糊搜索创意名称，获取对应创意列表
      remoteCreativeName(query) {
        this.creativeNameList.loading = true
        if (query !== '') {
          setTimeout(() => {
            let queryParam = {
              name: query,
            }
            //请求方案报表列表查询接口
            this.$api.AuditCreative.getAuditCreativeList(queryParam)
              .then(res => {
                this.creativeNameList.loading = false
                this.creativeNameList.data = res.result
              })
              .catch(res => {
                this.creativeNameList.loading = false
              })
          }, 200);
        } else {
          this.creativeNameList.data = []
          this.creativeNameList.loading = false;
        }
      },
      //改变选择的创意名称
      changeCreativeName(val) {
        this.auditList.id = val
        let changeObj = {};
        changeObj = this.creativeNameList.data.find((item) => {
          return item.id === val;
        });
        this.auditList.name = changeObj.name;
      },
      //清空选择的创意名称
      clearCreativeName() {
        this.auditList.name = ''
        this.auditList.id = ''
      },
      //改变状态
      changeCreativeStatus(status) {
        this.auditList.status = status
        let changeObj = {};
        changeObj = this.creativeStatus.find((item) => {
          return item.value === status
        })
        this.auditList.statusName = changeObj.label;
      },
      //获取审核创意列表
      getAuditCreativeList() {
        //必须参数
        let queryParam = {
          name: this.auditList.name,
          status: this.auditList.status,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
        }
        //请求方案报表列表查询接口
        this.reviewCreativeList.loading = true
        this.$api.AuditCreative.getAuditCreativeList(queryParam)
          .then(res => {
            this.reviewCreativeList.loading = false
            this.totalCount = res.page.totalCount;
            res.result.forEach(item => {
              if (item.reviewTime === null || item.reviewTime === undefined) {
                item.reviewTime = '暂无'
              } else {
                item.reviewTime = this.$tools.formatDate(item.reviewTime, 'yyyy-MM-dd')
              }
              if (item.createTime === null || item.createTime === undefined) {
                item.createTime = '暂无'
              } else {
                item.createTime = this.$tools.formatDate(item.createTime, 'yyyy-MM-dd')
              }
              if (item.screenType === null || item.screenType === undefined) {
                item.screenType = -1
              } else {
                item.screenType = parseInt(item.screenType)
              }
            })
            this.reviewCreativeList.data = res.result
          })
          .catch(res => {
            this.reviewCreativeList.loading = false
          })
      },
      // 审核创意素材下载
      downloadAuditCreative() {
        //必须参数
        let queryParam = {
          id: this.auditList.id,
        }
        //请求方案报表列表查询接口
        this.downloadCreative.loading = true
        this.$api.AuditCreative.downloadAuditCreative(queryParam)
          .then(res => {
            this.downloadCreative.loading = false
            this.$tools.downLoadFileFlow(res,
              `审核创意${this.auditList.name}_${this.$tools.getFormatDate("YYmmdd")}.xsl`
            );
          })
          .catch(res => {
            this.downloadCreative.loading = false
          })
      },
      // 审核创意资质查看
      getAuditCreativeReviewDetail() {
        //必须参数
        let queryParam = {
          id: this.auditList.id,
        }
        //请求方案报表列表查询接口
        this.reviewCreativeDetail.loading = true
        this.$api.AuditCreative.getAuditCreativeReviewDetail(queryParam)
          .then(res => {
            this.reviewCreativeDetail.loading = false
            this.reviewCreativeDetail.data = res.result
          })
          .catch(res => {
            this.reviewCreativeDetail.loading = false
          })
      },
      //点击通过,创意变为通过
      passCreative(id, name) {
        console.log(id, name)
        this.submit.id = id
        this.submit.status = 2
        this.submit.rejectReason = ''
        this.submit.name = name
        this.submitAuditCreative(name)
      },
      //点击拒绝,创意变为拒绝
      denyCreative(id, name) {
        this.submit.id = id
        this.submit.status = 1
        this.submit.name = name
        this.dialogDenyVisible = true
      },
      //选择拒绝原因
      handleCheckedReasonChange(checkItem) {
        console.log(checkItem, this.checkReason)
      },
      //用户选择完拒绝原因，点击提交按钮
      submitDenyCreative() {
        this.submitAuditCreative()
      },
      //创意审核提交
      submitAuditCreative(creativeName) {
        //必须参数
        let queryParam = {
          id: this.submit.id,
          status: this.submit.status,
          rejectReason: this.submit.rejectReason,
        }
        //请求创意审核提交接口
        this.$api.AuditCreative.submitAuditCreative(queryParam)
          .then(res => {
            console.log(queryParam, res.result)
            if (this.auditList.status === 2) {
              Notification({
                title: '成功',
                message: '创意:' + creativeName + ',通过审查',
                type: 'success'
              });
            }
            if (this.auditList.status === 1) {
              Notification({
                title: '失败',
                message: '创意:' + creativeName + ',审核拒绝',
                type: 'error'
              });
            }
            this.getAuditCreativeList()
          })
          .catch(res => {
            this.reviewCreativeList.loading = false
          })
      },
      getColumnWidth(index) {
        let width;
        switch (index) {
          case  2:
            width = 130;
            break;
          case  3:
            width = 200;
            break;
          case  7:
          case  8:
            width = 100;
            break;
          case  10:
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
          case  9:
          case  10:
            position = 'right';
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
      },
      handleContentClick() {

      },
    }
  }
</script>

<style lang="scss">
  .creative-list {
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

        .cell {
          padding-left: 1px;
          padding-right: 1px;
          word-break: break-word;
          white-space: initial;
        }

        td, th {
          font-size: 14px;
          color: $color-text;
          text-align: center;
          padding: 25px 0;
        }

        td {
          padding: 5px 0;
          border-top: 10px solid $color-bg;
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
          background-color: $color-bg-3 !important
        }

        tr > td {
          background-color: $color-bg-3 !important
        }

        .show-contents {
          font-size: 14px;
          font-weight: 400;
          cursor: pointer;

          a {
            color: $color-blue;
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

      ul.el-pager li, .btn-prev, .btn-next {
        background-color: $color-bg-3;
        border: 1px solid $color-border;
        border-radius: 2px;
      }

      .btn-prev:hover, .btn-next:hover {
        background-color: $color-bg-3;
        border: 1px solid $color-blue;

        i {
          color: $color-blue;
        }
      }

      .btn-prev i, .btn-next i {
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

      .choose-deny-list {
        height: 160px;
        background: $color-bg-7;
        border-radius: 4px;
        padding: 20px;

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
      }
    }

    .creative-dialog {
      .el-dialog {
        margin-top: 10vh !important;
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
          p {

          }

          .el-button {
            margin-top: 24px;
          }

        }

        .bottom-screen {
          margin-top: 50px;

          .bottom-screen-box {
            display: flex;
            margin-top: 24px;
          }

          .left-pre {
            display: inline-block;
            width: 260px;
            height: 212px;
            background: rgba(248, 248, 248, 1);
            border: 1px solid rgba(229, 231, 233, 1);
            border-radius: 2px;
          }

          .right-pre {
            display: inline-block;
            width: 260px;
            height: 146px;
            background: rgba(248, 248, 248, 1);
            border: 1px solid rgba(229, 231, 233, 1);
            border-radius: 2px;
            margin-left: 60px;
          }
        }
      }
    }
  }
</style>
