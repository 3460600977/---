// 用户信息操作
export function setUserInfo(info) {
  return localStorage.setItem('userinfo', JSON.stringify(info));
}

export function getUserInfo() {
  let userInfoStr = localStorage.getItem('userinfo')
  if (userInfoStr) {
    return JSON.parse(localStorage.getItem('userinfo'))
  }
  return ''
}

export function removeUserInfo() {
  return localStorage.removeItem('userinfo')
}

//token操作
export function getToken() {
  let userInfoStr = localStorage.getItem('userinfo')
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

export function getMenuList() {
  let menuList = localStorage.getItem('menuList')
  if (menuList) {
    return JSON.parse(localStorage.getItem('menuList'))
  }
  return ''
}

export function setMenuList(menuList) {
  return localStorage.setItem('menuList', JSON.stringify(menuList));
}

export function removeMenuList() {
  return localStorage.removeItem('menuList')
}



