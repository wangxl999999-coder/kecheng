const api = require('../../utils/request')
const util = require('../../utils/util')

Page({
  data: {
    banners: [],
    categories: [],
    hotCourses: [],
    newCourses: [],
    seckillCourses: [],
    groupCourses: [],
    loading: true,
  },

  onLoad() {
    this.loadHomeData()
  },

  onPullDownRefresh() {
    this.loadHomeData().then(() => wx.stopPullDownRefresh())
  },

  async loadHomeData() {
    try {
      const [banners, categories, hotCourses, newCourses, seckillCourses, groupCourses] = await Promise.all([
        api.get('/home/banners'),
        api.get('/home/categories'),
        api.get('/home/courses/hot'),
        api.get('/home/courses/new'),
        api.get('/home/courses/seckill'),
        api.get('/home/courses/group'),
      ])
      this.setData({
        banners,
        categories,
        hotCourses: hotCourses.slice(0, 4),
        newCourses: newCourses.slice(0, 4),
        seckillCourses: seckillCourses.slice(0, 3),
        groupCourses: groupCourses.slice(0, 3),
        loading: false,
      })
    } catch (e) {
      this.setData({ loading: false })
    }
  },

  onBannerTap(e) {
    const { link } = e.currentTarget.dataset
    if (link) wx.navigateTo({ url: link })
  },

  onCategoryTap(e) {
    const { type } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/category/category?type=${type}` })
  },

  onSearchTap() {
    wx.navigateTo({ url: '/pages/search/search' })
  },

  onCourseTap(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/course/detail?id=${id}` })
  },

  onSeckillTap() {
    wx.navigateTo({ url: '/pages/market/seckill' })
  },

  onGroupTap() {
    wx.navigateTo({ url: '/pages/market/group' })
  },

  onMoreHot() {
    wx.navigateTo({ url: '/pages/category/category?tab=hot' })
  },

  onMoreNew() {
    wx.navigateTo({ url: '/pages/category/category?tab=new' })
  },
})
