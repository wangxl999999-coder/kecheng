const api = require('../../utils/request')
const app = getApp()

Page({
  data: {
    courses: [],
    currentTab: 0,
    tabs: [
      { name: '全部', type: 'all' },
      { name: '视频', type: 'video' },
      { name: '音频', type: 'audio' },
      { name: '专栏', type: 'article' },
      { name: '直播', type: 'live' },
    ],
    loading: true,
    isLoggedIn: false,
  },

  onShow() {
    const isLoggedIn = app.checkLogin()
    this.setData({ isLoggedIn })
    if (isLoggedIn) {
      this.loadUserCourses()
    } else {
      this.setData({ courses: [], loading: false })
    }
  },

  async loadUserCourses() {
    try {
      const type = this.data.tabs[this.data.currentTab].type
      const courses = await api.get('/user/courses', { type })
      this.setData({ courses, loading: false })
    } catch (e) {
      this.setData({ loading: false })
    }
  },

  onTabChange(e) {
    const idx = e.currentTarget.dataset.index
    if (idx === this.data.currentTab) return
    this.setData({ currentTab: idx })
    this.loadUserCourses()
  },

  onCourseTap(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/course/detail?id=${id}` })
  },

  onContinueLearn(e) {
    const { id } = e.currentTarget.dataset
    const course = this.data.courses.find(c => c.courseId === id)
    if (!course) return
    const courseData = course.course
    if (!courseData || !courseData.chapters || courseData.chapters.length === 0) return
    let firstUnlearned = null
    for (const chapter of courseData.chapters) {
      for (const lesson of chapter.lessons) {
        if (!course.learnedLessons.includes(lesson.id)) {
          firstUnlearned = lesson
          break
        }
      }
      if (firstUnlearned) break
    }
    if (!firstUnlearned) firstUnlearned = courseData.chapters[0].lessons[0]
    const typeMap = { video: 'video', audio: 'audio', article: 'article' }
    const url = firstUnlearned.type === 'live' ? `/pages/course/live?id=${id}` : `/pages/course/${typeMap[firstUnlearned.type] || 'video'}?courseId=${id}&lessonId=${firstUnlearned.id}`
    wx.navigateTo({ url })
  },

  onLoginTap() {
    wx.navigateTo({ url: '/pages/user/login' })
  },
})
