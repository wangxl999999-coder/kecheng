const api = require('../../utils/request')
const app = getApp()

Page({
  data: {
    currentTab: 0,
    tabs: [
      { name: '全部', type: 'all' },
      { name: '视频', type: 'video' },
      { name: '音频', type: 'audio' },
      { name: '专栏', type: 'article' },
      { name: '直播', type: 'live' },
    ],
    courses: [],
    loading: true,
    isLoggedIn: false,
  },

  onShow() {
    const isLoggedIn = app.checkLogin()
    this.setData({ isLoggedIn })
    if (isLoggedIn) this.loadCourses()
    else this.setData({ loading: false })
  },

  async loadCourses() {
    try {
      const type = this.data.tabs[this.data.currentTab].type
      const courses = await api.get('/user/courses', { type })
      this.setData({ courses, loading: false })
    } catch (e) { this.setData({ loading: false }) }
  },

  onTabChange(e) {
    const idx = e.currentTarget.dataset.index
    if (idx === this.data.currentTab) return
    this.setData({ currentTab: idx })
    this.loadCourses()
  },

  onCourseTap(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/course/detail?id=${id}` })
  },

  onLoginTap() {
    wx.navigateTo({ url: '/pages/user/login' })
  },
})
