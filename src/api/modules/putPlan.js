import request from "@/utils/request";

/**
 * 投放计划相关接口
 */
export const PutPlan = {
  // 新增计划
  AddPlan: (data) => {
    return request({
      url: "/dpapi/campaign/add",
      method: "POST",
      data,
    });
  },
  
  // 计划编辑
  EditPlan: (data) => {
    return request({
      url: "/dpapi/campaign/edit",
      method: "POST",
      data,
    });
  },
  
  // 计划列表
  PlanList: (data) => {
    return request({
      url: "/dpapi/campaign/list",
      method: "post",
      data,
    });
  },
  
  // 计划详情
  PlanDetail: (data) => {
    return request({
      url: "/dpapi/campaign/detail?id=" + data,
      method: "get",
    });
  },
  
  // 计划名字列表
  PlanNameList: (data) => {
    return request({
      url: "/dpapi/campaign/name",
      method: "get",
      data,
    });
  }
}