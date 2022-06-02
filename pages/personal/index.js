let startY = 0;
let moveY = 0;
let moveDistance = 0;
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: 'translateY(0)',
    userInfo:{},//当前用户信息
    recentPlayList:[],//最近播放
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //拿到当前登录用户信息
    let userInfo = wx.getStorageSync('userInfo');
    if(userInfo){
      this.setData({
        userInfo:JSON.parse(userInfo)
      })
      this.getRecentPlayList(this.data.userInfo.userId)
    }
  },
  getRecentPlayList(userId){
    request('/user/record',{uid:userId,type:1}).then(res=>{
      if(res.code===200){
        let index=0;
        this.setData({
          recentPlayList:(res.weekData||[]).map(item=>({
            ...item,
            id:index++
          }))
        })
      }
    })
  },
  toLogin() {
    wx.navigateTo({
      url: '/pages/login/index',
    })
  },
  handleTouchStart(event) {
    this.setData({
      coveTransition: ''
    })
    //获取手指的起始坐标
    startY = event.touches[0].clientY;
  },
  handleTouchMove(event) {
    moveY = event.touches[0].clientY;
    moveDistance = moveY - startY;
    if (moveDistance <= 0) return;
    if (moveDistance >= 80) moveDistance = 80;
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`
    })
  },
  handleTouchEnd() {
    this.setData({
      coverTransform: `translateY(0rpx)`,
      coveTransition: 'transform 1s linear'
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})