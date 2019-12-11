import request from "@/utils/request";

/**
 * 投放计划相关接口
 */

// 新增计划
const AddPlan = (data) => {
  return request({
    url: "/dpapi/campaign/add",
    method: "POST",
    data,
  });
}

// 计划编辑
const EditPlan = (data) => {
  return request({
    url: "/dpapi/campaign/edit",
    method: "POST",
    data,
  });
}

// 计划列表
const PlanList = (data) => {
  return request({
    url: "/dpapi/campaign/list",
    method: "post",
    data,
  });
}

// 计划详情
const PlanDetail = (data) => {
  return request({
    url: "/dpapi/campaign/detail?id=" + data,
    method: "get",
  });
}

// 计划名字列表
const PlanNameList = (data) => {
  return request({
    url: "/dpapi/campaign/name",
    method: "get",
    data,
  });
}





export const PutPlan = {
  AddPlan,
  PlanList,
  PlanDetail,
  EditPlan,
  PlanNameList
}