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
const BuildsTemplate = () => {
  window.location.href = process.env.BASE_API + "/dpapi/project/premises/template";
}

export const PutProject = {
  BuildsAvailableByCityInsignt,
  BuildsAvailableByImport,
  BuildsTemplate,
  AddProject
}