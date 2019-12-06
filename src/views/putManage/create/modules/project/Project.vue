<template>
  <div class="create-project">
    <CreativeNewProject/>
  </div>
</template>

<script>
import CreativeNewProject from './modules/CreativeNewProject.vue'
import ExistProjectList from './modules/ExistProjectList'
import { mapMutations } from 'vuex'
export default {
  components: {
    CreativeNewProject,
    ExistProjectList
  },

  data() {
    return{
      activeName: 'create'
    }
  },

  methods: {
    ...mapMutations(['setLeftStep'])
  },
  
  beforeMount() {
    this.setLeftStep({rootActiveIndex: 1, subActiveIndex: 0})
  }
}
</script>