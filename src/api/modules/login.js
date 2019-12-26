import request from "@/utils/request";

/**
 * 用户登录相关接口
 */

// 登录接口
const LoginIn = (data) => {
  return request({
    url: "/dpapi/new/signIn",
    method: "POST",
    data,
  });
}

// 登出接口
const LoginOut = () => {
  return request({
    url: "/dpapi/signOut",
    method: "GET",
  });
}

// 修改密码接口
const ChangePass = (data) => {
  return request({
    url: "/dpapi/change/password",
    method: "POST",
    data,
  });
}


/**
 * 用户登录验证码相关接口
 */
// 获取图片Base64验证码
const GetVerifyCode = () => {
  return request({
    url: "/dpapi/verification/base64Image",
    method: "GET",
  });
}

// 获取验证码图片
const GetVerifyImg = () => {
  return request({
    url: "/dpapi/verification/image",
    method: "GET",
  });
}

export const Login = {
  LoginIn,
  LoginOut,
  ChangePass,
  GetVerifyCode,
  GetVerifyImg
}
