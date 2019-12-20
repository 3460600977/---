<template>
  <div>
    <el-form :model="filters" :inline="true" :label-width="labelWidth">
      <template v-for="(val, index) in queryItems">
        <el-form-item v-if="val.type === 'input'" :label="val.label">
          <el-input
            v-model.trim="filters[val.key]"
            clearable
            placeholder="请输入"
            @keyup.enter.native="handleTransfer"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="val.type === 'select'" :label="val.label">
          <el-select
            ref="select"
            v-model="filters[val.key]"
            placeholder="请选择"
            :value-key="val.seriseValue"
            @change="handleTransfer(val)">
            <el-option
              v-for="(item, index) in treeData[val.key]"
              :key="index"
              :label="item[val.seriseLabel]"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="val.type === 'date'" :label="val.label">
          <el-date-picker
            v-model="filters[val.key]"
            :picker-options="val.options?val.options:reportTimePicker"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="center"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @change="handleDateChange(val.key)"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="val.type === 'actions'" class="actions">
          <template v-for="(v, i) in val.actions">
            <el-button v-if="v.type !== 'slot'" :type="v.type" size="small" :plain="v.plain" @click="handleSearch(v)"> {{v.label}}</el-button>
            <slot v-else :name="v.name"></slot>
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
      default: true
    },
    queryItems: {
      type: Array,
      required: true
    },
    labelWidth: {
      type: String,
      default: '82px'
    },
    queryFilters: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      treeData: {},
      filters: {},
      initData: {},
      reportTimePicker: {
        shortcuts: [
          {
            text: '今日',
            onClick:(picker) => {
              const now = new Date();
              const end = new Date(now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate() + ' 23:59:00');
              const start = new Date(now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate() + ' 00:00:00');
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一周',
            onClick:(picker) => {
              picker.$emit('pick', this.$tools.calcShortCuts(7));
            }
          }, {
            text: '最近一个月',
            onClick:(picker) => {
              picker.$emit('pick', this.$tools.calcShortCuts(30));
            }
          }, {
            text: '最近三个月',
            onClick:(picker) => {
              picker.$emit('pick', this.$tools.calcShortCuts(90));
            }
          }]
      }
    }
  },
  created() {
    this.filters = this.$tools.deepCopy(this.queryFilters)
    this.initData = this.$tools.deepCopy(this.queryFilters)
    this.getOptions()
  },
  methods: {
    handleTransfer(val) {
      if (!this.isEmitByButton) this.handleEmit()
    },
    handleDateChange(key) {
      if (!this.isEmitByButton) this.handleEmit()
    },
    // 加载可选项
    getOptions() {
      this.queryItems.forEach((val) => {
        if (this.$tools.type(val.data) === 'function') {
          val.data().then((data) => {
            this.$set(this.treeData, val.key, data)
          });
        }
      })
    },
    filtersReset() {
      this.filters = this.initData
    },
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

<!--
  目前支持：
    input,
    单选的select,
    date类型
  按钮：search会emit出当前数据 reset会将数据重置到初始状态
  queryItems: [ // 配置项
    {
      type: 'input',
      key: 'orderNumber',
      label: '订单编号:'
    },
    {
      type: 'date',
      key: 'date',
      label: '订单编号:'
    },
    { // select最后会返回整个item
      type: 'select',
      key: 'select',
      seriseLabel: 'id', // select-option显示的字段
      seriseValue: 'name', // select-option作为value的字段
      label: '门店名称:',
      data: () => { // select-option可选项数据，必须是一个promise函数
        return new Promise((resolve, reject) => {
          let roleData = [
            {name: '全部角色', id: ''},
            {name: '上传医生', id: 'ROLE_UPLOADER'},
            {name: '标注医生', id: 'ROLE_EDITOR'},
            {name: '审核医生', id: 'ROLE_AUDITOR'},
            {name: '数据管理员', id: 'ROLE_ADMINISTRATOR'},
          ]
          resolve(roleData);
        });
      },
    },
    {
      type: 'actions',
      actions: [
        {label: '查询', key: 'search', type: 'primary', plain: true},
        {label: '重置', key: 'reset'},
        {type: 'slot', name: 'btn'} // 渲染在按钮中的slot, name为slot的name
      ]
    }
  ],
-->
<!--
queryFilter字段名必须对应queryItems中每一项key的值，字段名后的值为那个item的初始化值
queryFilter: {
  orderNumber: '',
  select:  {name: '上传医生', id: 'ROLE_UPLOADER'},
  date: [this.$tools.formatDate(new Date(),  'yy-MM-dd'), this.$tools.formatDate(new Date(),  'yy-MM-dd')],
},
-->
<!--
handleReturnData：emit出的当前所有字段的值 会在点击查询，重置，及选择时调用
<query-item :queryItems="queryItems" :queryFilters="queryFilter" @handleReturnData="handleReturnData">
  <template #btn>
    <el-button type="primary">主要按钮</el-button>
  </template>
</query-item>
-->
