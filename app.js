// app.js
App({
  globalData: {
    qmapKey: '2SMBZ-D32WV-ATNPI-UEOYY-SWIWT-LGBL4',
    domain: 'http://localhost/api',
    userInfo: null,
    openid: ''
  },
  onLaunch() {
    // this.globalData.domain = 'http://101.42.94.134/api'

    this.globalData.userInfo = wx.getStorageSync('userInfo')
    this.getUserOpenId()
  },
  getUserOpenId: function (callback) {
    var self = this
    var storageOpenid = wx.getStorageSync('openid')
    if (storageOpenid.openid) {
      wx.checkSession({
        success () {
          //session_key 未过期，并且在本生命周期一直有效
          self.globalData.openid = storageOpenid.openid
          return
        },
        fail () {
          // session_key 已经失效，需要重新执行登录流程
          self.wxLoginAndRequest()
        }
      })
    }
    if (self.globalData.openid) {
      callback(null, self.globalData.openid)
    } else {
      this.wxLoginAndRequest()
    }
  },
  wxLoginAndRequest: function () {
    var self = this
    wx.login({
      success: function (data) {
        wx.request({
          url: self.globalData.domain + `/wechat/openid?jscode=${data.code}`,
          success: function (res) {
            console.log('拉取openid成功', res.data)
            wx.setStorageSync('openid', res.data)
            self.globalData.openid = res.data.openid
            self.globalData.session_key = res.data.session_key
          },
          fail: function (res) {
            console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
          }
        })
      },
      fail: function (err) {
        console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
      }
    })
  },
})
