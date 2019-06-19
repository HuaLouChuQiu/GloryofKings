//index.js
//获取应用实例
const app = getApp()
var wxCharts = require("../../utils/wxcharts.js");
Page({
  data: {
    motto: '欢迎来到王者&荣耀',
    userInfo: {},
    hasUserInfo: false,
    myResult: {},
    display: "none",
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../result/result',
    })
  },
  onLoad: function () {
    var that = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
   
    //战绩
    wx.request({
      url: app.globalData.http + 'myResult',
      data: {},
      method: 'GET',
      success: function (res) {
        console.log(res.data.myResult)
        that.setData({ //此时OK
          'myResult': res.data.myResult,
          'display': "block"
        })
        // 隐藏加载框
        wx.hideLoading();
      },
      fail: function (res) {
        console.log('错误' + ':' + res)
      }
    })

  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
