import Cookies from 'js-cookie'

// 用户信息操作
export function setUserInfo(info) {
  return Cookies.set('userinfo', JSON.stringify(info));
}

export function getUserInfo() {
  return JSON.parse(Cookies.get('userinfo'))
}

export function removeUserInfo() {
  return Cookies.remove('userinfo')
}

//token操作
export function getToken() {
  let userInfo = JSON.parse(Cookies.get('userinfo'))
  if (userInfo.hasOwnProperty('token')) {
    if (userInfo.token) {
      return userInfo.token
    }
  }
  return '';
}



