
export const crowdProject = {
  state: {
    tagNames: [],
    tagTid: [],
    tagNamesObj: {},
    city: "",
  },

  mutations: {
    setCity(state, data) {
      state.city = data;
    },
    removeCity(state, data){
      state.city = "";
    },
    setTagNames(state, data) {
      state.tagNames.push(...data);
    },

    setTagTid(state, tid) {
      state.tagTid.push(tid);
    },

    setTagNamesWithUpdate(state, data){
      state.tagNames.forEach((tagData,index)=>{
        if (tagData.name == data[0].name) {
         state.tagNames.splice(index,1)
        }
      });
      state.tagNames.push(...data)
    },

    //涉及到人口属性的左到右的删除
    removeTagNamesByName(state, data){
      state.tagNames.forEach((tagData,index)=>{
        if (tagData.name == data.name) {
          state.tagNames.splice(index,1)
        }
      });
    },

    removeTagNamesByIndexes(state, data){
      state.tagNames[data.parentIndex].value.splice(data.index, 1);
      //行业消费不需要双向绑定，其他的需要进行双向绑定
      if(state.tagNames[data.parentIndex].name !== "行业消费"){
        /*console.log(state.tagNames[data.parentIndex]);
        console.log(state.tagNamesObj)*/
        //移除左边指定的项
      }
      if(state.tagNames[data.parentIndex].value.length === 0) {
        state.tagNames.splice(data.parentIndex, 1)
      }
    },

  },
}
