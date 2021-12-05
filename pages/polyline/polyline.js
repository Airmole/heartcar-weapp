// pages/polyline/polyline.js
var app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min')
var qqmapsdk = new QQMapWX({ key: app.globalData.qmapKey })
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activeColor: '#5260DD',
    inactiveColor: '#68A6D6',
    nowLongitude: 116.273514,
    nowLatitude: 40.040417,
    targetLongitude: 116.321591826,
    targetLatitude: 39.894793139,
    polyline: '',
    tabPolyline: 0,
    scrollLeft: 0,
    mapHeight: 500,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let sysinfo = wx.getSystemInfoSync()
    const mapHeight = sysinfo.windowHeight - 200
    this.setData({  mapHeight: mapHeight })
    this.calcPolyline()
  },
  submit () {
    const tabPolyline = this.data.tabPolyline
    const selectRoute = this.data.routes[tabPolyline]
    // console.log(tabPolyline, selectRoute, app.globalData.userInfo)
    const order = {
      mobile: app.globalData.userInfo.mobile,
      direction: selectRoute,
      start_text: app.globalData.polylinePara.now.text,
      start: {
        latitude: app.globalData.polylinePara.now.latitude,
        longitude: app.globalData.polylinePara.now.longitude
      },
      end_text: app.globalData.polylinePara.target.text,
      end: {
        latitude: app.globalData.polylinePara.target.latitude,
        longitude: app.globalData.polylinePara.target.longitude
      },
      distance: selectRoute.distanceText,
      type: app.globalData.polylinePara.type == 'self' ? '0' : '1'
    }
    console.log(order)
    wx.request({
      url: app.globalData.domain + '/order',
      data: order,
      method: 'POST',
      success: function(res){
        if (res.statusCode == 200) {
          wx.showToast({ title: '下单成功成功' })
          console.log('下单成功', res.data)
          setTimeout(function () { wx.redirectTo({ url: `../order/index?id=${res.data.data.id}` }) }, 1000)
        } else {
          wx.showToast({
            title: res.data,
            icon: 'none'
          })
          console.log('下单失败', res.data)
        }
      }
    })
  },
  polylineSelect(e) {
    const polylineIndex = e.currentTarget.dataset.id
    const activeColor = this.data.activeColor
    const inactiveColor = this.data.inactiveColor
    
    let polyline = this.data.polyline
    polyline.forEach((element, index) => {
      polyline[index].color = index === polylineIndex ? activeColor : inactiveColor
    })

    this.setData({
      polyline: polyline,
      tabPolyline: polylineIndex,
      scrollLeft: (polylineIndex-1)*80
    })
  },
  calcPolyline() {
    var _this = this
    //调用距离计算接口
    qqmapsdk.direction({
      mode: 'driving',
      from: {
        latitude: app.globalData.polylinePara.now.latitude,
        longitude: app.globalData.polylinePara.now.longitude
      },
      to: {
        latitude: app.globalData.polylinePara.target.latitude,
        longitude: app.globalData.polylinePara.target.longitude
      },
      policy: 'LEAST_TIME',
      success: function (res) {
        console.log(res)
        const routes = _this.formatRoutes(res.result.routes)
        _this.formatPolylineItemData(routes)
        _this.setData({ routes: routes })
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },
  formatRoutes (routes) {
    routes.forEach((element, index) => {
      routes[index].distanceText = parseFloat(element.distance/1000).toFixed(1) 
    })
    return routes
  },
  formatPolylineItemData(routes, selected=0){
    var _this = this
    const activeColor = this.data.activeColor
    const inactiveColor = this.data.inactiveColor

    let polyline = []
    routes.forEach((element, index) => {
      var coors = element.polyline, pl = []
      //坐标解压（返回的点串坐标，通过前向差分进行压缩）
      var kr = 1000000;
      for (var i = 2; i < coors.length; i++) {
        coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
      }
      //将解压后的坐标放入点串数组pl中
      for (var i = 0; i < coors.length; i += 2) {
        const point = { latitude: coors[i], longitude: coors[i + 1] }
        pl.push(point)
      }
      let color = index == selected ? activeColor : inactiveColor
      polyline.push({
        points: pl,
        color: color,
        arrowLine: true,
        width: 6
      })
    })
    _this.setData({polyline: polyline})
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

  }
})