const api = require('../../utils/request')

Page({
  data: { groupCourses: [], loading: true },

  onLoad() { this.loadData() },

  async loadData() {
    try {
      const groupCourses = await api.get('/home/courses/group')
      this.setData({ groupCourses, loading: false })
    } catch (e) { this.setData({ loading: false }) }
  },

  onCourseTap(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/course/detail?id=${id}` })
  },
})
