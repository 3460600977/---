import { getToken, removeUserInfo } from '@/utils/auth';

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
  actions: {}
}
