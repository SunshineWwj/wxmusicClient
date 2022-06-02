/**
  作者: Created by wwj
  说明: 登录流程
  1. 收集表单项数据
  2. 前端验证
    1) 验证用户信息(账号，密码)是否合法
    2) 前端验证不通过就提示用户，不需要发请求给后端
    3) 前端验证通过了，发请求(携带账号, 密码)给服务器端
  3. 后端验证
    1) 验证用户是否存在
    2) 用户不存在直接返回，告诉前端用户不存在
    3) 用户存在需要验证密码是否正确
    4) 密码不正确返回给前端提示密码不正确
    5) 密码正确返回给前端数据，提示用户登录成功(会携带用户的相关信息)
*/
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
     phone:'15711140593',
     password:'123456yzy'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  handleInput(event) {
    // const name = event.currentTarget.id;//通过id传参
    const name = event.currentTarget.dataset.type; //通过data-type=xxx传参
    this.setData({
      [name]: event.detail.value
    })
  },
  // 登录回调
  login(){
    // 1. 收集表单项数据
    let {phone, password} = this.data;
    // 
  /**
    * 2. 前端验证
    *   手机号验证：
    *   1. 内容为空
    *   2. 手机号格式不正确
    *   3. 手机号格式正确，验证通过
   */
   if(!phone || !password){
     return wx.showToast({
       title: '手机号 或 密码 不能为空',
       icon:'none'
     })
   }
   //正则表达式校验手机号格式
   let phoneReg=/^1(3|4|5|6|7|8|9)\d{9}$/;
   if(!phoneReg.test(phone)){
     return wx.showToast({
       title: '请输入正确的手机号',
       icon:'none'
     })
   }
   //后端验证

   request('/login/cellphone',{phone,password,isLogin:true}).then(res=>{
      if(res.code===200){
        wx.showToast({
          title: '登录成功',
          icon:'none'
        })
        //先将用户信息存储在本地
        wx.setStorageSync('userInfo',JSON.stringify(res.profile))
         // 跳转至个人中心personal页面
      wx.reLaunch({
        url: '/pages/personal/index'
      })
      }else if(res.code===400){
        wx.showToast({
          title: '手机号错误',
          icon:'none'
        })
      }else if(res.code===502){
        wx.showToast({
          title: '密码错误',
          icon:'none'
        })
      }else{
        wx.showToast({
          title: res.message,
          icon:'none'
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