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
  }
}
