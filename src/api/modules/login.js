import request from "@/utils/request";

/**
 * 用户登录相关接口
 */


export const Login = {
  // 登录接口
  LoginIn: (data) => {
    return request({
      url: "/dpapi/signIn",
      method: "POST",
      data,
    });
  },

  // 登出接口
  LoginOut: () => {
    return request({
      url: "/dpapi/signOut",
      method: "GET",
    });
  },

  // 修改密码接口
  ChangePass: (data) => {
    return request({
      url: "/dpapi/password/set",
      method: "POST",
      data,
    });
  },


  /**
   * 用户登录验证码相关接口
   */
  // 获取图片Base64验证码
  GetVerifyCode: () => {
    let codeUrl = "/dpapi/verification/base64Image";
    if (codeUrl.indexOf('?') > -1) {
      codeUrl = codeUrl + "&timestamp=" + new Date().getTime();
    } else {
      codeUrl = codeUrl + "?timestamp=" + new Date().getTime();
    }
    return request({
      url: codeUrl,
      method: "GET",
    });
  },

  // 获取验证码图片
  GetVerifyImg: () => {
    return request({
      url: "/dpapi/verification/image",
      method: "GET",
    });
  },

  // 销售人员登录
  SaleLogin: (data) => {
    return request({
      url: "/dpapi/signExt",
      method: "post",
      data
    });
  },

  // 销审核人员登录
  AuditorLogin: (data) => {
    return request({
      url: "/dpapi/signAuditorExt",
      method: "post",
      data
    });
  },

  // 舒心广告主信息
  RefreshUser: (data) => {
    return request({
      url: "/dpapi/refreshUser",
      method: "get",
    });
  },
  // 概况详情=》统计计划，方案，未支付方案，审核拒绝创意数
  GetSummaryDetail: (data) => {
    return request({
      url: "/dpapi/summary/detail",
      method: "get",
    });
  },
  // 用户统计数据=》数据趋势
  GetSummaryData: (data) => {
    return request({
      url: "/dpapi/summary/data",
      method: "post",
      data
    });
  },
}
