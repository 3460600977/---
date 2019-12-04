<template>
  <div id="creative-list">
    <top-tabs></top-tabs>
    <el-form :inline="true" :model="creativeFormInline" class="demo-form-inline">
      <el-form-item label="投放计划名称">
        <el-select v-model="creativeFormInline.project_status" placeholder="不限" clearable>
          <el-option
            v-for="item in project_status_options"
            :key="item.id"
            :label="item.status"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="投放方案名称">
        <el-select v-model="creativeFormInline.project_status" placeholder="不限" clearable>
          <el-option
            v-for="item in project_status_options"
            :key="item.id"
            :label="item.status"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="广告创意名称">
        <el-input v-model="creativeFormInline.creativeName" placeholder="广告创意名称"></el-input>
      </el-form-item>
      <el-form-item label="方案状态">
        <el-select v-model="creativeFormInline.project_status" placeholder="选择" clearable>
          <el-option
            v-for="item in project_status_options"
            :key="item.id"
            :label="item.status"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="primary" @click="onSubmit">新建广告创意</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" :header-cell-class-name="handleHeaderClass"
              border style="width: 100%;text-align:center">
      <el-table-column prop="date" width="180"
                       v-bind:label="col.col_name"
                       v-for="col in tableCol"
                       v-bind:key="col.id">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
    import manageList from '../../../../../components/ManageList'

    export default {
        name:'creativeList',
        components: {
            manageList,
        },
        data() {
            return {
                activeName: 'second',
                project_status_options: [
                    {id: 1, status: '详情'},
                    {id: 2, status: '删除'},
                    {id: 3, status: '修改'}
                ],
                creativeFormInline: {
                    user: '',
                    creativeName: '',
                    project_status: '',
                },
                tableCol: [
                    {id: 1, col_name: '广告创意名称'},
                    {id: 2, col_name: '操作'},
                    {id: 3, col_name: '创意状态'},
                    {id: 4, col_name: '屏幕类型'},
                    {id: 5, col_name: '创意行业'}
                ],
                tableData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }]
            }
        },
        methods: {
            handleHeaderClass: function (row, column, rowIndex, columnIndex) {
                return 'header-group'
            },
            onSubmit() {
                console.log('submit!');
            },
            handleClick(tab, event) {
                if (tab.name === 'plan') {
                    this.$router.push({
                        path: '/plan/list',
                    })
                } else if (tab.name === 'project') {
                    this.$router.push({
                        path: '/project/list',
                        query: {
                            planId: item.merchantNumber,
                        }
                    })
                } else if (tab.name === 'creative') {
                    this.$router.push({
                        path: '/creative/list',
                        query: {
                            planId: item.merchantNumber,
                            projectId: item.merchantNumber,
                        }
                    })
                }
            }
        }
    }
</script>

<style lang="scss">
  #creative-list {
    .header-group {
      background: #F2F2F2;
      color: #303133;
      text-align: center;
    }

    td {
      text-align: center;
    }
  }
</style>
