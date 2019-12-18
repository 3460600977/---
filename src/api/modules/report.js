import request from "@/utils/request";

/**
 * 报表相关接口
 */
// 方案统计查询--得到卡片数据
const getProjectTotal = (data) => {
  return request({
    url: "/dpapi/report/project/totalQuery",
    method: "POST",
    data,
  });
}

// 方案柱状图查询
const getProjectChartBar = (data) => {
  return request({
    url: "/dpapi/report/project/chartQuery",
    method: "POST",
    data,
  });
}

// 方案报表列表下载
const getProjectDownloadList = (data) => {
  return request({
    url: "/dpapi/report/project/download",
    method: "POST",
    data,
    responseType: 'blob', //一定要写
  });
}
// 方案报表列表查询
const getProjectList = (data) => {
  return request({
    url: "/dpapi/report/project/listQuery",
    method: "POST",
    data,
  });
}

export const Report = {
  getProjectTotal,
  getProjectChartBar,
  getProjectDownloadList,
  getProjectList
}
