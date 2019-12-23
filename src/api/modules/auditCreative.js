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
const getAuditCreativeDetail = (data) => {
  return request({
    url: "/dpapi/creative?id=" + data,
    method: "GET",
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
  submitAuditCreative
}
