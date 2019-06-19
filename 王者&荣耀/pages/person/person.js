//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    // level: "最强王者 7星",
    person:{},
    result:{},
    personHero:{},
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../result/result',
    })
  },
  bindViewTap2: function () {
    wx.navigateTo({
      url: '../myHero/myHero',
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
    //个人信息
    wx.request({
      url: app.globalData.http + 'person',
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        that.setData({ //此时OK
          'person': res.data
        })
        // 隐藏加载框
        wx.hideLoading();
      },
      fail: function (res) {
        console.log('错误' + ':' + res)
      }
    });
    //最近战绩
    wx.request({
      url: app.globalData.http + 'myResult',
      method: 'GET',
      success: function (res) {
        var temp=[];
        for(var i = 0;i<3;i++){
          temp = temp.concat(res.data.myResult[i]);
        }
        that.setData({
          'result': temp
        })
        console.log(that.data.result)
      },
      fail: function (res) {
        console.log('错误' + ':' + res)
      }
    });
    //我的英雄
    wx.request({
      url: app.globalData.http + 'myPersonHero',
      method: 'GET',
      success: function (res) {
        console.log(res.data.myHero)
        that.setData({
          'personHero': res.data.myHero
        })
        
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
