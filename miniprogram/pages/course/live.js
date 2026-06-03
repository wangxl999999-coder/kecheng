const api = require('../../utils/request')
const app = getApp()

Page({
  data: {
    courseId: 0,
    course: null,
    liveStatus: 'upcoming',
    hasReserved: false,
    showBuyPopup: false,
  },

  onLoad(options) {
    this.setData({ courseId: options.id })
    this.loadCourse()
  },

  async loadCourse() {
    const course = await api.get(`/home/courses/${this.data.courseId}`)
    let liveStatus = 'upcoming'
    if (course.liveInfo) {
      const now = new Date().getTime()
      const start = new Date(course.liveInfo.startTime).getTime()
      const end = new Date(course.liveInfo.endTime).getTime()
      if (now >= start && now < end) liveStatus = 'living'
      else if (now >= end) liveStatus = 'ended'
    }
    this.setData({ course, liveStatus })
  },

  onReserve() {
    if (!app.requireLogin()) return
    this.setData({ hasReserved: true })
    wx.showToast({ title: '预约成功，开播前将提醒您', icon: 'none' })
  },

  onBuyTap() {
    this.setData({ showBuyPopup: true })
  },

  async onConfirmBuy() {
    if (!app.requireLogin()) return
    try {
      await api.post('/user/orders', { courseId: this.data.course.id, type: 'single' })
      wx.showToast({ title: '购买成功', icon: 'success' })
      this.setData({ showBuyPopup: false })
    } catch (e) {}
  },

  onClosePopup() {
    this.setData({ showBuyPopup: false })
  },

  onReplay() {
    wx.showToast({ title: '正在加载回放...', icon: 'none' })
  },
})
