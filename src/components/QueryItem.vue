<template>
  <div>
    <el-form :model="filters" :inline="true">
      <template v-for="(val, index) in queryItems">
        <el-form-item v-if="val.type === 'input'" :label="val.label">
          <el-input
            v-model.trim="filters[val.model.key]"
            clearable
            @keyup.enter.native="handleTransfer"
          ></el-input>
        </el-form-item>
<!--        <el-form-item v-if="val.type === 'checkBox'" :label="val.label">-->
<!--          <el-checkbox-group v-model="filters[val.model.key]" @change="handleTransfer">-->
<!--            <el-checkbox-->
<!--              v-for="item in val.data"-->
<!--              :key="item.value"-->
<!--              :label="item.value"-->
<!--            >{{item.label}}-->
<!--            </el-checkbox>-->
<!--          </el-checkbox-group>-->
<!--        </el-form-item>-->
        <el-form-item v-if="val.type === 'select'" :label="val.label">
          <el-select
            ref="select"
            v-model="filters[val.model.key]"
            :loading="treeData[val.model.key + 'Loading']"
            :filterable="val.filterable"
            :remote="val.remote"
            :remote-method="remoteMethod"
            style="margin-right: 10px"
            placeholder="请选择"
            @clear="selectClear(val)"
            @change="handleTransfer(val)"
            @focus="handleSelectFocus(val)">
            <el-option
              v-for="(item, index) in treeData[val.model.key]"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="val.type === 'date'" :label="val.label">
          <el-date-picker
            v-model="filters[val.model.key]"
            :picker-options="val.options?val.options:reportTimePicker"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="center"
            format="yyyy/MM/dd"
            value-format="yyyy/MM/dd"
            @change="handleDateChange(val.model.key)"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="val.type === 'actions'">
          <template v-for="(v, i) in val.actions">
            <el-button :type="v.type" size="small" @click="handleSearch(v)"> {{v.label}}</el-button>
          </template>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    isEmitByButton: { // 根据点击查询按钮才给出当前选择数据 而不是选择就给出数据
      type: Boolean,
      default: false
    },
    queryItems: {
      type: Array,
      required: true
    },
    filters: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      currentSelect: null,
      selectFocusData: {},
      treeData: {},
      initData: {},
      reportTimePicker: {
        shortcuts: [
          {
            text: '今日',
            onClick(picker) {
              const now = new Date();
              const end = new Date(now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate() + ' 23:59:00');
              const start = new Date(now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate() + ' 00:00:00');
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              picker.$emit('pick', this.$tools.calcShortCuts(7));
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              picker.$emit('pick', this.$tools.calcShortCuts(30));
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              picker.$emit('pick', this.$tools.calcShortCuts(90));
            }
          }]
      }
    }
  },
  created() {
    this.initData = this.$tools.deepCopy(this.queryFilter)
    // this._renderFilters()
  },
  mounted() {
    if (this.isEmitByButton) this.handleEmit()
  },
  methods: {
    selectClear(val) {
      this.treeData[val.model.key] = this.selectFocusData[val.model.key]
    },
    remoteMethod(query) {
      if (this.currentSelect.remoteMethod) {
        if (query !== '') {
          const val = this.currentSelect
          this.treeData[val.model.key + 'Loading'] = true
          const data = {}
          if (val.parentKey && val.parentKey.length > 0) {
            val.parentKey.forEach((v) => {
              data[v] = this.filters[v]
            })
          }
          data.query = query
          val.remoteMethod(data).then((v) => {
            this.treeData[val.model.key + 'Loading'] = false
            this.treeData[val.model.key] = v
          });
        } else {
          this.selectClear(this.currentSelect)
        }
      }
    },
    // 下拉选择框获取焦点执行事件
    handleSelectFocus(val) {
      this.currentSelect = val
      if (this.treeData[val.model.key] === null) {
        if (this.$tools.type(val.data) === 'function') {
          this.treeData[val.model.key + 'Loading'] = true
          const data = {}
          if (val.parentKey && val.parentKey.length > 0) {
            val.parentKey.forEach((v) => {
              data[v] = this.filters[v]
            })
          }
          val.data(data).then((data) => {
            this.treeData[val.model.key + 'Loading'] = false
            this.treeData[val.model.key] = data
            this.selectFocusData[val.model.key] = data
          });
        }
      }
    },
    handleTransfer(val) {
      if (val.childKey && val.childKey.length > 0) {
        val.childKey.forEach((key) => {
          this.filters[key] = this.initData[key]
          this.treeData[key] = null
        })
      }
      if (!this.isEmitByButton) this.handleEmit()
    },
    handleDateChange(key) {
      if (!this.isEmitByButton) this.handleEmit()
    },
    // 将queryItems的model字段映射成filters的model
    // _renderFilters() {
    //   this.queryItems.forEach((val) => {
    //     if (val.model) {
    //       this.$set(this.filters, val.model.key, val.model.value)
    //       if (this.$tools.type(val.data) === 'function' && !val.loadNow) {
    //         this.$set(this.treeData, val.model.key, null)
    //         this.$set(this.treeData, val.model.key + 'Loading', false)
    //       } else if (this.$tools.type(val.data) === 'function' && val.loadNow) {
    //         val.data().then((data) => {
    //           this.$set(this.treeData, val.model.key, data)
    //         });
    //       } else {
    //         this.$set(this.treeData, val.model.key, val.data)
    //       }
    //     }
    //   })
    //   this.initData = Object.assign({}, this.filters)
    // },
    // filtersReset() {
    //   this.queryItems.forEach((val) => {
    //     if (val.model) {
    //       this.$set(this.filters, val.model.key, val.model.haveResetValue ? val.model.resetValue : val.model.value)
    //       if (this.$tools.type(val.data) === 'function' && !val.loadNow) {
    //         this.$set(this.treeData, val.model.key, null)
    //         this.$set(this.treeData, val.model.key + 'Loading', false)
    //       } else if (this.$tools.type(val.data) === 'function' && val.loadNow) {
    //         val.data().then((data) => {
    //           this.$set(this.treeData, val.model.key, data)
    //         });
    //       } else {
    //         this.$set(this.treeData, val.model.key, val.data)
    //       }
    //     }
    //   })
    //   this.initData = Object.assign({}, this.filters)
    // },
    // 按钮的事件
    handleSearch(val) {
      if (val.key === 'search') {
        this.handleEmit()
      } else if (val.key === 'reset') {
        this.filtersReset()
        this.handleEmit()
      } else {
        this.$emit('handleBtnClick', val)
      }
    },
    // 将当前的数据传回父组件
    handleEmit() {
      this.$emit('handleReturnData', this.filters)
    }
  }
}
</script>
<style type="text/css" scoped lang="scss">

</style>
<!--//            queryItems: [  // 从外面传入的queryItems各种类型例子-->
<!--//                {-->
<!--//                    type: 'input',-->
<!--//                    model: {key: 'name', value: ''},-->
<!--//                    label: '医生账户名:'-->
<!--//                },-->
<!--//                {-->
<!--//                    type: 'tree',-->
<!--//                    model: {key: 'treeData', value: {}},-->
<!--//                    label: '所属医院',-->
<!--//                    data: () => {-->
<!--//                        return  new Promise((resolve, reject) => {-->
<!--//                            API.getInstitutions({-->
<!--//                                showReportCount: false-->
<!--//                            }).then(res => {-->
<!--//                                resolve(res);-->
<!--//                            })-->
<!--//                        });-->
<!--//                    }-->
<!--//                },-->
                <!--{-->
                <!--type: 'checkBox',-->
                <!--model: {key: 'sumRecursive', value: []},-->
                <!--data: [{-->
                <!--value: 1,-->
                <!--label: '只看本院'-->
                <!--}]-->
                <!--},-->
<!--//                {-->
<!--//                    type: 'select',-->
<!--//                    model: {key: 'statu', value: ''},-->
<!--//                    data: [{-->
<!--//                        value: false,-->
<!--//                        label: '正常'-->
<!--//                    }, {-->
<!--//                        value: true,-->
<!--//                        label: '禁用'-->
<!--//                    }],-->
<!--//                    label:  '状态'-->
<!--//                },-->
<!--//                {-->
<!--//                    type: 'date',-->
<!--//                    model: {key: 'date', value: []},-->
<!--//                },-->
<!--//                {-->
<!--//                    type: 'actions',-->
<!--//                    actions: [-->
<!--//                        {label: '查询', type: 'primary', key:'search'},-->
<!--//                        {label: '重置', key:'reset'},-->
<!--//                        {label: '新建', type: 'success', key:'add'}-->
<!--//                    ]-->
<!--//                }-->
<!--//            ],-->
