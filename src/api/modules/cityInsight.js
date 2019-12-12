import request from "@/utils/request";

const getPremisesByCity = (data) => {
  return request({
    url: "/dpapi/premises/city",
    method: "POST",
    data
  });
}

// 获取城市洞察包列表
const CityInsightList = data => {
  return request({
    url: "/dpapi/cityInsight/list",
    method: "POST",
    data
  });
}

// 根据id获取洞察包数据明细
const GetCityInsightDetailById = data => {
  return request({
    url: "/dpapi/cityInsight/" + data,
    method: "get",
  });
}

export const cityInsight = {
  getPremisesByCity,
  CityInsightList,
  GetCityInsightDetailById
}
