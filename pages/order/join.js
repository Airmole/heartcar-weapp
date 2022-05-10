// pages/order/join.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min')
var qqmapsdk
const chooseLocation = requirePlugin('chooseLocation')
// 获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    nowLocationText: '当前位置',
    nowLongitude: 117.396018,
    nowLatitude: 39.545546,
    targetLocationText: '请选择你的目的地',
    targetLatitude: '',
    targetLongitude: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('join', options)
    this.setData({ id: options.id })
    qqmapsdk = new QQMapWX({ key: app.globalData.qmapKey })
    var _this = this
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标  
      success: function(res) {
        _this.setData({
          nowLongitude: res.longitude,
          nowLatitude: res.latitude
        })
        _this.getLocationText(res.latitude, res.longitude)
      }
    })
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
    const targetlocation = chooseLocation.getLocation()
    if (targetlocation) {
      console.log('location', targetlocation)
      this.setData({ 
        targetLocationText: `${targetlocation.name} ${targetlocation.address}`,
        targetLatitude: targetlocation.latitude,
        targetLongitude: targetlocation.longitude
      })
    }
  },


  // 获取用户定位文字描述
  getLocationText (latitude, longitude) {
    var _this = this
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function(res) {
        console.log('获取用户定位文字描述', res)
        _this.setData({
          nowLocationText: res.result.formatted_addresses.recommend
        })
      },
      fail: function(error) {
        console.error(error)
      }
    })
  },
  choseTarget () {
    wx.navigateTo({
      url: 'plugin://chooseLocation/index?key=' + app.globalData.qmapKey + '&referer=从心拼车'
    })    
  },
  submit () {
    const nowLocationText = this.data.nowLocationText
    const nowLongitude = this.data.nowLongitude
    const nowLatitude = this.data.nowLatitude
    const targetLocationText = this.data.targetLocationText
    const targetLatitude = this.data.targetLatitude
    const targetLongitude = this.data.targetLongitude
    if (targetLongitude == '' || targetLatitude == '') {
      wx.showToast({ title: '请选择目的地', icon: 'none' })
      return
    }

    if (!app.globalData.userInfo) {
      wx.showToast({ title: '请先注册登录',icon: 'none' })
      setTimeout(function () { wx.redirectTo({ url: '../index/register' }) }, 1000)
      return
    }

    const polylinePara = {
      now: {
        text: nowLocationText,
        longitude: nowLongitude,
        latitude: nowLatitude
      },
      target: {
        text: targetLocationText,
        longitude: targetLongitude,
        latitude: targetLatitude
      },
      type: 'join',
      id: this.data.id
    }
    app.globalData.polylinePara = polylinePara
    
    if (!app.globalData.userInfo) {
      wx.navigateTo({ url: '../index/register' })
      return
    }
    
    wx.navigateTo({ url: '../polyline/polyline' })
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