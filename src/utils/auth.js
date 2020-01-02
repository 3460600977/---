import Cookies from 'js-cookie'

// 用户信息操作
export function setUserInfo(info) {
  return Cookies.set('userinfo', JSON.stringify(info));
}

export function getUserInfo() {
  let userInfoStr = Cookies.get('userinfo')
  if (userInfoStr) {
    return JSON.parse(Cookies.get('userinfo'))
  }
  return ''
}

export function removeUserInfo() {
  return Cookies.remove('userinfo')
}

//token操作
export function getToken() {
  let userInfoStr = Cookies.get('userinfo')
  if (userInfoStr) {
    let userInfo = JSON.parse(userInfoStr)
    if (userInfo.hasOwnProperty('token')) {
      if (userInfo.token) {
        return userInfo.token
      }
    }
  }
  return '';
}



