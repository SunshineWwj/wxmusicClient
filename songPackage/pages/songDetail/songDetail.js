import PubSub from 'pubsub-js';
import moment from 'moment';
import request from '../../../utils/request';
// 获取全局实例
const appInstance = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, //是否播放
    song: {}, //歌曲详情数据
    musicLink: '', //音乐连接
    currentTime: '00:00', //实时时间
    durationTime: '00:00', //总时长
    currentWidth: 0, //实时进度条宽度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // options: 用于接收路由跳转的query参数
    // 原生小程序中路由传参，对参数的长度有限制，如果参数长度过长会自动截取掉
    // console.log(JSON.parse(options.songPackage)); 报错
    //获取歌曲详情
    this.getSongDetail(options.musicId);

    //判断当前页面是否有音乐在播放
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === options.musicId) {
      //修改当前页面音乐状态为播放
      this.changePlayState(true)
    }
    /*
     * 问题： 如果用户操作系统的控制音乐播放/暂停的按钮，页面不知道，导致页面显示是否播放的状态和真实的音乐播放状态不一致
     * 解决方案：
     *   1. 通过控制音频的实例 backgroundAudioManager 去监视音乐播放/暂停
     * */
    // 创建控制音乐播放的实例
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    // 监视音乐播放/暂停/停止
    this.backgroundAudioManager.onPlay(() => {
      this.changePlayState(true);
      // 修改全局音乐musicId播放的状态
      appInstance.globalData.musicId = options.musicId;
    });
    this.backgroundAudioManager.onPause(() => {
      this.changePlayState(false);
    });
    this.backgroundAudioManager.onStop(() => {
      this.changePlayState(false);
    });
    //监听音乐播放自然停止
    this.backgroundAudioManager.onEnded(() => {
      //自动切换至下一首 并且自动播放
      PubSub.publish('switchType','next');
      //并将进度条还原0开始
      this.setData({currentWidth:0,currentTime:'00:00'})
    });

    //监听音乐实时播放进度
    this.backgroundAudioManager.onTimeUpdate(() => {
      // console.log('总时长：',this.backgroundAudioManager.duration);
      // console.log('实时时间：',this.backgroundAudioManager.currentTime);
      const currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss');
      const currentWidth = this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration * 450;
      this.setData({
        currentTime,
        currentWidth
      });
    })
  },
  //上一首/下一首
  handleSwitch(event) {
    const type = event.currentTarget.id;
    //关闭当前播放的音乐
    this.backgroundAudioManager.stop();
    //发布消息数据给recommendSong页面
    PubSub.publish('switchType', type);

    //订阅接受recommendSong页面传来的musicId
    PubSub.subscribe('musicId', (msg, musicId) => {
      console.log(musicId);
      //获取音乐详情
      this.getSongDetail(musicId);
      //自动播放当前音乐
      this.musicControl(true, musicId)
      // 取消订阅
      PubSub.unsubscribe('musicId');
    })
  },
  // 修改播放状态的功能函数
  changePlayState(isPlay) {
    this.setData({
      isPlay
    });
    //修改全局音乐状态
    appInstance.globalData.isMusicPlay = isPlay
  },
  getSongDetail(musicId) {
    request('/song/detail', {
      ids: musicId
    }).then(res => {
      if (res.code === 200) {
        const durationTime = moment(res.songs[0].dt).format('mm:ss')
        this.setData({
          song: res.songs[0],
          durationTime
        });
        //动态修改当前页标题名
        wx.setNavigationBarTitle({
          title: this.data.song.name
        })
      }
    })
  },
  //点击播放/暂停的回调
  handleMusicPlay() {
    // this.setData({isPlay:!this.data.isPlay})
    this.musicControl(!this.data.isPlay, this.data.song.id, this.data.musicLink);
  },
  //控制音乐播放/暂停的功能函数
  async musicControl(isPlay, musicId, musicLink) {
    //创建控制音乐播放的实例
    if (isPlay) { //开始播放
      if (!musicLink) {
        //获取音乐的播放连接
        const musicLinkData = await request('/song/url', {
          id: musicId
        })
        if (musicLinkData && musicLinkData.code === 200) {
          musicLink = musicLinkData.data[0].url;
          this.setData({
            musicLink
          })
        }
      }
      this.backgroundAudioManager.src = musicLink;
      this.backgroundAudioManager.title = this.data.song.name
    } else { //暂停播放
      this.backgroundAudioManager.pause();
    }
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