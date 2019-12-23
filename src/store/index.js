import Vue from 'vue'
import VueX from 'vuex'
import {userToken} from './modules/user'
import {leftStep} from './modules/leftStep'
import {putProject} from './modules/putProject'
import {putCreative} from './modules/putCreative'

Vue.use(VueX)

export default new VueX.Store({
  modules: {
    userToken,
    leftStep,
    putProject,
    putCreative
  }
})
