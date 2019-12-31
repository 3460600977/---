/*
 * @Description: 报表相关数据
 * @Author: 陈旭
 * @Date: 2019-12-07 16:56
 */
const state = {
  tabsFilterArr: {
    planId: 0,
    projectId: 0
  },
};

const getters = {
  /**
   * 获取报表的
   */
  getTabsFilter(state) {
    return state.tabsFilterArr;
  }
}

const mutations = {
  /**
   * 设置投放过滤信息
   */
  setTabsFilter(state, data) {
    state.tabsFilterArr = data;
  },
};

export default {
  state,
  getters,
  mutations
}
