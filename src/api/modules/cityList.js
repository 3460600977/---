import request from "@/utils/request";

/**
 * 城市列表
 */

// 所有城市列表
const AllList = () => {
  return request({
    url: "/dpapi/map",
    method: "GET"
  });
}
  
// 一二三线城市
const TypeList = () => {
  return request({
    url: "/dpapi/typeList",
    method: "GET"
  });
}

export const CityList = {
  AllList,
  TypeList
}