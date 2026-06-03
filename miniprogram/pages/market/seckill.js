const api = require('../../utils/request')
const util = require('../../utils/util')

Page({
  data: {
    seckillCourses: [],
    loading: true,
    countdowns: {},
  },

  onLoad() {
    this.loadData()
  },

  async loadData() {
    try {
      const seckillCourses = await api.get('/home/courses/seckill')
      this.setData({ seckillCourses, loading: false })
      this.startCountdowns()
    } catch (e) {
      this.setData({ loading: false })
    }
  },

  startCountdowns() {
    this.timer = setInterval(() => {
      const countdowns = {}
      this.data.seckillCourses.forEach(item => {
        const now = new Date().getTime()
        const end = new Date(item.endTime).getTime()
        const diff = end - now
        if (diff <= 0) {
          countdowns[item.id] = { hours: '00', minutes: '00', seconds: '00', ended: true }
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0')
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0')
          const seconds = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0')
          countdowns[item.id] = { hours, minutes, seconds, ended: false }
        }
      })
      this.setData({ countdowns })
    }, 1000)
  },

  onUnload() {
    if (this.timer) clearInterval(this.timer)
  },

  onCourseTap(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/course/detail?id=${id}` })
  },
})
