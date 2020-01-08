/*
 * @Description: 投放方案
 * @Author: 何彬
 */
export const putProject = {
  state: {
    list: [], // 楼盘列表
    statistics: '', // 楼盘数据未寻量统计
  },

  mutations: {
    setBuildsList(state, data) {
      state.list = data;
    },

    setStatistics(state, data) {
      state.statistics = data;
    },
  },

  getters: {
    buildsNumber: state => {
      return state.list.length;
    },

    deviceNumber: state => {
      let res = 0;
      if (state.list.length > 0) {
        state.list.forEach(item => {
          res += ('deviceNum' in item) ? +item.deviceNum : +item.signElevatorNum;
        });
      }
      return res;
    },

    peopleNumber: state => {
      let res = 0;
      if (state.list.length > 0) {
        state.list.forEach(item => {
          res += ('weekForPeople' in item) ? +item.weekForPeople : +item.totalPeople;
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
          deviceNum: 'deviceNum' in item ? +item.deviceNum : +item.signElevatorNum,
          premiseId: 'premiseId' in item ? +item.premiseId : +item.premisesId
        })
      })
      return result;
    },

    // 设备id数组
    premiseIds: state => {
      let result = [];
      state.list.forEach(item => {
        result.push(item.premisesId)
      })
      result = result.join(',')
      return result;
    },

  }
}
