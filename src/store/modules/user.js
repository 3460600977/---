import {getToken, removeUserInfo} from '@/utils/auth';

export const userToken = {
  state: {
    userToken: getToken(),
  },

  mutations: {
    setToken: (state, token) => {
      state.userToken = token
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
