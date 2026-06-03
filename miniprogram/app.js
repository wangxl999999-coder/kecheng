App({
  globalData: {
    baseUrl: 'http://localhost:3000/api',
    token: '',
    userInfo: null,
  },
  onLaunch() {
    const token = wx.getStorageSync('token')
    if (token) {
      this.globalData.token = token
    }
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.globalData.userInfo = userInfo
    }
  },
  checkLogin() {
    return !!this.globalData.token
  },
  requireLogin() {
    if (!this.checkLogin()) {
      wx.navigateTo({ url: '/pages/user/login' })
      return false
    }
    return true
  },
})
