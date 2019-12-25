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
// 获取创意明细
const getAuditCreativeDetail = (params) => {
  return request({
    url: "/dpapi/creative",
    method: "GET",
    params
  });
}
// 审核创意素材下载
const downloadAuditCreative = () => {
  return request({
    url: "/dpapi/creative/review/download",
    method: "GET",
    responseType: 'blob', //一定要写
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
    method: "POST",
    data,
  });
}
export const AuditCreative = {
  getAuditCreativeList,
  getAuditCreativeDetail,
  downloadAuditCreative,
  getAuditCreativeReviewDetail,
  submitAuditCreative
}
