// index.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min')
var qqmapsdk
const chooseLocation = requirePlugin('chooseLocation')
// 获取应用实例
const app = getApp()

Page({
  data: {
    tabbar: 'index',
    nowLocationText: '当前位置',
    nowLongitude: 117.396018,
    nowLatitude: 39.545546,
    targetLocationText: '请选择你的目的地',
    targetLatitude: '',
    targetLongitude: '',
    type: 'self',
    types: [{
      label: '专车独享',
      value: 'self'
    }, {
      label: '经济拼车',
      value: 'share'
    }],
    orderlist: ''
  },
  onLoad() {
    qqmapsdk = new QQMapWX({ key: app.globalData.qmapKey })
    var _this = this
    _this.getOrderList()
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
  onShow() {
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
  typeChange (e) {
    const type = e.currentTarget.dataset.type
    this.setData({ type: type })
  },
  submit () {
    const nowLocationText = this.data.nowLocationText
    const nowLongitude = this.data.nowLongitude
    const nowLatitude = this.data.nowLatitude
    const targetLocationText = this.data.targetLocationText
    const targetLatitude = this.data.targetLatitude
    const targetLongitude = this.data.targetLongitude
    const type = this.data.type
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
      type: type
    }
    console.log('出行信息', polylinePara)
    app.globalData.polylinePara = polylinePara
    
    if (!app.globalData.userInfo) {
      wx.navigateTo({ url: '../index/register' })
      return
    }
    
    wx.navigateTo({ url: '../polyline/polyline' })
  },
  getOrderList () {
    var _this = this
    wx.request({
      url: app.globalData.domain + '/order',
      success (res) {
        if (res.statusCode == 200) {
          _this.setData({ orderlist: res.data })
        }
      }
    })
  },
  onUnload () {
    // 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
    chooseLocation.setLocation(null)
  },
  NavChange (e) {
    const tarrgetTab = e.currentTarget.dataset.cur
    wx.redirectTo({ url: tarrgetTab })
  },
})
