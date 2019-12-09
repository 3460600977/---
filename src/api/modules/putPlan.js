import request from "@/utils/request";

// 投放计划相关接口
const getCityList = () => {
  return request({
    url: "/dpapi/map",
    method: "GET",
  });
}

export const putPlan = {
  getCityList
}