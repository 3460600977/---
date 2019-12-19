import {removeUserInfo, getToken} from '@/utils/auth';

const user = {
  state: {
    token: getToken(),
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
  },

  getters: {},

  actions: {

  }
}

export default user
