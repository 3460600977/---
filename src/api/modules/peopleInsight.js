import request from "@/utils/request";

export const peopleInsight = {
  // 创建人群包 获取菜单列表
  getMenuList:(data) => {
    return request({
      url: "/dpapi/crowd/topTags",
      method: "GET"
    });
  },
}
