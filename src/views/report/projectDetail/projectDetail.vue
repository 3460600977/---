<template>
  <div class="project-detail clearfix">
    <div class="detail-top-form">
      <div class="detail-divider">
        <el-divider direction="vertical"></el-divider>
        <span class="report-form-title">投放方案信息</span>
      </div>
      <el-form :inline="true" class="detail-query-form">
        <div v-for="(item,key) in putProject.data" :key="key" class="label-for-detail" :loading="putProject.loading">
          <label>{{item.label}}</label>
          <span>{{item.value}}</span>
        </div>
      </el-form>
      <div class="report-select-card" :loading="reportSelectCard.loading">
        <el-card class="box-card"
                 v-for="(itemCard,key) in reportSelectCard.data" :cardIndex="itemCard.field"
                 :key="key">
          <div class="card-center">
            <div class="card_name">
              {{itemCard.name }}
            </div>
            <div class="card_value font-number">
              {{itemCard.value}}
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <div class="detail-bottom-map">
      <div class="left-map">
        <!--        暂时用图片代替-->
        <img class="map_img" :src="map_img" :data="premiseList.data">
      </div>
      <div class="right-list">
        <div class="right-detail-box">
          <div class="detail-list"
               v-for="(itemLabel,index_label) in premiseList.default"
               :key="index_label">
            <i :class="itemLabel.icon"></i>
            <span class="detail-list-label">{{itemLabel.label}}</span>
            <span class="detail-list-title">{{itemLabel.title}}</span>
          </div>
        </div>
        <div class="show_location_num">
          <el-button slot="reference" class="show-build-list">
            <div class="show-build">{{putNum.name}}{{putNum.value}}</div>
            <div class="show-click" @click="dialogVisible = true">查看<i class="el-icon-arrow-right"></i></div>
          </el-button>
          <el-dialog class="dialog-build-list"
                     :visible.sync="dialogVisible"
                     width="70%">
            <div slot="title">新潮幸福小区</div>
            <div class="info-body">
              <div class="info-time">
                <label class="put-time" v-for="(infoItem,infoIndex) in build_time_Info"
                       :key="infoIndex">
                  <span>{{infoItem.label}}</span>
                  <span>{{infoItem.value}}</span>
                </label>
              </div>
              <div class="info-table">
                <el-table max-height="450" :data="resultData" class="info-el-table">
                  <el-table-column
                    :min-width="getColumnWidth(colIndex)"
                    :prop="col.prop" :label="col.label"
                    v-for="(col,colIndex) in resultCol"
                    :key="colIndex">
                    <template slot-scope="scope">
                      <div v-if="col.prop === 'status'">
                        <span v-if="scope.row[scope.column.property] === '正常'" class="normal info-status">正常</span>
                        <span v-if="scope.row[scope.column.property] === '停用'" class="stop info-status">停用</span>
                      </div>
                      <div v-else-if="col.prop === 'action'">
                        <a class="preview" href="#">预览</a>
                      </div>
                      <div v-else>
                        {{scope.row[scope.column.property]}}
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    //import {tableMixin} from '../../../mixins/tableMixin'
    const PAGE_SIZE = [10, 20, 30, 40, 50]
    export default {
        name: "projectDetail",
        data() {
            return {
                projectId: 0,
                reportSelectCard: {
                    loading: false,
                    data: [
                        {
                            id: 0, name: '花费总数（元）', value: '0', field: 'cost', title: '花费总数'
                        },
                        {
                            id: 1, name: '曝光总数（次）', value: '0', field: 'showTimes', title: '曝光总数'
                        },
                        {
                            id: 2, name: '设备总数（个）', value: '0', field: 'deviceNum', title: '设备总数'
                        },
                        {
                            id: 3, name: '受众总人数（人）', value: '0', field: 'totalPeople', title: '受众总人数'
                        },
                        {
                            id: 4, name: '受众观看总次数（次）', value: '0', field: 'watchedTimes', title: '受众观看总次数'
                        },
                    ],
                },
                dialogVisible: false,
                putProject: {
                    loading: false,
                    data: [
                        {label: '投放方案', value: '投放方案1', field: 'name'},
                        {label: '投放时间', value: '2019-11-08~2019-11-15', field: 'startTime'},
                        {label: '投放城市', value: '重庆', field: 'cityName'},
                        {label: '数据截止时间', value: '2019-11-08 17:00:00', field: 'dataEndTime'}
                    ]
                },
                premiseList: {
                    loading: false,
                    default: [
                        {label: '楼盘名称:', title: '新潮小区', icon: 'el-icon-office-building', field: 'premiseName'},
                        {label: '详细地址:', title: '成都市武侯区茂业大厦', icon: 'el-icon-location-outline', field: 'name'},
                        {label: '曝光次数:', title: 89895, icon: 'el-icon-video-camera', field: 'premiseShowTimes'}
                    ],
                    data: []
                },
                playList: {
                    loading: false,
                    data: []
                },
                putNum: {name: '投放点位数:', value: '281'},
                map_img: require('../../../assets/images/report_map.png'),
                totalCount: 0, // 总共条数
                pageSizeSelectable: PAGE_SIZE,
                resultData: null,
                resultCol: null,
                pageIndex: 1,
                pageSize: 10,
                loading: false,
                projectList: {
                    startTime: '',//开始时间
                    endTime: '',//结束时间
                    campaignId: '',//计划id
                    id: '',//方案id
                },
            }
        },
        created() {
            this.projectId = this.$route.query.projectId
            this.getProjectPremiseList()
        },
        computed: {
            // 计算属性的 小区信息
            build_time_Info: function () {
                let time_info = [];
                for (let i = 0, j = 0; i < this.putProject.length; i++) {
                    if (this.putProject[i].name === 'time') {
                        time_info[j] = this.putProject[i]
                        j++
                    }
                    if (this.putProject[i].name === 'deadline') {
                        time_info[j] = this.putProject[i]
                        j++
                    }
                }
                return time_info;
            }

        },
        methods: {
            //查询方案楼盘列表
            getProjectPremiseList(param) {
                let queryParam = {
                    projectId: this.projectId,
                }
                //合并查询参数
                Object.assign(queryParam, param);
                this.putProject.loading = true
                this.reportSelectCard.loading = true
                this.$api.Report.getProjectPremiseList(queryParam)
                    .then(res => {
                        console.log(res.result)
                        this.reportSelectCard.loading = false
                        this.putProject.loading = false
                        let premiseList = res.result;
                        this.reportSelectCard.data.forEach(item => {
                            let property = item.field;
                            if (premiseList.hasOwnProperty(property)) {
                                if (premiseList[property] === '') {
                                    item.value = 0
                                } else if (property === 'cost') {
                                    let costValue = premiseList[property]
                                    costValue = this.$tools.formatCentToYuan(costValue)
                                    item.value = this.$tools.toThousands(costValue)
                                } else {
                                    item.value = this.$tools.toThousands(premiseList[property], false)
                                }
                            }
                        })
                        this.putProject.data.forEach(item => {
                            let property = item.field;
                            if (premiseList.hasOwnProperty(property)) {
                                if (premiseList[property] === '') {
                                    item.value = 0
                                } else if (property === 'startTime') {
                                    item.value = premiseList['startTime'] + '~' + premiseList['endTime']
                                } else {
                                    item.value = premiseList[property]
                                }
                            }
                        })
                        //楼板列表数据
                        this.premiseList.default = premiseList.premiseList[0]//默认数据
                        this.premiseList.data = premiseList.premiseList
                    })
                    .catch(res => {
                        console.log(res.result)
                        this.putProject.loading = false
                        this.reportSelectCard.loading = false
                    })
            },
            //查询方案楼盘设备信息
            getProjectDeviceList(param) {
                let queryParam = {
                    projectId: this.projectId,
                    premiseId: this.premiseId,
                }
                //合并查询参数
                Object.assign(queryParam, param);
                this.loading = true
                this.$api.Report.getProjectDeviceList(queryParam)
                    .then(res => {
                        this.resultData = res.result
                        console.log(res.result)
                        this.loading = false
                    })
                    .catch(res => {
                        console.log(res.result)
                        this.loading = false
                    })
            },
            //查询方案楼盘设备播放列表
            getProjectPlayList() {
                let queryParam = {
                    deviceCode: this.deviceCode,
                    deviceDate: this.deviceDate,
                }
                //合并查询参数
                Object.assign(queryParam, param);
                this.playList.loading = true
                this.$api.Report.getProjectPlayList(queryParam)
                    .then(res => {
                        this.playList.data = res.result
                        this.playList.loading = false
                        console.log(res.result)
                    })
                    .catch(res => {
                        console.log(res.result)
                        this.playList.loading = false
                    })
            },
            //获取楼盘名称
            getPremiseDetail() {

            },
            getColumnWidth(index) {
                let width;
                switch (index) {
                    case  4:
                        width = 200;
                        break;
                    default:
                        width = 130;
                        break;
                }
                return width;
            }
        }
    }
</script>

<style lang='scss'>
  .project-detail {
    height: 100%;
    flex-direction: row;
    background-color: $color-bg;
    overflow-x: hidden;
    padding: 20px 20px;

    .detail-top-form {
      width: 100%;
      background-color: $color-bg-3;
      padding: 30px 35px;

      .el-divider {
        background-color: $color-blue;
        border-radius: 2px;
        width: 3px;
        margin: 0 5px 0 0;
      }

      .detail-query-form {
        margin-top: 30px;
      }

      .report-form-title {
        font-size: 16px;
        font-weight: bold;
        color: $color-text;
      }

      .detail-query-form {
        width: calc(100% - 200px);
      }

      .label-for-detail {
        display: inline-block;
        font-size: 14px;
        font-weight: 400;
        color: $color-text;
        margin-left: 40px;

        &:first-child {
          margin-left: 0;
        }

        label {
          margin-right: 20px;
        }

        span {
          color: $color-text-1;
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
          background-color: $color-bg-6;
          display: inline-block;
          margin-left: 25px;
          color: $color-text;
          margin-top: 0;

          &:first-child {
            margin-left: 0;
          }

          .el-card__body {

            display: table;
            height: 100%;
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
        }
      }
    }

    .detail-bottom-map {
      margin-top: 20px;
      padding: 26px;
      background-color: $color-bg-3;
      position: relative;

      .left-map {
        display: inline-block;
        width: calc(50% - 10px);

        .map_img {
          width: 100%;
        }
      }

      .right-list {
        display: inline-block;
        width: calc(50% - 10px);
        height: 100%;
        position: absolute;
        top: 0;

        .right-detail-box {
          display: inline-block;
          margin: 95px 0 0 60px;

          .detail-list {
            margin-top: 43px;
            font-size: 14px;
            font-weight: 400;

            &:first-child {
              margin-top: 0;
            }

            i {
              color: $color-blue;
              padding: 5px;
              background-color: $color-bg;
              border-radius: 4px;
            }

            .detail-list-label {
              color: $color-text;
              margin-left: 11px;
            }

            .detail-list-title {
              color: $color-text-1;
              margin-left: 30px;
            }
          }
        }

        .show_location_num {

          .show-build-list {
            width: 360px;
            height: 40px;
            background: $color-bg-3;
            box-shadow: 0px 3px 7px 0px $color-shadow-4;
            border-radius: 4px;
            text-align: left;
            font-size: 14px;
            font-weight: 400;
            color: $color-text;
            margin: 117px 0 0 60px;
            cursor: default;


            .show-build {
              display: inline-block;
            }

            .show-click {
              display: inline-block;
              float: right;
              color: $color-text-1;
              padding: 0 10px 0 60px;
              cursor: pointer;
            }
          }

          .dialog-build-list {

            .el-dialog {
              margin-top: 10vh !important;
            }

            .el-dialog__header {
              border-bottom: 1px solid $color-border;
              padding: 24px 0 21px 30px;
            }

            .info-time {
              display: flex;
              flex-flow: row nowrap;
              justify-content: space-between;
              align-content: flex-start;
              color: $color-text;
            }

            .info-table {
              margin-top: 31px;
              font-size: 14px;
              font-weight: 400;
              color: $color-text;


              tr:hover > td {
                background-color: $color-bg-3 !important
              }

              tr > td {
                background-color: $color-bg-3 !important;
                text-align: center;
                word-break: keep-all;
                white-space: nowrap;
              }

              .info-el-table {
                border: 1px solid $color-border;
                border-bottom: 0;
              }

              .has-gutter > tr, th {
                font-size: 14px;
                color: $color-text-1;
                background-color: $color-bg;
                text-align: center;
              }

              .el-table {
                background-color: $color-bg;
              }

              .info-status {
                display: inline-block;
                border-radius: 4px;
                font-weight: 400;
                color: $color-bg-3;
                padding: 6px 21px;

                &.normal {
                  background: $color-blue;
                  box-shadow: 0px 2px 4px 0px $color-shadow-2;
                }

                &.stop {
                  background: $color-red;
                  box-shadow: 0px 2px 4px 0px $color-shadow-3;
                }
              }

              .preview {
                text-decoration: none;
                color: $color-blue;
              }
            }
          }
        }
      }
    }
  }
</style>
