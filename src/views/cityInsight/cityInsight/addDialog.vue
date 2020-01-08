<template>
    <div>
        <el-dialog
          title="添加资源"
          class="my-dialog"
          :visible.sync="dialogVisible"
          width="1000px"
          :before-close="handleClose">
          <div class="mid-start">
            <p style="margin-right: 24px">楼盘名称</p>
            <search-input
              style="width: 392px"
              ref="addSearchInput"
              :isClear="false"
              firstLabel="premisesName"
              secondLabel="address"
              noData="无楼盘信息，请确认楼盘名称是否正确"
              @querySearchAsync="querySearchAsync"
              @selectLocation="selectLocation"
            ></search-input>
            <p style="margin-left: 24px" class="color-red" v-show="isExist">* 资源包已包含该楼盘</p>
          </div>
        </el-dialog>
    </div>
</template>

<script>
  import searchInput from "../../../components/searchInput";
  export default {
    name: "addDialog",
    props: {
      cityCode: {
        type: [String, Number]
      },
    },
    components: {
      searchInput
    },
    data() {
      return {
        dialogVisible: false,
        isExist: false,
      }
    },
    methods: {
      show() {
        this.dialogVisible = true
      },
      handleClose() {
        this.isExist = false
        this.dialogVisible = false
      },
      querySearchAsync(val) {
        this.isExist = false
        this.$api.cityInsight.searchBuildingByWord({city: this.cityCode, name: val}).then((data) => {
          this.$refs.addSearchInput.setSearchList(data.result)
        })
      },
      selectCallBack(val) {
        if (val) {
          this.isExist = true
        } else {
          this.$refs.addSearchInput.val = ''
          this.handleClose()
        }
      },
      selectLocation(val) {
        this.$emit('selectLocation', val)
      },
    },
  }
</script>

<style scoped lang='scss'>

</style>
