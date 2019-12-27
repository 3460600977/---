import request from "@/utils/request";

export const cityInsight = {
  getPremisesByCity: (data) => {
    return request({
      url: "/dpapi/premises/city",
      method: "POST",
      data
    });
  },
  getBuildingDetail: (params) => {
    return request({
      url: "/dpapi/premises/detail",
      method: "GET",
      params
    });
  },
  CityInsightList: data => {
    return request({
      url: "/dpapi/cityInsight/list",
      method: "POST",
      data
    });
  },
  GetCityInsightDetailById: data => {
    return request({
      url: "/dpapi/cityInsight/" + data,
      method: "get",
    });
  }
}
