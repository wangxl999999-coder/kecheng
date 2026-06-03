const api = require('../../utils/request')
const app = getApp()

Page({
  data: {
    userInfo: null,
    stats: { courses: 0, favorites: 0, coupons: 0, orders: 0 },
    menus: [
      { id: 'courses', name: '我的课程', icon: '📚', url: '/pages/user/courses' },
      { id: 'orders', name: '订单列表', icon: '📋', url: '/pages/user/orders' },
      { id: 'favorites', name: '我的收藏', icon: '❤️', url: '/pages/user/favorites' },
      { id: 'notes', name: '学习笔记', icon: '📝', url: '/pages/user/notes' },
      { id: 'coupons', name: '优惠券', icon: '🎫', url: '/pages/market/coupon' },
      { id: 'distribution', name: '分销中心', icon: '💰', url: '/pages/user/distribution' },
      { id: 'messages', name: '消息通知', icon: '🔔', url: '/pages/user/messages' },
    ],
    unreadCount: 0,
  },

  onShow() {
    if (app.checkLogin()) {
      this.loadUserInfo()
      this.loadStats()
    } else {
      this.setData({ userInfo: null, stats: { courses: 0, favorites: 0, coupons: 0, orders: 0 } })
    }
  },

  async loadUserInfo() {
    try {
      const userInfo = await api.get('/user/info')
      this.setData({ userInfo })
    } catch (e) {}
  },

  async loadStats() {
    try {
      const [courses, favorites, coupons, orders, messages] = await Promise.all([
        api.get('/user/courses').catch(() => []),
        api.get('/user/favorites').catch(() => []),
        api.get('/user/coupons').catch(() => []),
        api.get('/user/orders').catch(() => []),
        api.get('/user/messages').catch(() => []),
      ])
      this.setData({
        stats: {
          courses: courses.length,
          favorites: favorites.length,
          coupons: coupons.length,
          orders: orders.length,
        },
        unreadCount: messages.filter(m => !m.isRead).length,
      })
    } catch (e) {}
  },

  onLoginTap() {
    wx.navigateTo({ url: '/pages/user/login' })
  },

  onMenuTap(e) {
    if (!app.requireLogin()) return
    const url = e.currentTarget.dataset.url
    if (url) wx.navigateTo({ url })
  },
})
