const api = require('../../utils/request')
const app = getApp()
Page({
  data: { messages: [], loading: true, isLoggedIn: false },
  onShow() {
    const isLoggedIn = app.checkLogin()
    this.setData({ isLoggedIn })
    if (isLoggedIn) this.loadMessages(); else this.setData({ loading: false })
  },
  async loadMessages() {
    try { const messages = await api.get('/user/messages'); this.setData({ messages, loading: false }) }
    catch (e) { this.setData({ loading: false }) }
  },
  async onMessageTap(e) {
    const id = e.currentTarget.dataset.id
    try { await api.post('/user/messages/read', { id }); this.loadMessages() }
    catch (e) {}
  },
  onLoginTap() { wx.navigateTo({ url: '/pages/user/login' }) },
})
