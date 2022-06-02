// pages/home/index.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannersList:[],//轮播图
    recommendList:[],//推荐歌曲数据
    topList:[],//热歌榜数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //获取轮播图数据
    this.getBanners();
    //获取推荐歌单
    this.getRecommendList();
    //获取排行榜
    this.getTopListData();
  },
  //跳转每日推荐页
  toRecommendPage(){
    wx.navigateTo({
      url: '/songPackage/pages/recommendSong/recommendSong',
    })
  },
  toOtherPage(){
    wx.navigateTo({
      url: '/otherPackage/pages/other/other',
    })
  },
  getTopListData(){
    let index=0;
    let resultArr=[];
    while (index<5) {
      request('/top/list',{idx:index++}).then(res=>{
        if(res.code===200){         
          resultArr.push({
            name:res.playlist.name,
            //splice 改变原数组，slice不会改变元素组
            tracks:(res.playlist.tracks||[]).slice(0,3)
          })
          this.setData({topList:resultArr})
        }
      })
    }
  },
  getRecommendList(){
    request('/personalized',{limit:10}).then(res=>{
      if(res.code===200){
        this.setData({recommendList:res.result})
      }
    })
  },
getBanners(){
  request('/banner',{type:2}).then(res=>{
    if(res.code===200){
      this.setData({
        bannersList:res.banners||[]
      })
    }
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