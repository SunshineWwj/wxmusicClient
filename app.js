// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {//页面被销毁 这里面的数据不会销毁 只有小程序被退出才会销毁
    userInfo: null,
    isMusicPlay:false,//音乐播放状态
    musicId:'',//音乐id
  }
})
