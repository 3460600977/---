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
  // window.location.href = process.env.BASE_API + "/dpapi/project/premises/template";
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

export const PutProject = {
  BuildsAvailableByCityInsignt,
  BuildsAvailableByImport,
  DowloadBuildsTemplate,
  AddProject,
  ExportBuildsByMsg
}