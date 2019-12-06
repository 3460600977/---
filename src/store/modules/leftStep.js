/*
 * @Description: 投放管理创建步骤显示
 * @Author: 何彬
 */
export const leftStep = {
  state: {
    rootActiveIndex: 0,
    subActiveIndex: 0
  },

  mutations: {
    setLeftStep(state, data) {
      state.rootActiveIndex = data.rootActiveIndex;
      state.subActiveIndex = data.subActiveIndex;
    },
  }
}
