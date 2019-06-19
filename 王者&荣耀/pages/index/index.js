//index.js
//获取应用实例
const app = getApp()
var wxCharts = require("../../utils/wxcharts.js");

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    level:"",
    firstCanvas:{},
    indexresult: {},
    friend:{},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    page: 1,
    pages:4,
    loading: false,
    display:"none"

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
    //战绩
    wx.request({
      url: app.globalData.http + 'indexresult',
      data: {},
      method: 'GET',
      success: function (res) {
        console.log(res.data.myResult)
        that.setData({ //此时OK
          'indexresult': res.data.myResult
        })
      },
      fail: function (res) {
        console.log('错误' + ':' + res)
      }
    })
    // 区域图
    wx.request({
      url: app.globalData.http+'firstCanvas',
      data: {},
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        that.setData({ //此时OK
          'firstCanvas': res.data,
        })
              new wxCharts({
                canvasId: 'firstCanvas',
                type: 'area',
                // categories: ['三天前', ' ', ' ', ' ', ' ', '06:16'],
                categories: that.data.firstCanvas.datetime,
                series: [{
                  name: '段位',
                  data: [that.data.firstCanvas.num[0].number0, that.data.firstCanvas.num[0].number1, that.data.firstCanvas.num[0].number2, that.data.firstCanvas.num[0].number3, that.data.firstCanvas.num[0].number4, that.data.firstCanvas.num[0].number5],
                  format: function (val) {
                      if (val<=5){
                        val = that.data.firstCanvas.level.three +val+'星';
                        
                      }else{
                        // val = Number(val);
                        val = val-5
                        val = that.data.firstCanvas.level.two + val + '星'
                      }
                    that.setData({ //此时OK
                      'level': val
                    })
                    return val;
                    
                  }
                }],
                yAxis: {
                  min:0,
                  max:10,
                  format: function (val) {
                    if(val==0){
                      val = that.data.firstCanvas.level.three
                    }else if(val == 5){
                      val = that.data.firstCanvas.level.two
                    }else{
                      val = that.data.firstCanvas.level.one
                    }
                    return val;
                  },
                  extra: {
                    column: {
                      width: 20
                    }
                  }
                },
                width: 385,
                height: 120
              });
      },
      fail: function (res) {
        console.log('错误' + ':' + res)
      }
    })
     //好友新鲜事
    // 页面初次加载，请求第一页数据
    that.setData({ 
      'loading': true
    })
    wx.request({
      url: app.globalData.http + 'friendThings',
      method: 'GET',
      success: function (res) {
        console.log(res.data.data)
        that.setData({ //此时OK
          'friend': res.data.data,
          'loading':false
        })
        console.log(that.data.friend.length);
      },
      fail: function (res) {
        console.log('错误' + ':' + res)
      }
    })
    // that.friendThings();直接用这个不行报错 oldData.concat is not a function;at api request success callback function
    that.setData({
      'display': "none",
      'page':1
    });
  },
  onPullDownRefresh() {
    var that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    setTimeout(() => {
      // 数据成功后，停止下拉刷新
      wx.stopPullDownRefresh();
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      this.onLoad();
    }, 1000);
    
  },
  friendThings() {
    var that = this;
    that.setData({ 
      'loading': true
    })
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    wx.request({
      url: app.globalData.http + 'friendThings',
      data: {},
      method: 'GET',
      header: {
        'content-type': 'application/text'
      },
      success: function (res) {
        console.log(res.data.data)
        // 回调函数
        var moment_list = that.data.friend;
        const oldData = that.data.friend;
        that.setData({
          'friend': oldData.concat(res.data.data),
          'loading': false
        })
        console.log(that.data.friend.length);
        // 隐藏加载框
        wx.hideLoading();
      },
      fail: function (res) {
        console.log('错误' + ':' + res)
      }
    })
  },
  onReachBottom() {
    var that = this
    // 下拉触底，先判断是否有请求正在进行中
    // 以及检查当前请求页数是不是小于数据总页数，如符合条件，则发送请求
    if (!this.loading && that.data.page < that.data.pages) {
      // 页数+1
      that.setData({
        'page': that.data.page + 1,
        'display': "none"
      })
      that.friendThings();
    }else{
      that.setData({
        'display': "block"
      });
    }
    
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
