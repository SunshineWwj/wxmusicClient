// pages/search/search.js
import request from '../../utils/request';
let isSend = false; //节流用
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '', //placeholder内容
    hotList: [], //热搜榜列表
    searchContent: '', //搜索框文本
    searchList: [], //搜索列表
    historyList: [], //搜索历史记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //获取初始化数据
    this.getInitData();
    //获取历史记录
    this.getSearchHistory();
  },
  // 获取本地历史记录的功能函数
  getSearchHistory() {
    let historyList = wx.getStorageSync('searchHistory');
    if (historyList) {
      this.setData({
        historyList
      })
    }
  },
  // 删除搜索历史记录
  deleteSearchHistory() {
    wx.showModal({
      content: '确认删除吗?',
      success: (res) => {
        if (res.confirm) {
          // 清空data中historyList
          this.setData({
            historyList: []
          })
          // 移除本地的历史记录缓存
          wx.removeStorageSync('searchHistory');
        }
      }
    })
  },
  async getInitData() {
    const placeholderData = await request('/search/default');
    const hotListData = await request('/search/hot/detail');
    this.setData({
      placeholderContent: placeholderData.data.showKeyword,
      hotList: hotListData.data || []
    })
  },
  // 清空搜索内容
  clearSearchContent() {
    this.setData({
      searchContent: '',
      searchList: []
    })
  },

  //搜索框输入内容改变
  handleInputChange(event) {
    console.log(event)
    const searchContent = event.detail.value.trim();
    if (!searchContent) {
      this.setData({
        searchList: []
      });
      return;
    };
    this.setData({
      searchContent
    });
    if (isSend) {
      return
    };
    isSend = true;
    this.getSearchListData();
    // 函数节流
    setTimeout(() => {
      isSend = false;
    }, 300)
  },
  //获取搜索列表
  async getSearchListData() {
    let {
      searchContent,
      historyList
    } = this.data;
    const searchListData = await request('/search', {
      keywords: searchContent,
      limit: 10
    });
    this.setData({
      searchList: searchListData.result.songs
    });

    // 将搜索的关键字添加到搜索历史记录中
    if (historyList.indexOf(searchContent) !== -1) { //搜索记录已存在，删除之前的并把当前的前天到数组头部
      historyList.splice(historyList.indexOf(searchContent), 1)
    }
    historyList.unshift(searchContent); //否则直接添加到数组头部
    this.setData({
      historyList
    })
    //放入浏览器中记录 以免刷新丢失
    wx.setStorageSync('searchHistory', historyList)
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