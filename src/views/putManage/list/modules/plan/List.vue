<template>
  <div class="list">
    <el-form :inline="true" :model="creativeFormInline" class="list-form-inline" inline>
      <el-form-item class="line-space" label="投放计划名称">
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
      <el-form-item class="line-space" label="投放方案名称">
        <el-select v-model="creativeFormInline.project_status" placeholder="不限" clearable>
          <el-option
            v-for="item in project_status_options"
            :key="item.id"
            :label="item.status"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="line-space" label="广告创意名称">
        <el-input v-model="creativeFormInline.creativeName" placeholder="广告创意名称"></el-input>
      </el-form-item>
      <el-form-item class="line-space" label="方案状态">
        <el-select v-model="creativeFormInline.project_status" placeholder="选择" clearable>
          <el-option
            v-for="item in project_status_options"
            :key="item.id"
            :label="item.status"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="list-query-button">
        <el-button type="default" @click="onSubmit">查询</el-button>
      </el-form-item>
      <el-form-item class="list-new-button">
        <el-button type="primary" @click="onSubmit">新建广告创意</el-button>
      </el-form-item>
    </el-form>
    <div class="query_result">
      <el-table :data="tableData" class="list_table">
        <el-table-column prop="name" label="广告创意名称"></el-table-column>
        <el-table-column prop="status" label="创意状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === '待审核'" class="pending_status">
              待审核
            </span>
            <span v-else-if="scope.row.status === '审核通过'" class="pass_status">
              审核通过
            </span>
            <span v-else-if="scope.row.status === '审核拒绝'" class="deny_status">
              审核拒绝
            </span>
            <span v-else>
              NA
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="屏幕类型"></el-table-column>
        <el-table-column prop="industry" label="创意行业"></el-table-column>
        <el-table-column prop="action" label="操作">
          <template slot-scope="scope">
            <div v-if="scope.row.status === '待审核'">
              <span class="icon-space">
                <i class="el-icon-s-unfold icon-color"></i>详情
              </span>
              <span class="icon-space">
                <i class="el-icon-error icon-color"></i>删除
              </span>
            </div>
            <div v-else-if="scope.row.status === '审核通过'">
              <span class="icon-space">
                <i class="el-icon-s-unfold icon-color"></i>详情
              </span>
            </div>
            <div v-else-if="scope.row.status === '审核拒绝'">
              <span class="icon-space">
                <i class="el-icon-s-unfold  icon-color"></i>详情
              </span>
              <span class="icon-space">
                <i class="el-icon-edit  icon-color"></i>编辑
              </span>
              <span class="icon-space">
                <i class="el-icon-error icon-color"></i>删除
              </span>
            </div>
            <span v-else>
              NA
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="1000" :page-sizes="[10, 20, 30, 40,50]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        class="list-page">
      </el-pagination>
    </div>
  </div>
</template>

<script>
    export default {
        name: "planList",
        data() {
            return {
                currentPage: 50,
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
                tableData: [
                    {
                        name: '王小虎',
                        status: '待审核',
                        category: '联动',
                        industry: '电商',
                    }, {
                        name: '王小虎',
                        status: '审核通过',
                        category: '联动',
                        industry: '电商',
                    }, {
                        name: '王小虎',
                        status: '审核拒绝',
                        category: '联动',
                        industry: '电商',
                    }, {
                        name: '王小虎',
                        status: '审核通过',
                        category: '联动',
                        industry: '电商',
                    }, {
                        name: '王小虎',
                        status: '审核通过',
                        category: '联动',
                        industry: '电商',
                    }, {
                        name: '王小虎',
                        status: '审核通过',
                        category: '联动',
                        industry: '电商',
                    }, {
                        name: '王小虎',
                        status: '审核通过',
                        category: '联动',
                        industry: '电商',
                    }, {
                        name: '王小虎',
                        status: '待审核',
                        category: '联动',
                        industry: '电商',
                    }, {
                        name: '王小虎',
                        status: '待审核',
                        category: '联动',
                        industry: '电商',
                    }, {
                        name: '王小虎',
                        status: '待审核',
                        category: '联动',
                        industry: '电商',
                    }, {
                        name: '王小虎',
                        status: '待审核',
                        category: '联动',
                        industry: '电商',
                    }, {
                        name: '王小虎',
                        status: '待审核',
                        category: '联动',
                        industry: '电商',
                    }, {
                        name: '王小虎',
                        status: '待审核',
                        category: '联动',
                        industry: '电商',
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
            },

            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
            },
            formatStatus(row, column) {

            },
            formatAction(row, column) {

            }
        }
    }
</script>

<style lang='scss'>
  .list {
    .query_result {
      background-color: $color-bg;

      .list_table {
        .pending_status {
          background-color: $color-bg-2;
          background: $color-bg-2;
          box-shadow: 0px 2px 4px 0px $color-shadow-1;
          border-radius: 4px;
          padding: 6px 14px;
        }

        .pass_status {
          background: $color-blue;
          box-shadow: 0px 2px 4px 0px $color-shadow-2;
          border-radius: 4px;
          padding: 6px 14px;
          color: $color-bg-3;
        }

        .deny_status {
          width: 70px;
          height: 24px;
          background: $color-red;
          box-shadow: 0px 2px 4px 0px $color-shadow-3;
          border-radius: 4px;
          padding: 6px 14px;
          color: $color-bg-3;
        }

        div.cell {
          overflow: unset !important;
        }

        span i.icon-color {
          color: $color-blue;
          margin-right: 8px;
        }

        span.icon-space {
          margin-right: 35px;
        }
      }
    }

    .list-form-inline {

      margin: 0;
      padding-top: 17px;
      padding-left: 15px;


      .el-form-item {
        margin-bottom: 37px;
      }


      .list-new-button {
        float: right;
        margin-right: 8px;
      }

      .list-new-button button {
        height: 36px;
      }


      .list-query-button {
        margin-left: 10px;
      }

      .list-query-button button {
        width: 80px;
        height: 36px;
      }
    }

    .line-space {
      margin-left: 10px;
      margin-right: 0 !important;
    }

    .line-space:first-child {
      margin-left: 0;
    }

    .list_table {
      background-color: $color-bg;

      .el-table__header, .el-table__body, .el-table__footer {
        border-collapse: collapse;
      }

      table {
        width: 100%;
        text-align: center;
      }

      td, th {
        font-size: 14px;
        padding: 14px 0 14px 20px;
        color: $color-text;
      }

      td {
        border-top: 10px solid $color-bg;
        padding-left: 17px;
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
    }

    .el-table tbody tr:hover > td {
      background-color: $color-bg-3 !important;
    }

    .list-page {
      background-color: $color-bg-3;
      padding: 54px 0;
      text-align: center;
      border-radius: 4px;
      height: 120px;
      margin-top: 33px;
    }
  }
</style>

