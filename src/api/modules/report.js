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
// 计划报告报表统计查询
const getPlanTotal = (data) => {
  return request({
    url: "/dpapi/report/campaign/totalQuery",
    method: "POST",
    data,
  });
}
// 计划报告报表图表查询
const getPlanChartBar = (data) => {
  return request({
    url: "/dpapi/report/campaign/chartQuery",
    method: "POST",
    data,
  });
}
// 计划报表列表下载,不传分页则下载全部
const getPlanDownloadList = (data) => {
  return request({
    url: "/dpapi/report/campaign/download",
    method: "POST",
    data,
    responseType: 'blob', //一定要写
  });
}
// 计划报表列表查询
const getPlanList = (data) => {
  return request({
    url: "/dpapi/report/campaign/listQuery",
    method: "POST",
    data,
  });
}
//查询方案楼盘列表
const getProjectPremiseList = (data) => {
  return request({
    url: "/dpapi/report/project/premise/query",
    method: "POST",
    data,
  });
}
//查询方案楼盘设备信息
const getProjectDeviceList = (data) => {
  return request({
    url: "/dpapi/report/project/device/query",
    method: "POST",
    data,
  });
}
//查询方案楼盘设备播放列表
const getProjectPlayList = (data) => {
  return request({
    url: "/dpapi/report/project/device/playList",
    method: "POST",
    data,
  });
}

export const Report = {
  getProjectTotal,
  getProjectChartBar,
  getProjectDownloadList,
  getProjectList,
  getPlanTotal,
  getPlanChartBar,
  getPlanDownloadList,
  getPlanList,
  getProjectPremiseList,
  getProjectDeviceList,
  getProjectPlayList
}
