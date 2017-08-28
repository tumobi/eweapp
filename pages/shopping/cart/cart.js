// cart.js
const util = require('../../../utils/util.js');

Page({
  data: {
    requestLoading: true,
    cartGoods: [],
    cartTotal: {
      "checkedGoodsCount": 0,
      "checkedGoodsAmount": 0.00
    },
    checkedAllStatus: true,
    editCartList: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.getCartList();
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  onDeleteGoods(event) {
    let itemIndex = event.target.dataset.itemIndex;
    //ecapi.cart.delete
    let goods = this.data.cartGoods[itemIndex];
    console.log(goods)

    let that = this;
    wx.showModal({
      title: '提示',
      content: '是否要删除选择中商品？',
      success: function (res) {
        if (res.confirm) {
          util.request(util.apiUrl + 'ecapi.cart.delete', 'POST', {
            good: goods.id
          }).then((res) => {
            console.log(res)
            util.showToast('商品已删除', 'success');
            that.getCartList();
          })
        }
      }
    })

  },
  getCartList: function () {
    util.request(util.apiUrl + 'ecapi.cart.get', 'POST').then((res) => {
      if (res.error_code === 0) {
        let cartGoodsInfo = res.goods_groups[0];
        let goodsList = cartGoodsInfo.goods.map(item => {
          item.checked = true;
          return item;
        });
        this.setData({
          cartGoods: goodsList,
          cartTotal: {
            checkedGoodsCount: cartGoodsInfo.total_amount,
            checkedGoodsAmount: cartGoodsInfo.total_price,
          }
        });
      }

      this.setData({
        checkedAllStatus: this.isCheckedAll(),
        requestLoading: false
      });


    });
  },
  isCheckedAll: function () {
    //判断购物车商品已全选
    return this.data.cartGoods.every(function (element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });
  },
  getCheckedGoodsCount: function () {
    let checkedGoodsCount = 0;
    this.data.cartGoods.forEach(function (v) {
      if (v.checked === true) {
        checkedGoodsCount += v.amount;
      }
    });
    console.log(checkedGoodsCount);
    return checkedGoodsCount;
  },
  getCheckedGoodsAmount: function () {
    let checkedGoodsCount = 0;
    this.data.cartGoods.forEach(function (v) {
      if (v.checked === true) {
        checkedGoodsCount += v.price * v.amount;
      }
    });
    console.log(checkedGoodsCount);
    return checkedGoodsCount;
  },
  checkedItem: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    let that = this;

    //编辑状态
    let tmpCartData = this.data.cartGoods.map(function (element, index, array) {
      if (index == itemIndex) {
        element.checked = !element.checked;
      }
      return element;
    });

    that.setData({
      cartGoods: tmpCartData,
      checkedAllStatus: that.isCheckedAll(),
      'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount(),
      'cartTotal.checkedGoodsAmount': that.getCheckedGoodsAmount()
    });
  },
  checkedAll: function () {
    let that = this;

    let isCheckedAll = that.isCheckedAll();

    let tmpCartData = this.data.cartGoods.map(function (element, index, array) {
      element.checked = !isCheckedAll;
      return element;
    });

    that.setData({
      cartGoods: tmpCartData,
      checkedAllStatus: !isCheckedAll,
      'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount(),
      'cartTotal.checkedGoodsAmount': that.getCheckedGoodsAmount()
    });

  },
  updateNumber(good, amount) {
    let that = this;
    util.request(util.apiUrl + 'ecapi.cart.update', 'POST', {
      amount: amount,
      good: good
    }).then((res) => {
      if (res.error_code === 0) {
        that.getCartList();
      }
    });
  },
  updateCart: function (productId, goodsId, amount, id) {
    let that = this;

    util.request(api.CartUpdate, {
      productId: productId,
      goodsId: goodsId,
      amount: amount,
      id: id
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
          //cartGoods: res.data.cartList,
          //cartTotal: res.data.cartTotal
        });
      }

      that.setData({
        checkedAllStatus: that.isCheckedAll()
      });
    });

  },
  cutNumber: function (event) {

    let itemIndex = event.target.dataset.itemIndex;
    let cartItem = this.data.cartGoods[itemIndex];
    let amount = (cartItem.amount - 1 > 1) ? cartItem.amount - 1 : 1;
    cartItem.amount = amount;
    this.setData({
      cartGoods: this.data.cartGoods
    });
    this.updateNumber(cartItem.id, amount);
  },
  addNumber: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    let cartItem = this.data.cartGoods[itemIndex];
    let amount = cartItem.amount + 1;
    cartItem.amount = amount;
    this.setData({
      cartGoods: this.data.cartGoods
    });
    this.updateNumber(cartItem.id, amount);
  },
  checkoutOrder: function () {
    //获取已选择的商品
    let that = this;

    var checkedGoods = this.data.cartGoods.filter(function (element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });

    if (checkedGoods.length <= 0) {
      return false;
    }


    wx.navigateTo({
      url: '../shopping/checkout/checkout'
    })
  },
})