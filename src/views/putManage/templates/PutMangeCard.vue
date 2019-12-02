<template>
  <article class="put-manage-card">
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
    padding: 30px 38px;
    border-radius:4px;
    background-color: #fff;
  }
</style>