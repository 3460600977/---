<template>
    <div class="p-i-w">
      <div class="p-i-c">
        <div class="mid-column">
          <div class="top mid-start">
            <el-input class="input" v-model="name" clearable placeholder="输入人群包名称"></el-input>
            <el-button type="primary" class="margin-left-20 pl-btn" plain @click="resetLoad">查询</el-button>
            <el-button type="primary" class="margin-left-20 pl-btn" @click="toCreate">去创建</el-button>
          </div>
          <div class="list flex1 margin-top-20 clearfix">
            <div style="height: 205px">
              <div class="list-item hand"
                   v-for="(item, index) in resultData"
                   @click="handleClick(item)"
                   :class="activeItem && item.id === activeItem.id?'active': ''"
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
        <div class="tags margin-left-30 customScroll" >
          <p class="bold" style="border-bottom: 1px dashed #E5E7E9;line-height: 40px;padding-left: 20px">人群包条件</p>
          <div class="mid-start" style="padding-left: 20px" v-for="(item, index) in tags" :key="index">
            <p class="title">{{item.name}}：</p>
            <div class="mid-start pi-tags">
              <p v-for="(v, k) in item.tags" :key="k">{{v.name}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="mid-between" style="margin-top: 24px;">
        <div style="font-size: 0">
          <el-button @click="hide" class="pl-btn2">取消</el-button>
          <el-button type="primary" class="margin-left-20 pl-btn2" @click="returnResult">保存</el-button>
        </div>
        <!-- <div class="switch" v-if="switchValue !== null">
          <span style="margin-right: 15px">热力图开关</span>
          <el-switch
            v-model="switchValue"
            :width="30"
            @change="change"
            >
          </el-switch>
        </div> -->
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
      hotMapItem: {
        type: Object,
        default: null
      }
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
    created() {
      if (this.hotMapItem) {
        // this.activeItem = this.hotMapItem
        this.setSwitchValue(true)
      }
    },
    watch: {
      activeItem(val) {
        if (val === null) {
          this.tags = []
        } else {
          this.$api.peopleInsight.getPeopleInsightDetail(val.id).then((data) => {
            this.tags = JSON.parse(data.result.tagsName)
          })
        }
      },
    },
    methods: {
      setSwitchValue(val) {
        this.switchValue = val
      },
      toCreate() {
        this.$router.push('/peopleInsight/createCrowd')
      },
      resetSelect() {
        this.activeItem = null
        this.switchValue = null
        this.tags = null
        // this.resultData = []
        this.$emit('update:hotMapItem', null)
        // this.hotMapItem = null
        // this.pageIndex = 1
        // this.filterData.pageIndex = 1
      },
      handleClick(item) {
        this.activeItem = item
      },
      change(val) {
        this.$emit('switchChange', val)
      },
      hide() {
        this.$emit('hide')
      },
      loadFunction(param) {
        const data = { ...param, name: this.name, city: this.city.cityCode }
        return new Promise((resolve, reject) => {
          this.$api.peopleInsight.getPeopleInsightList(data).then(res => {
            if (!res.result) this.tags = null
            if (this.activeItem) {
              let index = this.jug(this.activeItem.id, res.result)
              if (index === -1) {
                this.tags = null
                this.activeItem = null
              }
            }
            resolve(res);
          }).catch((res) => {
            reject(res)
          })
        });
      },
      jug(id, arr) {
        let index = arr.findIndex((item) => {
          return item.id === id
        })
        return index
      },
      returnResult() {
        // if (this.hotMapItem && this.hotMapItem === this.activeItem) {
        //   this.$emit('hide')
        //   return
        // }
        // this.hotMapItem = this.activeItem
        if (this.hotMapItem && this.activeItem.id === this.hotMapItem.id) {
          this.$message.error('所选人群包与当前人群包完全相同，请选择其他人群包进行定制推荐！');
          return
        }
        // this.$emit('update:hotMapItem', this.activeItem)
        this.$emit('returnResult', this.activeItem)
      },
    },
  }
</script>

<style scoped lang='scss'>
.p-i-w {
  padding: 30px 20px;
  .pl-btn {
    width: 80px;
    height: 36px;
  }
  .pl-btn2 {
    width: 100px;
    height: 34px;
  }
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
    padding-bottom: 20px;
    border: 1px dashed $color-border;
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
