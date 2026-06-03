const api = require('../../utils/request')
const app = getApp()
Page({
  data: {
    poster: null,
    courseId: 1,
    shareTitle: '',
    shareDesc: '',
    posterUrl: '',
    stats: { totalIncome: 0, totalOrders: 0, totalFans: 0 },
    isLoggedIn: false,
  },
  onShow() {
    const isLoggedIn = app.checkLogin()
    this.setData({ isLoggedIn })
    if (isLoggedIn) this.loadStats()
  },
  async loadStats() {
    try {
      const res = await api.post('/user/distribution/poster', { courseId: this.data.courseId })
      this.setData({ posterUrl: res.posterUrl, shareTitle: res.shareTitle, shareDesc: res.shareDesc, stats: { totalIncome: 299, totalOrders: 15, totalFans: 32 } })
    } catch (e) {}
  },
  async onGeneratePoster() {
    if (!app.requireLogin()) return
    try {
      const res = await api.post('/user/distribution/poster', { courseId: this.data.courseId })
      this.setData({ posterUrl: res.posterUrl, shareTitle: res.shareTitle, shareDesc: res.shareDesc })
      wx.showToast({ title: '海报已生成', icon: 'success' })
    } catch (e) {}
  },
  onShareAppMessage() {
    return { title: this.data.shareTitle, path: '/pages/home/home' }
  },
  onLoginTap() { wx.navigateTo({ url: '/pages/user/login' }) },
})
