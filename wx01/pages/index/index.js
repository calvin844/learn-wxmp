// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: '初始化测试数据',
    userInfo: {} //用户的基本信息
  },

  handleParent() {
    console.log('handleParent')
  },
  handleChild() {
    console.log('handleChild')
  },
  toLogs() {
    wx.redirectTo({
      url: '/pages/logs/logs',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 修改msg的状态数据，语法：this.setData
    // setTimeout(() => {
    //   this.setData({
    //     msg: "修改之后的数据"
    //   })
    //   console.log(this.data.msg)
    // }, 1000)

    // 授权后获取用户信息
    let userInfo = wx.getStorageSync('userInfo');
    // console.log(userInfo != '')
    if (userInfo != '') {
      this.setData({
        userInfo: userInfo
      })
    } else {
      this.getUserProfile()
    }
  },

  getUserProfile(e) {
    wx.getUserProfile({
      desc: "用户信息",
      success: (res) => {
        wx.setStorageSync('userInfo', res.userInfo);
        this.setData({
          userInfo: res.userInfo
        })
      }
    })
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