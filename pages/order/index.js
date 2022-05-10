// pages/order/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    mobile: '',
    order: '',
    polyline: '',
    allpoints: '',
    statuses: ['待接单', '已接单', '进行中', '订单结束', '已取消'],
    userType: 'user',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id
    if (!id) {
      wx.redirectTo({ url: '../index/index' })
      return
    }
    const mobile = app.globalData.userInfo ? app.globalData.userInfo.mobile : ''
    if (!mobile) {
      wx.redirectTo({ url: '../index/register' })
      return
    }
    this.setData({ id: id, mobile: mobile })
    this.getDetail(id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getDetail(id) {
    _this = this
    wx.request({
      url: app.globalData.domain + '/order/' + id,
      success: function (res) {
        if (res.statusCode == 200) {
          _this.setData({ order: res.data.data })
          _this.formatPolylineItemData([res.data.data.direction])
        }
      }
    })
  },
  acceptOrder  () {
    const id = this.data.id
    let _this = this
    wx.showModal({
      title: '提示',
      content: '确认接单吗？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.domain + '/order/' + id + '/accept',
            method: 'POST',
            data: { mobile: _this.data.mobile },
            success: function (ress) {
              if (ress.statusCode == 200) {
                _this.getDetail(id)
                setTimeout(function () { wx.showToast({ title: '已成功截单', icon: 'none' }) }, 1000)
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  finishOrder  () {
    const id = this.data.id
    let _this = this
    wx.showModal({
      title: '提示',
      content: '确认完成订单吗？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.domain + '/order/' + id + '/finish',
            method: 'POST',
            data: {
              mobile: _this.data.mobile,
              driver: app.globalData.userInfo.type == 'driver' ? 1 : 0
             },
            success: function (ress) {
              if (ress.statusCode == 200) {
                _this.getDetail(id)
                setTimeout(function () { wx.showToast({ title: '已成功截单', icon: 'none' }) }, 1000)
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  cancelOrder() {
    const id = this.data.id
    let _this = this
    wx.showModal({
      title: '提示',
      content: '确认取消订单吗？取消后该订单结束',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.domain + '/order/' + id + '/cancel',
            success: function (ress) {
              if (ress.statusCode == 200) {
                _this.getDetail(id)
                setTimeout(function () { wx.showToast({ title: '订单已经取消', icon: 'none' }) }, 1000)
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUserType()
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
  formatPolylineItemData(routes) {
    var _this = this

    let polyline = []
    let allpoints = []
    routes.forEach((element, index) => {
      var coors = element.polyline, pl = []
      for (var i = 0; i < coors.length; i += 2) {
        const point = { latitude: coors[i], longitude: coors[i + 1] }
        pl.push(point)
        allpoints.push(point)
      }
      let color = '#5260DD'
      polyline.push({
        points: pl,
        color: color,
        arrowLine: true,
        width: 6
      })
    })
    _this.setData({ polyline: polyline, allpoints: allpoints })
  },
  getUserType () {
    this.setData({ userType: app.globalData.userInfo.type })
  },
  join () {
    const orderId = this.data.id
    if (this.data.order.passengers.indexOf(app.globalData.userInfo.id) >= 0) {
      wx.showToast({ title: '您已经加入拼车了' })
      return
    }
    wx.navigateTo({
      url: './join?id=' + orderId,
    })
  },
  pay () {
    wx.showToast({
      title: '非认证企业，无法接入微信支付',
      icon: 'none'
    })
  }
})