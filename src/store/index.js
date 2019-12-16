import Vue from 'vue'
import VueX from 'vuex'
import { leftStep } from './modules/leftStep'
import { putProject } from './modules/putProject'

Vue.use(VueX)

export default new VueX.Store({
  modules: {
    leftStep,
    putProject
  }
})
