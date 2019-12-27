import request from "@/utils/request";

export const toolBox = {
  getResourceBundle: (data) => {
    return request({
      url: "/dpapi/cityInsight/list",
      method: "POST",
      data
    });
  },
  deleteResourceBundle: (params) => {
    return request({
      url: `/dpapi/cityInsight/${params.id}`,
      method: "DELETE"
    });
  },
}
