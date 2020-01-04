import request from "@/utils/request";

export const peopleInsight = {
  // 创建人群包 获取菜单列表
  getMenuList:(data) => {
    return request({
      url: "/dpapi/crowd/topTags",
      method: "get",
      data,
    });
  },
  getCrowdList:(data) => {
    return request({
      url: "/dpapi/crowd/query",
      method: "post",
      data,
    });
  },
  deleteCrowdById:(data)=> {
    return request({
      url: "/dpapi/crowd/del",
      method: "post",
      data,
    });
  },
  getChildTags:(data)=> {
    return request({
      url: "/dpapi/crowd/childTags?tid="+data,
      method: "get",
    });
  },
  createPeopleCrowd:(data)=> {
    return request({
      url : "/dpapi/crowd/create",
      method: "post",
      data
    });
  },

  // 加载人群洞察包list数据
  getPeopleInsightHotMap:(data) => {
    return request({
      url: `/dpapi/cityInsight/hot`,
      method: "POST",
      data
    });
  },
}
