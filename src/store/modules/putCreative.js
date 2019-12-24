/*
 * @Description: 创建创意
 * @Author: 何彬
 */
export const putCreative = {
  state: {
    projectData: {}, // 方案数据
  },

  mutations: {
    setProjectData(state, data) {
      state.projectData = data;
    }
  },
}
