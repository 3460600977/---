// 投放计划相关接口
import request from "@/utils/request";

const getCityList = () => {
  return request({
    url: "/dpapi/map",
    method: "GET",
  });
}

export const putPlan = {
  getCityList
}