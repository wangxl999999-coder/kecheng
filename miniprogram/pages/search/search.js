const api = require('../../utils/request')

Page({
  data: {
    keyword: '',
    searchHistory: [],
    hotKeywords: ['产品经理', 'Python', 'AI大模型', 'React', '数据分析', '沟通技巧'],
    searchResult: [],
    searching: false,
    searched: false,
    page: 1,
    hasMore: true,
  },

  onLoad() {
    const history = wx.getStorageSync('searchHistory') || []
    this.setData({ searchHistory: history })
  },

  onInput(e) {
    this.setData({ keyword: e.detail.value })
  },

  onSearch() {
    const { keyword } = this.data
    if (!keyword.trim()) return
    this.saveHistory(keyword.trim())
    this.setData({ searching: true, searched: true, page: 1, searchResult: [], hasMore: true })
    this.doSearch()
  },

  onKeywordTap(e) {
    const keyword = e.currentTarget.dataset.keyword
    this.setData({ keyword }, () => this.onSearch())
  },

  onHistoryDelete() {
    wx.removeStorageSync('searchHistory')
    this.setData({ searchHistory: [] })
  },

  saveHistory(keyword) {
    let history = wx.getStorageSync('searchHistory') || []
    history = history.filter(h => h !== keyword)
    history.unshift(keyword)
    if (history.length > 10) history = history.slice(0, 10)
    wx.setStorageSync('searchHistory', history)
    this.setData({ searchHistory: history })
  },

  async doSearch() {
    const { keyword, page, searchResult } = this.data
    try {
      const res = await api.get('/home/courses', { keyword, page, pageSize: 10 })
      this.setData({
        searchResult: page === 1 ? res.list : searchResult.concat(res.list),
        hasMore: res.list.length >= 10,
        searching: false,
        page: page + 1,
      })
    } catch (e) {
      this.setData({ searching: false })
    }
  },

  onReachBottom() {
    if (this.data.hasMore && this.data.searched) {
      this.doSearch()
    }
  },

  onCourseTap(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/course/detail?id=${id}` })
  },

  onClearInput() {
    this.setData({ keyword: '', searched: false, searchResult: [] })
  },
})
