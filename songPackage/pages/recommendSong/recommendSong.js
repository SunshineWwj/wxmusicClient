import PubSub from 'pubsub-js'
import request from '../../../utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '', //天
    month: '', //月
    recommendList:[],//每日推荐列表数据
    index:0,//当前音乐下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //判断用户是否登录
    const userInfo=wx.getStorageSync('userInfo');
    if(!userInfo){
      wx.showToast({
        title: '请先登录',
        icon:'none',
        success:()=>{
          wx.reLaunch({
            url: '/pages/login/index',
          })
        }
      })
    }
    this.getRecommendList()

    const day = new Date().getDate();
    const month = new Date().getMonth() + 1;
    this.setData({
      day:day<10?`0${day}`:day,
      month:month<10?`0${month}`:month
    })
  // 订阅来自songDetail页面发布的消息
  PubSub.subscribe('switchType',(msg,type)=>{
    console.log(msg,type);
    let {recommendList,index}=this.data;
    if(type==='pre'){//上一首
      index-=1;
    }else{//下一首
      index+=1;
    }
    this.setData({index});//更新下标
    let musicId=recommendList[index].id;
    // 将musicId回传给songDetail页面
    PubSub.publish('musicId',musicId);
  })

  },
  //获取用户每日推荐数据
  getRecommendList(){
    request('/recommend/songs').then(res=>{
      if(res.code===200){
        this.setData({recommendList:res.recommend||[]})
      }
    })
  },
  // 跳转至songDetail页面
  toSongDetail(event){
    wx.navigateTo({
      url: `/songPackage/pages/songDetail/songDetail?musicId=${event.currentTarget.dataset.id}`,
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