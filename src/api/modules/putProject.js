import request from "@/utils/request";

/**
 * 投放方案相关接口
 */

// POST创建投放方案
const AddProject = (data) => {
  return request({
    url: "/dpapi/project/add",
    method: "post",
    data
  });
}

// 取消方案接口
const CancelProject = (data) => {
  return request({
    url: "/dpapi/project/projectCancel",
    method: "post",
    data
  });
}

// 根据楼盘查询余量
const BuildsAvailableByCityInsignt = (data) => {
  return request({
    url: "/dpapi/project/queryByProject",
    method: "post",
    data
  });
}

// 上传楼盘数据查询余量
const BuildsAvailableByImport = (data) => {
  return request({
    url: "/dpapi/project/premises/upload",
    method: "post",
    data
  });
}

// 投放方案楼盘数据导入模板下载接口
const DowloadBuildsTemplate = () => {
  return request({
    url: "/dpapi/project/premises/template",
    method: "get",
    responseType: 'blob', //一定要写
  });
}

// 前端传楼盘信息进行导出
const ExportBuildsByMsg = (data) => {
  return request({
    url: "/dpapi/project/csv",
    method: "post",
    responseType: 'blob', //一定要写
    data
  });
}
// 获取方案名称
const ProjectNameList = (data) => {
  return request({
    url: "/dpapi/project/name",
    method: "GET",
    data
  });
}

// 依据计划Id获取方案名称
const ProjectNameListByCamId = (data) => {
  return request({
    url: "/dpapi/project/nameByCampaignId?campaignId=" + data,
    method: "GET",
  });
}


export const PutProject = {
  BuildsAvailableByCityInsignt,
  BuildsAvailableByImport,
  DowloadBuildsTemplate,
  AddProject,
  ExportBuildsByMsg,
  CancelProject,
  ProjectNameList,
  ProjectNameListByCamId
}
