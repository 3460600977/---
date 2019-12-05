<template>
  <div class="create-project">
    <CreativeNewProject/>
  </div>
</template>

<script>
import CreativeNewProject from './modules/CreativeNewProject.vue'
import ExistProjectList from './modules/ExistProjectList'
export default {
  components: {
    CreativeNewProject,
    ExistProjectList
  },
  data() {
    return{
      activeName: 'create'
    }
  }
}
</script>