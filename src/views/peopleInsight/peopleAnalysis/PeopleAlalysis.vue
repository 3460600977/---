<template>
  <div class="people-alalysis">
    <headerCondition/>

    <arealDistribution/>
  </div>
</template>

<script>
import headerCondition from './modeles/headerCondition'
import arealDistribution from './modeles/arealDistribution'

export default {
  components: {
    headerCondition,
    arealDistribution,
  },
  data() {
    return {
      
    }
  },
}
</script>

<style lang="scss">
  .people-alalysis{
    padding: 0 20px 20px;
  }
</style>