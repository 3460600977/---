import request from "@/utils/request";

export const peopleInsight = {
  // 创建人群包 获取菜单列表
  getMenuList:(data) => {
    return request({
      url: "/dpapi/crowd/topTags",
      method: "GET"
    });
  },
  // 加载人群洞察包list数据
  getPeopleInsightList:(data) => {
    return request({
      url: "/dpapi/crowd/query",
      method: "POST",
      data
    });
  },
  // 加载人群洞察包list数据
  getPeopleInsightHotMap:(data) => {
    return request({
      url: `/dpapi/cityInsight/hot/${data.id}`,
      method: "GET"
    });
  },
}
