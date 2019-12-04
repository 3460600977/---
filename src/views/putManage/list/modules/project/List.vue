<template>
  <div class="list">
    <el-form :inline="true" :model="creativeFormInline" class="list-form-inline" inline>
      <el-row class="list-form-row">
        <el-col :span="4" class="line-space">
          <el-form-item label="投放计划名称">
            <div slot="label">投放计划名称</div>
            <el-select v-model="creativeFormInline.project_status" placeholder="不限" clearable>
              <el-option
                v-for="item in project_status_options"
                :key="item.id"
                :label="item.status"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4" class="line-space">
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
        </el-col>
        <el-col :span="4" class="line-space">
          <el-form-item label="广告创意名称">
            <el-input v-model="creativeFormInline.creativeName" placeholder="广告创意名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4" class="line-space">
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
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button type="default" @click="onSubmit">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">新建广告创意</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="tableData" style="width: 100%;text-align:center" class="list_table">
      <el-table-column prop="date"
                       v-bind:label="col.col_name"
                       v-for="col in tableCol"
                       v-bind:key="col.id">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
    export default {
        name: "planList",
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

<style lang='scss'>
  .list {

  }

  .list-form-inline {
    .list-form-row {
      margin: 0;
      padding-top: 17px;
      padding-left: 38px;
      white-space: nowrap;
    }

    .el-form-item {
      margin-bottom: 37px;
    }

    .line-space {
      margin-right: 30px;
    }

    .el-col:nth-last-of-type(4) {
      margin-right: 20px;
    }


    /*:first-child.el-form-item {*/
    /*  padding-left: 38px;*/
    /*}*/
  }

  .list_table {
    background-color: $color-bg !important;

    th {
      background-color: $color-bg !important;
    }

    td {
      border-bottom: 10px solid $color-bg !important;
      border-radius: 4px
    }
  }
</style>

