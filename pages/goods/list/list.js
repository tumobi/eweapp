// list.js
const util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestLoading: true,
    category: 0,
    keyword: '',
    products: [],
    paged: {
      page: 1,
      size: 10
    },
    sort_key: 0,
    sort_value: 0,
  },

  /**
   * 排序事件
   */
  bindSorderTap(event) {
    let sort_key = event.currentTarget.id
    this.setData({
      'paged.page': 1,
      sort_key: sort_key
    });

    if (sort_key == 1) {
      this.setData({
        sort_value: this.data.sort_value == 1 ? 2 : 1
      })
    }

    this.getPorducts();
  },

  getPorducts(loadMore = false) {
    wx.showLoading({
      title: '加载中...',
    })
    util.request(util.api + 'ecapi.product.list', 'POST', {
      category: this.data.category,
      page: this.data.paged.page,
      keyword: this.data.keyword,
      per_page: this.data.paged.size,
      sort_key: this.data.sort_key,
      sort_value: this.data.sort_value
    }).then((res) => {

      let products = [];
      if (loadMore == true) {
        products = this.data.products;
      } else {
        //重置使用页面回到顶部
        this.setData({
          products: [],
        })
        products = [];
      }

      let newPorducts = products.concat(res.products);
      this.setData({
        products: newPorducts,
        paged: res.paged,
        requestLoading: false
      })
      wx.hideLoading();
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      category: options.category || '',
      keyword: options.keyword || ''
    })
    this.getPorducts();
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

    if (this.data.paged.more === 1) {
      this.setData({
        'paged.page': parseInt(this.data.paged.page) + 1
      })
      this.getPorducts(true);
    }


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})