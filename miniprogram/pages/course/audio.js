const app = getApp()
const api = require('../../utils/request')

Page({
  data: {
    courseId: 0,
    lessonId: 0,
    course: null,
    currentLesson: null,
    isPlaying: false,
    currentTime: '00:00',
    duration: '00:00',
    showTimerPopup: false,
    timerOptions: [0, 10, 20, 30, 60],
    selectedTimer: 0,
    timerCountdown: 0,
    timerText: '',
    isFloating: false,
  },

  onLoad(options) {
    this.setData({ courseId: options.courseId, lessonId: parseInt(options.lessonId) })
    this.loadCourse()
  },

  onUnload() {
    this.stopTimer()
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

  async updateProgress() {
    if (!app.checkLogin()) return
    try {
      await api.post('/user/progress', { courseId: parseInt(this.data.courseId), lessonId: this.data.lessonId })
    } catch (e) {}
  },

  onPlayTap() {
    this.setData({ isPlaying: !this.data.isPlaying })
  },

  onPrevTap() {
    wx.showToast({ title: '上一课', icon: 'none' })
  },

  onNextTap() {
    wx.showToast({ title: '下一课', icon: 'none' })
  },

  onTimerTap() {
    this.setData({ showTimerPopup: !this.data.showTimerPopup })
  },

  onTimerSelect(e) {
    const minutes = e.currentTarget.dataset.minutes
    this.setData({ selectedTimer: minutes, showTimerPopup: false })
    if (minutes > 0) {
      this.startTimer(minutes)
    } else {
      this.stopTimer()
    }
  },

  startTimer(minutes) {
    this.stopTimer()
    this.setData({ timerCountdown: minutes * 60 })
    this.timerInterval = setInterval(() => {
      const remaining = this.data.timerCountdown - 1
      if (remaining <= 0) {
        this.stopTimer()
        this.setData({ isPlaying: false })
        wx.showToast({ title: '定时关闭已执行', icon: 'none' })
        return
      }
      const m = Math.floor(remaining / 60)
      const s = remaining % 60
      this.setData({
        timerCountdown: remaining,
        timerText: `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}后关闭`
      })
    }, 1000)
  },

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
      this.timerInterval = null
    }
    this.setData({ timerText: '', timerCountdown: 0, selectedTimer: 0 })
  },

  onFloatingTap() {
    const isFloating = !this.data.isFloating
    this.setData({ isFloating })
    if (isFloating) {
      wx.showToast({ title: '已开启后台播放模式', icon: 'none' })
    } else {
      wx.showToast({ title: '已关闭后台播放', icon: 'none' })
    }
  },

  onLessonTap(e) {
    const lessonId = e.currentTarget.dataset.id
    this.setData({ lessonId })
    this.loadCourse()
  },
})
