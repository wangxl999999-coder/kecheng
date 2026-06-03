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
    videoContext: null,
  },

  onLoad(options) {
    this.setData({ courseId: options.courseId, lessonId: parseInt(options.lessonId) })
    this.loadCourse()
    this.loadFavoriteStatus()
  },

  onReady() {
    this.videoContext = wx.createVideoContext('videoPlayer', this)
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
    console.error('视频加载错误:', e.detail)
    wx.showToast({ title: '视频加载失败', icon: 'none' })
  },

  onVideoPlay() {
    console.log('视频开始播放')
  },

  onSpeedTap() {
    this.setData({ showSpeedPopup: !this.data.showSpeedPopup })
  },

  onSpeedSelect(e) {
    const speed = e.currentTarget.dataset.speed
    this.setData({ currentSpeed: speed, showSpeedPopup: false })
    if (this.videoContext) {
      this.videoContext.playbackRate(speed)
    }
  },

  onFullscreenChange(e) {
    console.log('全屏状态变化:', e.detail.fullScreen)
    this.setData({ isFullscreen: e.detail.fullScreen })
  },

  onFullscreenTap() {
    try {
      if (!this.videoContext) {
        this.videoContext = wx.createVideoContext('videoPlayer', this)
      }
      if (!this.data.isFullscreen) {
        console.log('尝试进入全屏...')
        this.videoContext.requestFullScreen({
          direction: 90,
          success: () => {
            console.log('进入全屏成功')
          },
          fail: (err) => {
            console.error('进入全屏失败:', err)
            wx.showModal({
              title: '提示',
              content: '全屏功能在微信开发者工具中可能存在兼容性问题，建议在真机上测试。视频控件自带的全屏按钮（右下角）应该可以正常使用。',
              showCancel: false,
              confirmText: '知道了'
            })
          }
        })
      } else {
        console.log('尝试退出全屏...')
        this.videoContext.exitFullScreen({
          success: () => {
            console.log('退出全屏成功')
          },
          fail: (err) => {
            console.error('退出全屏失败:', err)
          }
        })
      }
    } catch (e) {
      console.error('全屏操作异常:', e)
      wx.showToast({ title: '全屏功能异常', icon: 'none' })
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
