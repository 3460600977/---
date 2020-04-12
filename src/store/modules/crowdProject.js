export const crowdProject = {
  state: {
    tagNames: [],
    tagTid: [],
    tagNamesObj: {},
    cityTid:99999,
    industryTid:88888,
  },

  mutations: {

    setTagNames(state, data) {
      state.tagNames.push(...data);
    },

    setTagTid(state, tid) {
      state.tagTid.push(tid);
    },

    setTagNamesWithUpdate(state, data){
      state.tagNames.forEach((tagData,index)=>{
        if (tagData.tags[0].name[2] === data[0].tags[0].name[2]) {
         state.tagNames.splice(index,1)
        }
      });
      state.tagNames.push(...data);
      //重新排序tags
      state.tagNames.sort(function (a,b) {
        let order = [
          "城市","性别","教育水平","年龄","消费水平","车产状况","影视音乐",
          "游戏","休闲爱好","书籍阅读","资讯","体育健身","花鸟萌宠","行业消费"
        ];
        return order.indexOf(a.name) - order.indexOf(b.name)
      });
      state.tagNames = state.tagNames.map(function (a) {
        return a
      });
    },

    //涉及到人口属性的左到右的删除
    removeTagNamesByName(state, data){
      state.tagNames.forEach((tagData,index)=>{
        if (tagData.name === data.name) {
          state.tagNames.splice(index,1)
        }
      });
    },

    removeTagNamesByIndexes(state, data){
      let parentTid = state.tagNames[data.parentIndex].tid;
      let tid = state.tagNames[data.parentIndex].tags[data.index].tid;
      state.tagNames[data.parentIndex].tags.splice(data.index, 1);
      //行业消费不需要双向绑定，其他的需要进行双向绑定
      if(state.tagNames[data.parentIndex].name !== "行业消费"){
        if (parentTid !== 0  && tid !== 0) {
          let delIndex = state.tagNamesObj[parentTid].indexOf(tid);
          state.tagNamesObj[parentTid].splice(delIndex,1);
        }
      }

      if(state.tagNames[data.parentIndex].tags.length === 0) {
        state.tagNamesObj[parentTid] = [];
        state.tagNames.splice(data.parentIndex, 1);
      }

    },
    removeAllState(state, data){
      state.tagNames = [];
      state.tagTid = [];
      state.city = "";
    },


  },
}
