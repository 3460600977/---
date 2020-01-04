<template>
  <!-- 行业选择和回显 -->
  <div>
  <el-cascader
    :class="{'just-display': !originStyle}"
    ref="industryList"
    :disabled="disabled"
    v-model="industryList.checkedData.value"
    filterable
    @focus="focusIndustry"
    @change="changeData"
    placeholder="请选择"
    :options="industryList.data"
    :props="industryList.props">
  </el-cascader>
  </div>
</template>

<script>
export default {
  props: {
    // 原生禁止点击
    disabled: {
      type:Boolean,
      default: false
    },

    // 样式
    originStyle: {
      type: true,
      default: true,
    },

    // 回显的值
    value: {
      type: String,
      default: ''
    }
  },


  data() {
    return {
      industryList: {
        loading: false,
        data: [],
        checkedData: {
          name: '',
          value: ''
        },
        props: {
          value: 'industryId',
          label: 'name',
          expandTrigger: 'hover',
          emitPath: false
        }
      }
    }
  },

  beforeMount: async () => {
    
  },


  methods: {
    // 行业列表
    focusIndustry: async function () {
      this.industryList.loading = true;

      if (this.industryList.data.length > 0) {
        this.industryList.loading = false;
        return;
      };

      this.industryList.data = await this.getIndustryList()

      this.industryList.loading = false;
    },

    // 行业列表
    getIndustryList: async function () {
      return new Promise((resolve, reject) => {
        this.$api.IndustryList.AllList()
          .then(res => {
            resolve(res.result)
          })
          .catch(res => {
            reject(res)
          })
      })
    },

    // 选中
    changeData() {
      this.industryList.checkedData.name = this.$refs.industryList.getCheckedNodes()[0] ? this.$refs.industryList.getCheckedNodes()[0].label : '行业';
      this.$emit('changeIndustry', this.industryList.checkedData)
    }
  },

  watch: {
    value: {
      handler: async function(val) {
        this.industryList.data = await this.getIndustryList();
        this.industryList.checkedData.value = val;
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss">
  .just-display{
    height: 14px;
    line-height: 14px;
    .el-input__inner{
      height: 14px;
      line-height: 14px;
      border: none;
      color: $color-text-1 !important;
      padding: 0;
      background-color: transparent !important;
    }
    .el-input__suffix{
      display: none;
    }
    &::after{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: block;
      content: "";
    }
  }
</style>