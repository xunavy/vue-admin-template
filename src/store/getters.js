const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  role: state => state.user.role,
  permissions: state => state.user.permissions,
  hasPermission: state => permission => {
    return state.user.permissions.includes(permission)
  },
  hasRole: state => role => {
    return state.user.role === role
  }
}
export default getters
