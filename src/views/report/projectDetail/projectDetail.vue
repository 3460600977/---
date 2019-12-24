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
    <div class="detail-bottom-map" v-if="premiseList.data.length">
      <div class="left-map">
        <ponit-map :points="premiseList.data"></ponit-map>
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
            <div class="show-build">{{premiseList.deviceNum.label}}{{premiseList.deviceNum.value}}</div>
            <div class="show-click" @click="dialogVisible = true" @open="getProjectDeviceList"> 查看<i
              class="el-icon-arrow-right"></i></div>
          </el-button>
          <el-dialog class="dialog-build-list"
                     :visible.sync="dialogVisible"
                     width="70%">
            <div slot="title">{{deviceInfo.name.value}}</div>
            <div class="info-body">
              <div class="info-time">
                <label class="put-time" v-for="(infoItem,infoIndex) in deviceInfo.time"
                       :key="infoIndex">
                  <span>{{infoItem.title}}</span>
                  <span>{{infoItem.value}}</span>
                </label>
              </div>
              <div class="info-table">
                <el-table max-height="450" :data="resultData" :load="loading" class="info-el-table">
                  <el-table-column
                    :min-width="getColumnWidth(colIndex)"
                    :prop="col.prop" :label="col.label"
                    v-for="(col,colIndex) in resultCol"
                    :key="colIndex">
                    <template slot-scope="scope">
                      <div v-if="col.prop === 'status'">
                        <span v-if="scope.row[scope.column.property] === 1" class="normal info-status">正常</span>
                        <span v-if="scope.row[scope.column.property] === 0" class="stop info-status">正在维护中</span>
                      </div>
                      <div v-else-if="col.prop === 'action'">
                        <a class="preview" href="#" @click="getProjectPlayList(scope.row['deviceCode'])">预览</a>
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
  import ponitMap from "../../../components/ponitMap";
    //import {tableMixin} from '../../../mixins/tableMixin'
    const PAGE_SIZE = [10, 20, 30, 40, 50]
    export default {
        name: "projectDetail",
        components: {
          ponitMap
        },
        data() {
            return {
              cityName: null,
                projectId: null,
                premiseId: null,
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
                    deviceNum: {label: '投放点位数:', value: 288, field: 'deviceNum'},
                    premiseId: {label: '楼盘id', value: 288, field: 'premiseId'},
                    default: [
                        {label: '楼盘名称:', title: '新潮小区', icon: 'el-icon-office-building', field: 'premiseName'},
                        {
                            label: '详细地址:',
                            title: '成都市武侯区茂业大厦',
                            icon: 'el-icon-location-outline',
                            field: 'premiseAddress'
                        },
                        {label: '曝光次数:', title: 89895, icon: 'el-icon-video-camera', field: 'premiseShowTimes'}
                    ],
                    data: []
                },
                deviceInfo: {
                    time: [
                        {
                            value: '', field: 'startTime', title: '方案投放周期'
                        },
                        {
                            value: '', field: 'dataEndTime', title: '数据截止时间'
                        }
                    ],
                    name:
                        {
                            value: '', field: 'name', title: '楼盘名称'
                        },
                },
                map_img: require('../../../assets/images/report_map.png'),
                totalCount: 0, // 总共条数
                pageSizeSelectable: PAGE_SIZE,
                resultData: null,
                resultCol: [
                    {prop: 'deviceCode', label: '点位编码'},
                    {prop: 'buildName', label: '楼栋'},
                    {prop: 'unitName', label: '单元'},
                    {prop: 'elevatorName', label: '电梯名'},
                    {prop: 'avgTimes', label: '总次数/平均日次/今日次数'},
                    {prop: 'status', label: '状态'},
                    {prop: 'action', label: '操作'},
                ],
                pageIndex: 1,
                pageSize: 10,
                loading: false,
                projectList: {
                    startTime: '',//开始时间
                    endTime: '',//结束时间
                    campaignId: '',//计划id
                    id: '',//方案id
                },
                playList: {
                    data: [],
                    loading: false,
                }
            }
        },
        created() {
            this.projectId = this.$route.query.projectId
            this.getProjectPremiseList()
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
                        this.reportSelectCard.loading = false
                        this.putProject.loading = false
                        let premiseList = res.result;
                        this.reportSelectCard.data.forEach(item => {
                            let property = item.field;
                            if (premiseList.hasOwnProperty(property)) {
                                if (premiseList[property] === '' || premiseList[property] === null) {
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
                      this.cityName = res.result.cityName
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
                        if (premiseList.premiseList.length === 0) {

                        } else {
                            let showPremise = premiseList.premiseList[1]//默认数据
                            this.premiseList.default.forEach(item => {
                                let property = item.field;
                                if (showPremise.hasOwnProperty(property)) {
                                    if (showPremise[property] === '' || showPremise[property] === null) {
                                        item.value = 0
                                    } else {
                                        item.title = showPremise[property]
                                    }
                                }
                            })
                            this.premiseList.deviceNum.value = showPremise.deviceNum
                            this.premiseList.premiseId.value = showPremise.premiseId
                            this.premiseId = showPremise.premiseId
                            //所有楼盘数据
                            this.premiseList.data = premiseList.premiseList
                        }
                      // this.premiseList.data =  [
                      //   {
                      //     premisesId: 167921,
                      //     premiseName: "棕榈花园1",
                      //     longitude: "104.084745",
                      //     latitude: "30.626762",
                      //     signElevatorNum: 9,
                      //     totalPeople: 1008,
                      //   },
                      //   {
                      //     premisesId: 167921,
                      //     premiseName: "棕榈花园2",
                      //     longitude: "104.04846",
                      //     latitude: "30.69082",
                      //     signElevatorNum: 9,
                      //     totalPeople: 1008,
                      //   },{
                      //     premisesId: 167921,
                      //     premiseName: "棕榈花园3",
                      //     longitude: "104.09485",
                      //     latitude: "30.671083",
                      //     signElevatorNum: 9,
                      //     totalPeople: 1008,
                      //   }
                      // ]
                    })
                    .catch(res => {
                        console.log(res.result, res)
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
                        this.deviceInfo.time.forEach(item => {
                            let property = item.field;
                            if (this.resultData[property] === '') {
                                item.value = 0
                            } else if (this.resultData === 'startTime') {
                                item.value = this.resultData['startTime'] + '~' + this.resultData['endTime']
                            } else {
                                item.value = this.resultData[property]
                            }
                        })
                        this.deviceInfo.name.value = this.resultData.name
                        console.log('getProjectDeviceList', res.result)
                        this.loading = false
                    })
                    .catch(res => {
                        console.log(res.result)
                        this.loading = false
                    })
            },
            //查询方案楼盘设备播放列表
            getProjectPlayList(deviceCode) {
                let param = {}
                let queryParam = {
                    deviceCode: this.deviceCode,
                    deviceDate: this.deviceDate,
                }
                if (deviceCode.toString().length > 0) {
                    param = {
                        deviceCode: deviceCode,
                    }
                }
                //合并查询参数
                Object.assign(queryParam, param);
                this.playList.loading = true
                this.$api.Report.getProjectPlayList(queryParam)
                    .then(res => {
                        this.playList.data = res.result
                        this.playList.loading = false
                        console.log('getProjectPlayList', res.result)
                    })
                    .catch(res => {
                        console.log(res.result)
                        this.playList.loading = false
                    })
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
        height: 604px;
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
