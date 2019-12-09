<template>
  <div class="my-radio clearfix" 
    :class="{'active': active}">
    <div class="my-r-button">
      <i :class="{'el-icon-check': active}"></i>
    </div>
    <label class="label mid">
      <slot>选项</slot>
    </label>
  </div>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
  .my-radio{
    cursor: pointer;
    min-height: 36px;
    line-height: 36px;
    display: inline-flex;
    align-items: center;
    margin-right: 40px;
    &.active{
      .my-r-button{
        border-color: $color-main;
        background:rgba(45,90,255,0.1);
      }
    }
    .my-r-button{
      cursor: pointer;
      float: left;
      width: 22px;
      height: 22px;
      text-align: center;
      line-height: 22px;
      border-radius: 100%;
      border: 1px solid $color-border;
      >i{
        color: $color-main;
        font-weight: bold;
      }
    }
    .label{
      cursor: pointer;
      float: left;
      line-height: 22px;
      min-height: 22px;
      margin-left: 10px;
      color: $color-text;
    }
  }
</style>