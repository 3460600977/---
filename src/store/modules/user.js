import { getToken, setUserInfo, getUserInfo } from '@/utils/auth';
import api from '@/api/index'
export const token = {
  state: {
    userToken: getToken(),
    refreshUserInfo: {},
  },

  mutations: {
    setToken: (state, token) => {
      state.userToken = token
    },
    setUserInfo: (state, userInfo) => {
      state.refreshUserInfo = userInfo
    },
  },
  getters: {
    refreshUserInfo: async state => {
      return new Promise((resolve, reject) => {
        api.Login.RefreshUser().then(res => {
          let refreshUserInfo = res.result
          let userInfo = getUserInfo()
          Object.assign(userInfo, refreshUserInfo)
          setUserInfo(userInfo)
          resolve(userInfo)
        }).catch(res => {
          reject(res)
        });
      })

    }
  },
  actions: {}
}
