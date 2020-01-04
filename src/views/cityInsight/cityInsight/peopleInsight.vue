<template>
    <div class="p-i-w">
      <div class="p-i-c">
        <div class="mid-column">
          <div class="top mid-start">
            <el-input class="input" v-model="name" placeholder="输入人群洞察名称"></el-input>
            <el-button type="primary" class="margin-left-20" plain @click="resetLoad">查询</el-button>
            <el-button type="primary" class="margin-left-20">去创建</el-button>
          </div>
          <div class="list flex1 margin-top-20 clearfix">
            <div style="height: 205px">
              <div class="list-item hand"
                   v-for="(item, index) in resultData"
                   @click="handleClick(item)"
                   :class="item.id === activeItem?'active': ''"
                   :key="index"
              >{{item.name}}</div>
            </div>
            <el-pagination
              background
              layout="total, prev, pager, next"
              :total="totalCount"
              :page-size="pageSize"
              :page-sizes="pageSizeSelectable"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageIndex"
              class="list-page float-right margin-top-20"
            ></el-pagination>
          </div>
        </div>
        <div class="tags margin-left-30 customScroll" v-if="tags">
          <div class="mid-start" v-for="(item, index) in tags" :key="index">
            <p class="title">{{item.name}}：</p>
            <div class="mid-start pi-tags">
              <p v-for="(v, k) in item.tags" :key="k">{{v.name}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="mid-between" style="margin-top: 24px;">
        <div style="font-size: 0">
          <el-button @click="hide">取消</el-button>
          <el-button type="primary" class="margin-left-20" @click="returnResult">保存</el-button>
        </div>
        <div class="switch" v-if="switchValue !== null">
          <span style="margin-right: 15px">热力图开关</span>
          <el-switch
            v-model="switchValue"
            :width="30"
            @change="change"
            >
          </el-switch>
        </div>
      </div>
    </div>
</template>

<script>
  import {tableMixin} from "../../../mixins/tableMixin";
  export default {
    name: "peopleInsight",
    mixins: [tableMixin],
    props: {
      city: {
        type: Object,
        required: true
      },
    },
    data() {
      return {
        name: '',
        tags: null,
        switchValue: null,
        activeItem: null,
        pageSizeSelectable: [5, 10, 15, 20],
        pageSize: 5,
      }
    },
    watch: {
      activeItem(val) {
        this.$api.peopleInsight.getPeopleInsightDetail(val).then((data) => {
          this.tags = JSON.parse(data.result.tagsName)
          // this.tags =
          //   [{"name":"教育水平","tid":3098,"tags":[{"tid":3099,"pid":3098,"name":"高中及以下","childTags":null},{"tid":20606,"pid":3098,"name":"大专","childTags":null},{"tid":32994,"pid":3098,"name":"本科及以上","childTags":null}]},{"name":"性别","tid":19397,"tags":[{"tid":19398,"pid":19397,"name":"男","childTags":null}]},{"name":"城市","tid":99999,"tags":[{"tid":189,"name":"南充市"}]},{"name":"影视音乐","tid":1,"tags":[{"tid":107786,"pid":1,"name":"综艺","childTags":null}]},{"name":"游戏","tid":8,"tags":[{"tid":8,"pid":42,"name":"有兴趣偏好","childTags":null}]}]
        })
      },
    },
    methods: {
      resetSelect() {
        this.activeItem = null
        this.switchValue = null
        this.tags = null
        this.pageIndex = 1
        this.filterData.pageIndex = 1
      },
      handleClick(item) {
        this.activeItem = item.id
      },
      change(val) {
        this.$emit('switchChange', val)
      },
      hide() {
        // this.resetSelect()
        this.$emit('hide')
      },
      loadFunction(param) {
        const data = { ...param, name: this.name, city: this.city.cityCode }
        return new Promise((resolve, reject) => {
          this.$api.peopleInsight.getPeopleInsightList(data).then(res => {
            this.activeItem = res.result[0].id
            resolve(res);
          }).catch((res) => {
            reject(res)
          })
        });
      },
      returnResult() {
        this.switchValue = true
        this.$emit('returnResult', this.activeItem)
      },
    },
  }
</script>

<style scoped lang='scss'>
.p-i-w {
  padding: 30px 20px;
  .pi-tags {
    flex-flow: wrap;
    p {
      padding: 12px 10px;
      border-radius:2px;
      border: 1px solid $color-border;
      margin-right: 10px;
      margin-top: 20px;
    }
  }
  .title {
    width: 80px;
    flex-shrink: 0;
  }
  .p-i-c {
    display: flex;
    justify-content: flex-start;
  }
  .switch /deep/ {
    .el-switch__core:after {
      height: 14px;
      width: 14px;
      top: 0;
    }
    .el-switch__core {
      height: 16px;
    }
    .el-switch.is-checked .el-switch__core::after {
      margin-left: -14px;
    }
  }
  .input {
    width: 240px;
  }
  .active {
    color: $color-main;
  }
  .tags {
    width: 309px;
    height: 327px;
    overflow-y: auto;
    padding-left: 20px;
    padding-bottom: 20px;
    border: 1px dashed $color-main;
  }
  .list {
    width:440px;
    border: 1px solid $color-border;
    line-height: 40px;
    color: $color-text-1;
    .list-item {
      border-bottom: 1px solid $color-border;
      padding: 0 12px;
    }
  }
}
</style>
