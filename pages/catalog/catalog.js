// catalog.js
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword: '',
    categories: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCategories();
  },

  bindKeywordConfirm(event){
    this.setData({
      keyword: event.detail.value
    })

    this.bindSearchTap();
  },

  bindKeywordInput(event){
    this.setData({
      keyword: event.detail.value
    })
  },

  /**
   * 点击搜索
   */
  bindSearchTap(){
    wx.navigateTo({
      url: '/pages/goods/list/list?keyword='+ this.data.keyword,
    })
  },

  getCategories() {
    util.request(util.apiUrl + 'ecapi.category.list', 'POST', {
      page: 1,
      per_page: 100
    }).then((res) => {
      console.log(res.categories)
      this.setData({
        categories: res.categories
      })
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