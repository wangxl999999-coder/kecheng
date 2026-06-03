const api = require('../../utils/request')
const app = getApp()

Page({
  data: {
    courseId: 0,
    lessonId: 0,
    course: null,
    currentLesson: null,
    favorited: false,
    showSpeedPopup: false,
    speeds: [0.5, 0.75, 1.0, 1.25, 1.5, 2.0],
    currentSpeed: 1.0,
    isFullscreen: false,
  },

  onLoad(options) {
    this.setData({ courseId: options.courseId, lessonId: parseInt(options.lessonId) })
    this.loadCourse()
    this.loadFavoriteStatus()
  },

  async loadCourse() {
    const course = await api.get(`/home/courses/${this.data.courseId}`)
    let currentLesson = null
    for (const chapter of course.chapters) {
      for (const lesson of chapter.lessons) {
        if (lesson.id === this.data.lessonId) {
          currentLesson = lesson
          break
        }
      }
      if (currentLesson) break
    }
    this.setData({ course, currentLesson })
    this.updateProgress()
  },

  async loadFavoriteStatus() {
    if (!app.checkLogin()) return
    try {
      const favorites = await api.get('/user/favorites')
      const favorited = favorites.some(f => f.courseId === parseInt(this.data.courseId))
      this.setData({ favorited })
    } catch (e) {}
  },

  async updateProgress() {
    if (!app.checkLogin()) return
    try {
      await api.post('/user/progress', { courseId: parseInt(this.data.courseId), lessonId: this.data.lessonId })
    } catch (e) {}
  },

  onVideoError(e) {
    wx.showToast({ title: '视频加载失败', icon: 'none' })
  },

  onSpeedTap() {
    this.setData({ showSpeedPopup: !this.data.showSpeedPopup })
  },

  onSpeedSelect(e) {
    const speed = e.currentTarget.dataset.speed
    this.setData({ currentSpeed: speed, showSpeedPopup: false })
    const videoCtx = wx.createVideoContext('videoPlayer', this)
    videoCtx.playbackRate(speed)
  },

  onFullscreenChange(e) {
    this.setData({ isFullscreen: e.detail.fullScreen })
  },

  onFullscreenTap() {
    const videoCtx = wx.createVideoContext('videoPlayer', this)
    if (!this.data.isFullscreen) {
      videoCtx.requestFullScreen({ direction: 90 })
    } else {
      videoCtx.exitFullScreen()
    }
  },

  async onFavoriteTap() {
    if (!app.requireLogin()) return
    try {
      const res = await api.post('/user/favorites', { courseId: parseInt(this.data.courseId) })
      this.setData({ favorited: res.favorited })
      wx.showToast({ title: res.favorited ? '已收藏' : '已取消', icon: 'none' })
    } catch (e) {}
  },

  onLessonTap(e) {
    const lessonId = e.currentTarget.dataset.id
    this.setData({ lessonId })
    this.loadCourse()
  },
})
