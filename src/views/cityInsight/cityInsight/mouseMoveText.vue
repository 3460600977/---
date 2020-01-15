<template>
    <div class="text font-14">
      {{text[currentSelectType.type]}}
    </div>
</template>

<script>
  export default {
    name: "mouseMoveText",
    props: {
      currentSelectType: {
        type: Object,
        default: null
      },
    },
    data() {
      return {
        text: {
          circle: '点击左键标记位置，右鍵或Esc退出',
          polyline: '单击确定起点，双击结束绘制',
          polygon: '单击确定选点，至少选择3个点，双击结束绘制'
        }
      }
    },
    watch: {
    },
    methods: {

    },
  }
</script>

<style scoped lang='scss'>
.text {
  line-height:26px;
  padding: 0 12px;
  background:rgba(255,255,255,1);
  border:1px solid $color-main;
  white-space: nowrap;
}
</style>
