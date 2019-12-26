import request from "@/utils/request";

/**
 * 投放方案相关接口
 */

export const PutProject = {
  // POST创建投放方案
  AddProject: (data) => {
    return request({
      url: "/dpapi/project/add",
      method: "post",
      data
    });
  },
  
  // 取消方案接口
  CancelProject: (data) => {
    return request({
      url: "/dpapi/project/projectCancel",
      method: "post",
      data
    });
  },
  
  // 根据楼盘查询余量
  BuildsAvailableByCityInsignt: (data) => {
    return request({
      url: "/dpapi/project/queryByProject",
      method: "post",
      data
    });
  },
  
  // 上传楼盘数据查询余量
  BuildsAvailableByImport: (data) => {
    return request({
      url: "/dpapi/project/premises/upload",
      method: "post",
      data
    });
  },
  
  // 投放方案楼盘数据导入模板下载接口
  DowloadBuildsTemplate: () => {
    return request({
      url: "/dpapi/project/premises/template",
      method: "get",
      responseType: 'blob', //一定要写
    });
  },
  
  // 前端传楼盘信息进行导出
  ExportBuildsByMsg: (data) => {
    return request({
      url: "/dpapi/project/csv",
      method: "post",
      responseType: 'blob', //一定要写
      data
    });
  },
  
  // 获取方案名称列表
  ProjectNameList: (data) => {
    return request({
      url: "/dpapi/project/name",
      method: "GET",
      data
    });
  },
  
  // 获取方案列表
  ProjectList: (data) => {
    return request({
      url: "/dpapi/project/query",
      method: "post",
      data
    });
  },

  // 根据id获取方案详情
  GetProjectDetailById: (data) => {
    return request({
      url: "/dpapi/project/detail/" + data,
      method: "GET",
    });
  },
  
  // 依据计划Id获取方案名称
  ProjectNameListByCamId: (data) => {
    return request({
      url: "/dpapi/project/nameByCampaignId?campaignId=" + data,
      method: "GET",
    });
  },

  // POST投放方案楼盘明细
  ProjectBuildList: (data) => {
    return request({
      url: "/dpapi/project/premise/list",
      method: "post",
      data
    });
  },

  // POST编辑投放方案
  EditProject: (data) => {
    return request({
      url: "/dpapi/project/edit",
      method: "post",
      data
    });
  },


}
