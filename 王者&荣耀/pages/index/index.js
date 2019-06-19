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
    indexresult: {'hero':'wu.jpg'},
    friend:{},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    page: 1,
    pages: 0,
    articles: []

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
    this.fetchArticleList(1)
   
    wx.request({
      url: app.globalData.http +'friendThings',
      data:{},
      method:'GET',
      success:function(res){
        console.log(res.data.data)
        that.setData({ //此时OK
          'friend': res.data.data
        })
        console.log(that.data.friend.length);
      },
      fail: function (res) {
        console.log('错误' + ':' + res)
      }
    })
  },
  onReachBottom() {
    // 下拉触底，先判断是否有请求正在进行中
    // 以及检查当前请求页数是不是小于数据总页数，如符合条件，则发送请求
    if (!this.loading && this.data.page < this.data.pages) {
      this.fetchArticleList(this.data.page + 1)
    }
  },
  fetchArticleList(pageNo) {
    this.loading = true
    // 向后端请求指定页码的数据
    return getArticles(pageNo).then(res => {
      const articles = res.items
      this.setData({
        page: pageNo,     //当前的页号
        pages: res.pages,  //总页数
        articles: this.data.articles.concat(articles)
      })
    }).catch(err => {
      console.log("==> [ERROR]", err)
    }).then(() => {
      this.loading = false
    })
  },
  onShow:function(){
    
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
