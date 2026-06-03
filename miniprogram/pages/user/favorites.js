const api = require('../../utils/request')
const app = getApp()
Page({
  data: { favorites: [], loading: true },
  onShow() { if (app.checkLogin()) this.loadFavorites(); else this.setData({ loading: false }) },
  async loadFavorites() {
    try { const favorites = await api.get('/user/favorites'); this.setData({ favorites, loading: false }) }
    catch (e) { this.setData({ loading: false }) }
  },
  async onCancelFavorite(e) {
    const id = e.currentTarget.dataset.id
    try {
      await api.post('/user/favorites', { courseId: id })
      wx.showToast({ title: '已取消收藏', icon: 'none' })
      this.loadFavorites()
    } catch (e) {}
  },
  onCourseTap(e) { const id = e.currentTarget.dataset.id; wx.navigateTo({ url: `/pages/course/detail?id=${id}` }) },
  onLoginTap() { wx.navigateTo({ url: '/pages/user/login' }) },
})
