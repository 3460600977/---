import Vue from 'vue'
import VueX from 'vuex'
import flowTabs from './modules/flowTabs'

Vue.use(VueX)

export default new VueX.Store({
  modules: {
    flowTabs,
  }
})
