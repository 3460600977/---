import Vue from 'vue'
import VueX from 'vuex'
import {token} from './modules/user'
import {leftStep} from './modules/leftStep'
import {putProject} from './modules/putProject'
import {putCreative} from './modules/putCreative'
import {crowdProject} from './modules/crowdProject'

Vue.use(VueX);

export default new VueX.Store({
  modules: {
    token,
    leftStep,
    putProject,
    putCreative,
    crowdProject,
  }
})
