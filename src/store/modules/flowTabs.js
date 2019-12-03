/*
 * @Description: 流程标签页
 * @Author: 陈旭
 * @Date: 2019-12-01 17:18:03
 */
const state = {
  tabsFilterArr: {
    planId: 0,
    projectId: 0
  },
};

const getters = {
  /**
   * 获取投放过滤信息
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
