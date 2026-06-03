const api = require('../../utils/request')
const app = getApp()

Page({
  data: {
    phone: '',
    code: '',
    counting: false,
    countdown: 60,
    timer: null,
  },

  onUnload() {
    if (this.data.timer) clearInterval(this.data.timer)
  },

  onPhoneInput(e) {
    this.setData({ phone: e.detail.value })
  },

  onCodeInput(e) {
    this.setData({ code: e.detail.value })
  },

  async onSendCode() {
    const { phone, counting } = this.data
    if (counting) return
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }
    try {
      await api.post('/user/sendCode', { phone })
      wx.showToast({ title: '验证码已发送(测试:123456)', icon: 'none' })
      this.startCountdown()
    } catch (e) {}
  },

  startCountdown() {
    this.setData({ counting: true, countdown: 60 })
    const timer = setInterval(() => {
      const countdown = this.data.countdown - 1
      if (countdown <= 0) {
        clearInterval(timer)
        this.setData({ counting: false, countdown: 60, timer: null })
        return
      }
      this.setData({ countdown })
    }, 1000)
    this.setData({ timer })
  },

  async onLogin() {
    const { phone, code } = this.data
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }
    if (!code) {
      wx.showToast({ title: '请输入验证码', icon: 'none' })
      return
    }
    try {
      const data = await api.post('/user/login', { phone, code })
      wx.setStorageSync('token', data.token)
      wx.setStorageSync('userInfo', data.userInfo)
      app.globalData.token = data.token
      app.globalData.userInfo = data.userInfo
      wx.showToast({ title: '登录成功', icon: 'success' })
      setTimeout(() => {
        const pages = getCurrentPages()
        if (pages.length > 1) {
          wx.navigateBack()
        } else {
          wx.switchTab({ url: '/pages/home/home' })
        }
      }, 1500)
    } catch (e) {}
  },

  onPrivacyTap() {
    wx.showModal({
      title: '隐私政策',
      content: '我们非常重视您的个人信息保护，将按照隐私政策使用和保护您的信息。',
      showCancel: false,
    })
  },
})
