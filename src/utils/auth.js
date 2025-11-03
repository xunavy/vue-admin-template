import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const RefreshTokenKey = 'vue_admin_template_refresh_token'

// 访问令牌管理
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  // 设置访问令牌，有效期15分钟
  return Cookies.set(TokenKey, token, { expires: 15 / (24 * 60) })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 刷新令牌管理
export function getRefreshToken() {
  return Cookies.get(RefreshTokenKey)
}

export function setRefreshToken(refreshToken) {
  // 设置刷新令牌，有效期7天
  return Cookies.set(RefreshTokenKey, refreshToken, { expires: 7 })
}

export function removeRefreshToken() {
  return Cookies.remove(RefreshTokenKey)
}

// 清除所有令牌
export function clearTokens() {
  removeToken()
  removeRefreshToken()
}
