// pages/index/register.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 'user',  // user乘客， driver 驾驶员
    showPassword: false,
    idcard: '321123199910240011',
    name: '',
    mobile: '',
    password: '',
    car_model: '',
    car_no: '',
    car_limit: ''
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
  displayPassword: function () {
    const showPassword = this.data.showPassword
    this.setData({
      showPassword: !showPassword
    })
  },
  // 调用OCR插件识别证件号码
  ocrIdcard: function (params) {
    // 识别证件号码
    let idcardNo = params.detail.id.text
    this.setData({ idcard: idcardNo })
  },
  inputChange: function (params) {
    var key = params.target.id
    var value = params.detail.value
    this.setData({ [key]: value })
  },
  formCheck: function () {
    const type = this.data.type
    if (this.data.name.length <= 0 ) {
      wx.showToast({ title: '未填写姓名', icon: 'none' })
      return false
    }
    if (this.data.mobile.length != 11 ) {
      wx.showToast({ title: '请填写正确手机号', icon: 'none' })
      return false
    }
    if (this.data.idcard.length != 18 ) {
      wx.showToast({ title: '请扫描输入正确身份证', icon: 'none' })
      return false
    }
    if (this.data.password.length <= 4 ) {
      wx.showToast({ title: '密码不得少于4位', icon: 'none' })
      return false
    }
    if (type == 'driver' && this.data.car_model.length <= 2 ) {
      wx.showToast({ title: '请输入完整车型名称', icon: 'none' })
      return false
    }
    if (type == 'driver' && this.data.car_no.length <= 5 ) {
      wx.showToast({ title: '请输入完整车牌号', icon: 'none' })
      return false
    }
    if (type == 'driver' && this.data.car_limit <= 0) {
      wx.showToast({ title: '请输入正确核载人数', icon: 'none' })
      return false
    }
    return true
  },
  getUserProfile: function (params) {
    var _this = this
    if (this.formCheck() === false) {
      return
    }
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        let data = {
          type: _this.data.type,
          openid: app.globalData.openid,
          nickname: res.userInfo.nickName,
          avatar: res.userInfo.avatarUrl,
          name: _this.data.name,
          mobile: _this.data.mobile,
          idcard: _this.data.idcard,
          password: _this.data.password,
          status: 1
        }
        if (data.type == 'driver') {
          data.car_model = _this.data.car_model
          data.car_no = _this.data.car_no
          data.car_limit = _this.data.car_limit
        }
        console.log('用户信息', data)
        _this.sendRegisterPost(data)
      }
    })
  },
  sendRegisterPost: function (data) {
    wx.request({
      url: app.globalData.domain + '/register',
      data: data,
      method: 'POST',
      success: function(res){
        if (res.statusCode == 200) {
          wx.setStorageSync('userinfo', data)
          wx.showToast({ title: '成功' })
        } else {
          wx.showToast({
            title: res.data,
            icon: 'none'
          })
        }
      }
    })
  }
})