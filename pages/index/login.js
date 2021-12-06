// pages/index/login.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 'user',  // user乘客， driver 驾驶员
    showPassword: false,
    types: [{
      label: '我是乘客',
      value: 'user'
    }, {
      label: '我是司机',
      value: 'driver'
    }],
    mobile: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const type = options.type ? options.type : 'user'
    this.setData({ type: type })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  inputChange: function (params) {
    var key = params.target.id
    var value = params.detail.value
    this.setData({ [key]: value })
  },
  displayPassword: function () {
    const showPassword = this.data.showPassword
    this.setData({
      showPassword: !showPassword
    })
  },
  typeChange (e) {
    const type = e.currentTarget.dataset.type
    this.setData({ type: type })
  },
  formCheck: function () {
    const type = this.data.type
    if (this.data.mobile.length != 11 ) {
      wx.showToast({ title: '请填写正确手机号', icon: 'none' })
      return false
    }
    if (this.data.password.length <= 4 ) {
      wx.showToast({ title: '密码不得少于4位', icon: 'none' })
      return false
    }
    return true
  },
  login () {
    this.formCheck()
    const data = {
      mobile: this.data.mobile,
      password: this.data.password,
      type: this.data.type
    }
    wx.request({
      url: app.globalData.domain + '/login',
      data: data,
      method: 'POST',
      success: function(res){
        if (res.statusCode == 200 && res.data.message == 'success') {
          console.log('登录成功', res.data)
          wx.setStorageSync('userInfo', res.data.data)
          wx.showToast({ title: '登录成功' })
          setTimeout(function () { wx.redirectTo({ url: '../index/index' }) }, 1000)
        } else if (res.statusCode == 403 && res.data.message == '未注册') {
          wx.showToast({
            title: '请先注册',
            icon: 'none'
          })
        } else if (res.statusCode == 403 && res.data.message == '密码错误') {
          wx.showToast({
            title: '密码错误,建议尝试微信免密登录',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: res.data,
            icon: 'none'
          })
        }
      }
    })
  },
  wechatLogin () {
    const data = {
      openid: app.globalData.openid,
      type: this.data.type
    }
    wx.request({
      url: app.globalData.domain + '/wechat/login',
      data: data,
      method: 'POST',
      success: function(res){
        if (res.statusCode == 200 && res.data.message == 'success') {
          console.log('登录成功', res.data)
          wx.setStorageSync('userInfo', res.data.data)
          wx.showToast({ title: '登录成功' })
          setTimeout(function () { wx.redirectTo({ url: '../index/index' }) }, 1000)
        } else if (res.statusCode == 403 && res.data.message == '未注册') {
          wx.showToast({
            title: '请先注册',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: res.data,
            icon: 'none'
          })
        }
      }
    })
  },
})