import request from "@/utils/request";

/**
 * 审核创意相关接口
 */
// 创意审核列表
const getAuditCreativeList = (data) => {
  return request({
    url: "/dpapi/creative/review/query",
    method: "POST",
    data,
  });
}
// 审核创意素材下载
const downloadAuditCreative = (params) => {
  return request({
    url: "/dpapi/creative/review/download",
    method: "GET",
    params
  });
}
// 审核创意资质查看
const getAuditCreativeReviewDetail = (params) => {
  return request({
    url: "/dpapi/creative/review/detail",
    method: "GET",
    params
  });
}
// 创意审核提交
const submitAuditCreative = (data) => {
  return request({
    url: "/dpapi/creative/review/submit",
    method: "PUT",
    data,
  });
}
export const AuditCreative = {
  getAuditCreativeList,
  downloadAuditCreative,
  getAuditCreativeReviewDetail,
  submitAuditCreative
}
