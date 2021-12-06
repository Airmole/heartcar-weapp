// pages/index/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: 'my',
    userInfo: '',
    hasLogined: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.inital()
  },
  goLogin () {
    wx.navigateTo({
      url: './register',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.inital()
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
  inital () {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({ hasLogined: true, userInfo: userInfo })
    }
  },
  NavChange (e) {
    const tarrgetTab = e.currentTarget.dataset.cur
    wx.redirectTo({ url: tarrgetTab })
  },
  loginout () {
    wx.showModal({
      title: '提示',
      content: '确认注销登录嘛？',
      success(res) {
        if (res.confirm) {
          wx.clearStorageSync()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})