
export const crowdProject = {
  state: {
    tagNames: [],
    tagTid: [],
  },

  mutations: {
    setTagNames(state, data) {
      state.tagNames.push(...data);
    },
    setTagTid(state, tid) {
      state.tagTid.push(...tid);
    },
    removeTagNamesByIndexes(state, data){
      state.tagNames[data.parentIndex].value.splice(data.index, 1);
      if(state.tagNames[data.parentIndex].value.length === 0) {
        state.tagNames.splice(data.parentIndex, 1)
      }
    }
  },
}
