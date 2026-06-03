const api = require('../../utils/request')

Page({
  data: {
    categories: [
      { id: 0, name: '全部', type: '' },
      { id: 1, name: '音频课', type: 'audio' },
      { id: 2, name: '视频课', type: 'video' },
      { id: 3, name: '图文专栏', type: 'article' },
      { id: 4, name: '直播课', type: 'live' },
      { id: 5, name: '训练营', type: 'camp' },
    ],
    currentTab: 0,
    courses: [],
    page: 1,
    hasMore: true,
    loading: false,
  },

  onLoad(options) {
    if (options.type) {
      const idx = this.data.categories.findIndex(c => c.type === options.type)
      if (idx >= 0) this.setData({ currentTab: idx })
    }
    this.loadCourses()
  },

  onTabTap(e) {
    const idx = e.currentTarget.dataset.index
    if (idx === this.data.currentTab) return
    this.setData({ currentTab: idx, courses: [], page: 1, hasMore: true })
    this.loadCourses()
  },

  async loadCourses() {
    if (this.data.loading) return
    this.setData({ loading: true })
    const type = this.data.categories[this.data.currentTab].type
    try {
      const res = await api.get('/home/courses', {
        categoryType: type || undefined,
        page: this.data.page,
        pageSize: 10,
      })
      this.setData({
        courses: this.data.page === 1 ? res.list : this.data.courses.concat(res.list),
        hasMore: res.list.length >= 10,
        page: this.data.page + 1,
        loading: false,
      })
    } catch (e) {
      this.setData({ loading: false })
    }
  },

  onReachBottom() {
    if (this.data.hasMore) this.loadCourses()
  },

  onCourseTap(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/course/detail?id=${id}` })
  },
})
