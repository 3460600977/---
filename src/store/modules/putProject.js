/*
 * @Description: 投放方案
 * @Author: 何彬
 */
export const putProject = {
  state: {
    list: [], // 列表
  },

  mutations: {
    setBuildsList(state, data) {
      state.list = data;
    }
  },

  getters: {
    buildsNumber: state => {
      return state.list.length;
    },

    deviceNumber: state => {
      let res = 0;
      if (state.list.length > 0) {
        state.list.forEach(item => {
          res += +item.deviceNum;
        });
      }
      return res;
    },

    peopleNumber: state => {
      let res = 0;
      if (state.list.length > 0) {
        state.list.forEach(item => {
          res += +item.weekForPeople;
        });
      }
      return res;
    },
    
    unitNum: state => {
      let res = 0;
      if (state.list.length > 0) {
        state.list.forEach(item => {
          res += +item.unitNum;
        });
      }
      return res;
    },

    // 接口需要的楼盘数据
    buildsDetails: state => {
      let result = [];
      state.list.forEach(item => {
        result.push({ 
          deviceNum: item.deviceNum,
          premiseId: item.premiseId
        })
      })
      return result;
    }
  }
}
