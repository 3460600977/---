import request from "@/utils/request";

/**
 * 创意相关接口
 */
export const CreateCreative = {
  // 获取方案明细
  GetProjectDetailById: (data) => {
    return request({
      url: "/dpapi/project/detail/" + data,
      method: "GET",
    });
  },

  // 创新新增
  AddCreative: (data) => {
    return request({
      url: "/dpapi/creative/add",
      method: "post",
      data
    });
  },

  // 已有广告创意
  ExistCreative: (data) => {
    return request({
      url: "/dpapi/creative/projectList",
      method: "post",
      data
    });
  },

  // 已有广告创意
  CreativeList: (data) => {
    return request({
      url: "/dpapi/creative/list",
      method: "post",
      data
    });
  },

  // 方案绑定创意 (选择以有创意)
  BindCreativeProject: (data) => {
    return request({
      url: "/dpapi/creative/bind",
      method: "post",
      data
    });
  },

  // POST创意下拉列表
  CreativeNameList: (data) => {
    return request({
      url: "/dpapi/creative/allList",
      method: "post",
      data
    });
  },

  // GET获取创意明细
  CreativeDetail: (data) => {
    return request({
      url: "/dpapi/creative/" + data,
      method: "GET",
    });
  },

  

  // DELETE删除创意数据
  DeleteCreativeById: (data) => {
    return request({
      url: "/dpapi/creative/" + data,
      method: "DELETE",
    });
  }
}