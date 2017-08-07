// login.js
const util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  formSubmit: function (e) {
    this.login();
  },

  bindUsernameInput: function (e) {
    this.setData({
      username: e.detail.value
    })
  },

  bindPasswordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  login() {

    if (this.data.username.length <=0) {
      util.showToast('请输入用户名')
      return false;
    }

    if (this.data.password.length <= 0) {
      util.showToast('请输入密码')
      return false;
    }

    util.request(util.apiUrl + 'ecapi.auth.signin', 'POST', {
      username: this.data.username,
      password: this.data.password
    }).then((res) => {
      this.setData({
        token: res.token,
        user: res.user
      });

      wx.setStorageSync('token', res.token);
      wx.setStorageSync('user', res.user);

      //跳转到一个页面
      wx.navigateBack({
        
      })

    }).catch(err => {
      util.showToast('登录失败')
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})