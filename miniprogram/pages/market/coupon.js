const api = require('../../utils/request')
const app = getApp()

Page({
  data: {
    coupons: [],
    loading: true,
    isLoggedIn: false,
  },

  onShow() {
    const isLoggedIn = app.checkLogin()
    this.setData({ isLoggedIn })
    if (isLoggedIn) {
      this.loadCoupons()
    } else {
      this.setData({ coupons: [], loading: false })
    }
  },

  async loadCoupons() {
    try {
      const coupons = await api.get('/user/coupons')
      this.setData({ coupons, loading: false })
    } catch (e) {
      this.setData({ loading: false })
    }
  },

  async onReceive(e) {
    if (!app.requireLogin()) return
    const id = e.currentTarget.dataset.id
    try {
      await api.post('/user/coupons/receive', { couponId: id })
      wx.showToast({ title: '领取成功', icon: 'success' })
      this.loadCoupons()
    } catch (e) {}
  },

  onUseTap(e) {
    const id = e.currentTarget.dataset.id
    wx.switchTab({ url: '/pages/home/home' })
  },

  onLoginTap() {
    wx.navigateTo({ url: '/pages/user/login' })
  },
})
