const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  errorLogs: state => state.errorLog.logs,
  access_token: state => state.user.access_token,
  loginError: state => state.user.loginError
}
export default getters
