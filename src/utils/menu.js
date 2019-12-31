import Cookies from 'js-cookie'

const MenuKey = 'user-menu'
// 菜单
export function getCookieMenu() {
  return Cookies.getJSON(MenuKey)
}

export function setCookieMenu(menuObj) {
  return Cookies.set(MenuKey, menuObj)
}

export function removeCookieMenu() {
  return Cookies.remove(MenuKey)
}
