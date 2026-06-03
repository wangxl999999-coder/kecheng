const api = require('../../utils/request')
const app = getApp()

Page({
  data: {
    course: null,
    currentTab: 0,
    favorited: false,
    showBuyPopup: false,
    buyType: 'single',
    timer: null,
    countdown: { hours: '00', minutes: '00', seconds: '00' },
  },

  onLoad(options) {
    this.courseId = options.id
    this.loadCourse()
  },

  onUnload() {
    if (this.data.timer) clearInterval(this.data.timer)
  },

  async loadCourse() {
    const course = await api.get(`/home/courses/${this.courseId}`)
    this.setData({ course })
    this.checkFavorite()
    if (course.liveInfo && course.liveInfo.status === 'upcoming') {
      this.startCountdown()
    }
  },

  checkFavorite() {
    if (!app.checkLogin()) return
    api.get('/user/favorites').then(favs => {
      const favorited = favs.some(f => f.courseId === parseInt(this.courseId))
      this.setData({ favorited })
    }).catch(() => {})
  },

  startCountdown() {
    const timer = setInterval(() => {
      const liveInfo = this.data.course.liveInfo
      if (!liveInfo) { clearInterval(timer); return }
      const now = new Date().getTime()
      const start = new Date(liveInfo.startTime).getTime()
      const diff = start - now
      if (diff <= 0) {
        clearInterval(timer)
        this.setData({ 'course.liveInfo.status': 'living' })
        return
      }
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      this.setData({
        countdown: {
          hours: hours.toString().padStart(2, '0'),
          minutes: minutes.toString().padStart(2, '0'),
          seconds: seconds.toString().padStart(2, '0'),
        }
      })
    }, 1000)
    this.setData({ timer })
  },

  onTabChange(e) {
    this.setData({ currentTab: e.currentTarget.dataset.index })
  },

  onBuyTap() {
    this.setData({ showBuyPopup: true, buyType: 'single' })
  },

  onGroupBuyTap() {
    this.setData({ showBuyPopup: true, buyType: 'group' })
  },

  onPopupClose() {
    this.setData({ showBuyPopup: false })
  },

  onBuyTypeChange(e) {
    this.setData({ buyType: e.currentTarget.dataset.type })
  },

  async onConfirmBuy() {
    if (!app.requireLogin()) return
    const { buyType, course } = this.data
    try {
      await api.post('/user/orders', { courseId: course.id, type: buyType })
      wx.showToast({ title: '购买成功', icon: 'success' })
      this.setData({ showBuyPopup: false })
      setTimeout(() => wx.navigateTo({ url: `/pages/course/learn?courseId=${course.id}` }), 1500)
    } catch (e) {}
  },

  async onFavoriteTap() {
    if (!app.requireLogin()) return
    try {
      const res = await api.post('/user/favorites', { courseId: this.courseId })
      this.setData({ favorited: res.favorited })
      wx.showToast({ title: res.favorited ? '已收藏' : '已取消收藏', icon: 'none' })
    } catch (e) {}
  },

  onLessonTap(e) {
    const { chapterIndex, lessonIndex } = e.currentTarget.dataset
    const lesson = this.data.course.chapters[chapterIndex].lessons[lessonIndex]
    if (!lesson.free && !app.checkLogin()) {
      wx.navigateTo({ url: '/pages/user/login' })
      return
    }
    const typeMap = { video: 'video', audio: 'audio', article: 'article' }
    const url = lesson.type === 'live' ? `/pages/course/live?id=${this.courseId}` : `/pages/course/${typeMap[lesson.type] || 'video'}?courseId=${this.courseId}&lessonId=${lesson.id}`
    wx.navigateTo({ url })
  },

  onLiveReserve() {
    if (!app.requireLogin()) return
    wx.showToast({ title: '预约成功，开播前将提醒您', icon: 'none' })
  },

  onShareAppMessage() {
    return {
      title: this.data.course.title,
      path: `/pages/course/detail?id=${this.courseId}`,
    }
  },
})
