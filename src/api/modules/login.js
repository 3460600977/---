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
    return request({
      url: "/dpapi/verification/base64Image",
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
}
