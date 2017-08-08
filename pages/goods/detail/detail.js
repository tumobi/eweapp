var app = getApp();
var util = require('../../../utils/util.js');
var WxParse = require('../../../libs/wxParse/wxParse.js');

Page({
  data: {
    id: 0,
    goods: {},
    gallery: [],
    specificationList: [],
    productList: [],
    relatedGoods: [],
    cartGoodsCount: 0,
    userHasCollect: 0,
    number: 1,
  },
  getProductInfo: function () {
    let that = this;
    util.request(util.apiUrl + 'ecapi.product.get', 'POST', { product: that.data.id }).then(function (res) {
      if (res.error_code === 0) {

        let specificationList = [];
        if (res.product.properties) {
          specificationList = res.product.properties.map(v => {
            v.checked = false;
            return v;
          });
        }

        that.setData({
          goods: res.product,
          gallery: res.product.photos,
          specificationList: specificationList,
          productList: res.product.stock
        });
        WxParse.wxParse('goodsDetail', 'html', res.product.goods_desc, that);
        //that.getGoodsRelated();
      }
    });

  },
  getGoodsRelated: function () {
    let that = this;
    util.request(api.GoodsRelated, { id: that.data.id }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          relatedGoods: res.data.goodsList,
        });
      }
    });

  },
  clickSkuValue: function (event) {
    let that = this;
    let specNameId = event.currentTarget.dataset.nameId;
    let specValueId = event.currentTarget.dataset.valueId;

    //TODO 性能优化，可在wx:for中添加index，可以直接获取点击的属性名和属性值，不用循环
    let _specificationList = this.data.specificationList;
    for (let i = 0; i < _specificationList.length; i++) {
      if (_specificationList[i].id == specNameId) {
        for (let j = 0; j < _specificationList[i].attrs.length; j++) {
          if (_specificationList[i].attrs[j].id == specValueId) {
            //如果已经选中，则反选
            if (_specificationList[i].attrs[j].checked) {
              _specificationList[i].attrs[j].checked = false;
            } else {
              _specificationList[i].attrs[j].checked = true;
            }
          } else {
            _specificationList[i].attrs[j].checked = false;
          }
        }
      }
    }
    this.setData({
      'specificationList': _specificationList
    });
  },

  //获取选中的规格信息
  getCheckedSpecValue: function () {
    let checkedValues = [];
    let _specificationList = this.data.specificationList;
    for (let i = 0; i < _specificationList.length; i++) {
      let _checkedObj = {
        nameId: _specificationList[i].id,
        valueId: 0,
        valueText: ''
      };
      for (let j = 0; j < _specificationList[i].attrs.length; j++) {
        if (_specificationList[i].attrs[j].checked) {
          _checkedObj.valueId = _specificationList[i].attrs[j].id;
          _checkedObj.valueText = _specificationList[i].attrs[j].attr_name;
        }
      }
      checkedValues.push(_checkedObj);
    }

    return checkedValues;

  },

  //判断规格是否选择完整
  isCheckedAllSpec: function () {
    return !this.getCheckedSpecValue().some(function (v) {
      if (v.valueId == 0) {
        return true;
      }
    });
  },
  getCheckedSpecKey: function () {
    let checkedValue = this.getCheckedSpecValue().map(function (v) {
      return v.valueId;
    });

    return checkedValue.join('|');
  },
 
  getCheckedProductItem: function (key) {
    return this.data.productList.filter(function (v) {
      if (v.goods_attr == key) {
        return true;
      } else {
        return false;
      }
    });
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      // id: parseInt(options.id)
      id: 1
    });
    
    this.getProductInfo();
    this.getCartCount();
  },
  getCartCount(){
    var that = this;
    util.request(util.apiUrl + 'ecapi.cart.get', 'POST').then(function (res) {
      that.setData({
        cartGoodsCount: res.goods_groups[0].total_amount || 0
      });
    });
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  closeAttrOrCollect: function () {
    let that = this;
    if (this.data.openAttr) {
      this.setData({
        openAttr: false,
      });
      if (that.data.userHasCollect == 1) {
        that.setData({
          'collectBackImage': that.data.hasCollectImage
        });
      } else {
        that.setData({
          'collectBackImage': that.data.noCollectImage
        });
      }
    } else {
      //添加或是取消收藏
      util.request(api.CollectAddOrDelete, { typeId: 0, valueId: this.data.id }, "POST")
        .then(function (res) {
          let _res = res;
          if (_res.errno == 0) {
            if (_res.data.type == 'add') {
              that.setData({
                'collectBackImage': that.data.hasCollectImage
              });
            } else {
              that.setData({
                'collectBackImage': that.data.noCollectImage
              });
            }

          } else {
            wx.showToast({
              image: '/static/images/icon_error.png',
              title: _res.errmsg,
              mask: true
            });
          }

        });
    }

  },
  addToCart: function () {
    var that = this;

    //提示选择完整规格
    if (!this.isCheckedAllSpec()) {
      util.showToast('请选择规格', 'error');
      return false;
    }

    //根据选中的规格，判断是否有对应的sku信息
    let checkedProduct = this.getCheckedProductItem(this.getCheckedSpecKey());
    if (!checkedProduct || checkedProduct.length <= 0) {
      //找不到对应的product信息，提示没有库存
      util.showToast('规格不存在', 'error');
      return false;
    }

    //验证库存
    if (checkedProduct.stock_number < this.data.number) {
      //找不到对应的product信息，提示没有库存
      util.showToast('商品售完', 'error');
      return false;
    }
    let property = checkedProduct[0].goods_attr;
    property = '[' + property.replace("|", ",") + ']';
    //添加到购物车
    util.request(util.apiUrl + 'ecapi.cart.add', "POST", { amount: this.data.number, product: this.data.goods.id, property: property})
      .then(function (res) {
        util.showToast('加入购物车成功', 'success')
        this.getCartCount();
      }).catch(err => {
        util.showToast(err.error_desc, 'error')
      });
  },
  cutNumber: function () {
    this.setData({
      number: (this.data.number - 1 > 1) ? this.data.number - 1 : 1
    });
  },
  addNumber: function () {
    this.setData({
      number: this.data.number + 1
    });
  }
})