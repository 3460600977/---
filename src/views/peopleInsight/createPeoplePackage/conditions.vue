<template>
    <div class="wrapper">
      <div class="font-0 mid-start">
        <p class="label">城市：</p>
        <div class="flex1 tags">
          <el-tag
            v-for="(tag, index) in tags"
            :key="index"
            closable
          >
            {{tag.name}}
          </el-tag>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    name: "conditions",
    props: {
      data: {
        type: Array,
        required: true
      },
    },
    data() {
      return {
        tags: [
          { name: '标签一', type: '' },
          { name: '标签二自动发送到士大夫似的', type: 'success' },
          { name: '标签三', type: 'info' },
          { name: '标签四', type: 'warning' },
          { name: '标签五', type: 'danger' },
          { name: '标签三', type: 'info' },
          { name: '标签四', type: 'warning' },
          { name: '标签五', type: 'danger' },
          { name: '标签一', type: '' },
          { name: '标签二', type: 'success' },
          { name: '标签三', type: 'info' },
          { name: '标签四', type: 'warning' },
          { name: '标签五', type: 'danger' },
          { name: '标签三', type: 'info' },
          { name: '标签四', type: 'warning' },
          { name: '标签五', type: 'danger' }
        ]
      }
    }
  }
</script>

<style scoped lang='scss'>
  .wrapper {
    padding: 0 0 0 30px;
    & /deep/ .el-tag .el-tag__close {
      color: $color-border;
    }
  }
  .label {
    display: inline-block;
    font-size:14px;
    width: 90px;
    align-self: baseline;
  }
  .el-tag + .el-tag {
    margin-right: 0px;
  }
  .el-tag {
    margin-bottom: 20px;
    background: transparent;
    color: $color-text;
    border-color: $color-border;
    &:hover {
      color: $color-main;
      border-color: $color-main;
      .el-tag .el-tag__close {
        color: $color-main;
      }
    }
  }
  .tags .el-tag {
    margin-right: 20px;
  }
</style>
