import request from "@/utils/request";

/**
 * 创建创意相关接口
 */

// 获取方案明细
const GetProjectDetailById = (data) => {
  return request({
    url: "/dpapi/project/detail/" + data,
    method: "GET",
  });
}

// 创新新增
const AddCreative = (data) => {
  return request({
    url: "/dpapi/creative/add",
    method: "post",
    data
  });
}

// 已有广告创意
const ExistCreative = (data) => {
  return request({
    url: "/dpapi/creative/projectList",
    method: "post",
    data
  });
}

// 方案绑定创意 (选择以有创意)
const BindCreativeProject = (data) => {
  return request({
    url: "/dpapi/creative/bind",
    method: "post",
    data
  });
}

export const CreateCreative = {
  AddCreative,
  ExistCreative,
  BindCreativeProject,
  GetProjectDetailById
}