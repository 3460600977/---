import {getToken, removeUserInfo} from '@/utils/auth';

export const token = {
  state: {
    userToken: getToken(),
  },

  mutations: {
    setToken: (state, token) => {
      state.userToken = token
    },
  },
  getters: {
    userToken: state => {
      return getToken();
    },
  },
  actions: {
    // 前端 登出
    FedLogOut({commit}) {
      return new Promise(resolve => {
        removeUserInfo()
        commit('setToken', '');
        resolve();
      })
    },
  }
}
