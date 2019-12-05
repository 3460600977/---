<template>
  <div class="list">
    <el-form :inline="true" :model="creativeFormInline" class="list-form-inline clearfix">
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
        <el-button type="primary" plain @click="onSubmit">查询</el-button>
      </el-form-item>
      <el-form-item class="list-new-button">
        <router-link to="/putManage/create/plan">
          <el-button type="primary" @click="onSubmit">新建投放方案</el-button>
        </router-link>
      </el-form-item>
    </el-form>

    <div class="query_result">
      <el-table :data="tableData" class="list_table">
        <el-table-column prop="name" label="投放方案名称"></el-table-column>
        <el-table-column prop="name" label="投放方案名称"></el-table-column>
        <el-table-column prop="status" label="创意状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === '待审核'" class="pending status">
              待审核
            </span>
            <span v-else-if="scope.row.status === '审核通过'" class="pass status">
              审核通过
            </span>
            <span v-else-if="scope.row.status === '审核拒绝'" class="deny status">
              审核拒绝
            </span>
            <span v-else>
              NA
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="投放类型"></el-table-column>
        <el-table-column prop="category" label="屏幕类型"></el-table-column>
        <el-table-column prop="industry" label="投放城市"></el-table-column>
        <el-table-column prop="industry" label="投放时间"></el-table-column>
        <el-table-column prop="action" label="操作" fixed="right" width="400">
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
@import '../listCommonStyle.scss';
</style>