import Vue from 'vue'
import VueX from 'vuex'
import { leftStep } from './modules/leftStep'

Vue.use(VueX)

export default new VueX.Store({
  modules: {
    leftStep,
  }
})
