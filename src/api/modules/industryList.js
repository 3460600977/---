import request from "@/utils/request";

/**
 * 行业列表
 */

// 所有列表
const AllList = () => {
  return request({
    url: "/dpapi/list",
    method: "GET"
  });
}

export const IndustryList = {
  AllList
}