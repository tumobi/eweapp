//index.js
const util = require('../../utils/util.js');

//获取应用实例
var app = getApp()
Page({
  data: {
    banners: [],
    notices: [],
    goodProducts: [],
    hotProducts: [],
    recentlyProducts: [],
  },

  onLoad: function () {
    wx.showLoading({
      title: '',
    });
    this.getBanner();
    this.getNotices();
    this.getPorducts();
  },
  getBanner() {
    util.request(util.apiUrl + 'ecapi.banner.list', 'POST').then((res) => {
      this.setData({
        banners: res.banners
      })
    });
  },
  getNotices() {
    util.request(util.apiUrl + 'ecapi.notice.list', 'POST', {
      page: 1,
      per_page: 5
    }).then((res) => {
      this.setData({
        notices: res.notices
      });
    });
  },
  getPorducts() {
    util.request(util.apiUrl + 'ecapi.home.product.list', 'POST').then((res) => {
      this.setData({
        goodProducts: res.good_products,
        hotProducts: res.hot_products,
        recentlyProducts: res.recently_products
      });
      wx.hideLoading();
    }).catch(err => {
      wx.hideLoading();
    });
  }
})
