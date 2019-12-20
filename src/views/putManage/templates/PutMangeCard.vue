<template>
  <article class="put-manage-card clearfix">
    <div class="font-16" v-if="title">{{title}}</div>
    <slot></slot>
  </article>
</template>

<script>
export default {
  name: 'PutMangeCard',
  props: {
    title: {
      type: String,
      default: ""
    }
  }
}
</script>

<style lang="scss">
  .put-manage-card{
    overflow: hidden;
    padding: 30px 38px;
    border-radius:4px;
    background-color: #fff;
    &+.put-manage-card{
      margin-top: 10px;
    }
  }
</style>