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
  // 媒体资源 加载人群洞察包
  getPeopleInsightList:(data) => {
    return request({
      url: "/dpapi/cityInsight/query",
      method: "post",
      data,
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

  // 加载人群洞察包明细数据
  getPeopleInsightDetail:(data) => {
    return request({
      url: `/dpapi/crowd/detail/${data}`,
      method: "GET"
    });
  },
}
