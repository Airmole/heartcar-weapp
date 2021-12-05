// pages/order/list.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0,
    types: ['所有订单', '待完成订单', '已完成订单'],
    orderlist: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const type = options.type ? options.type : 0
    this.setData({ type: type })
    this.getList(type)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  getList(type=0){
    var _this = this
    const types = ['all', 'picking', 'finish']
    let typeval = types[type]

    wx.request({
      url: app.globalData.domain + '/order/my',
      data: {
        mobile: app.globalData.userInfo.mobile,
        type: typeval
      },
      success (res) {
        if (res.statusCode == 200) {
          _this.setData({ orderlist: res.data })
        }
      }
    })
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

  }
})