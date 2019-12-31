import request from "@/utils/request";

/**
 * 行业列表
 */

export const IndustryList = {
  
  // 所有列表
  AllList: () => {
    return request({
      url: "/dpapi/list",
      method: "GET"
    });
  }
}