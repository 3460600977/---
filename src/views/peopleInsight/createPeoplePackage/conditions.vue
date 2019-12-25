<template>
    <div>
      <div class="font-0 mid-row">
        <p class="label">城市：</p>
        <div class="flex1">
          <el-tag
            v-for="tag in tags"
            :key="tag.name"
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
          { name: '标签二', type: 'success' },
          { name: '标签三', type: 'info' },
          { name: '标签四', type: 'warning' },
          { name: '标签五', type: 'danger' }
        ]
      }
    }
  }
</script>

<style scoped lang='scss'>
  .label {
    display: inline-block;
    font-size:14px;
    width: 90px;
  }
  .el-tag + .el-tag {
    margin-right: 30px;
  }
  .el-tag {
    margin-bottom: 20px;
  }
</style>
