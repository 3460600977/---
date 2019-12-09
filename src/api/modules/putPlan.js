// 投放计划相关接口
import request from "@/utils/request";

export function getCityList() {
  return request({
    url: "/dpapi/map",
    method: "GET",
  });
}