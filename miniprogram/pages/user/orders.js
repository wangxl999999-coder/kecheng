const api = require('../../utils/request')
const app = getApp()
Page({
  data: { orders: [], loading: true, isLoggedIn: false },
  onShow() {
    const isLoggedIn = app.checkLogin()
    this.setData({ isLoggedIn })
    if (isLoggedIn) this.loadOrders(); else this.setData({ loading: false })
  },
  async loadOrders() {
    try { const orders = await api.get('/user/orders'); this.setData({ orders, loading: false }) }
    catch (e) { this.setData({ loading: false }) }
  },
  onCourseTap(e) { const id = e.currentTarget.dataset.id; wx.navigateTo({ url: `/pages/course/detail?id=${id}` }) },
  onLoginTap() { wx.navigateTo({ url: '/pages/user/login' }) },
})
