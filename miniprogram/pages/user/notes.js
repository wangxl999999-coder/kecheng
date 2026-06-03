const api = require('../../utils/request')
const app = getApp()
Page({
  data: { notes: [], loading: true, isLoggedIn: false },
  onShow() {
    const isLoggedIn = app.checkLogin()
    this.setData({ isLoggedIn })
    if (isLoggedIn) this.loadNotes(); else this.setData({ loading: false })
  },
  async loadNotes() {
    try { const notes = await api.get('/user/notes'); this.setData({ notes, loading: false }) }
    catch (e) { this.setData({ loading: false }) }
  },
  onNoteTap(e) { const { courseid, lessonid } = e.currentTarget.dataset; wx.navigateTo({ url: `/pages/course/article?courseId=${courseid}&lessonId=${lessonid}` }) },
  onLoginTap() { wx.navigateTo({ url: '/pages/user/login' }) },
})
