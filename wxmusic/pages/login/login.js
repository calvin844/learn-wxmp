// pages/login/login.js
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone: "",
        password: ""
    },
    // 表单项内容发生改变的回调
    handleInput(event) {
        let type = event.currentTarget.id;
        let value = event.detail.value;
        this.setData({
            [type]: value
        })
    },
    // 登录的回调
    async login() {
        // 1. 获取收集到的表单项数据
        let {
            phone,
            password
        } = this.data;
        // 2. 前端数据验证
        if (!phone) {
            wx.showToast({
                title: '手机号不能为空',
                icon: "none"
            })
            return;
        }
        if (!password) {
            wx.showToast({
                title: '密码不能为空',
                icon: "none"
            })
            return;
        }
        let phoneReg = /^1[3-9]\d{9}$/;
        if (!phoneReg.test(phone)) {
            wx.showToast({
                title: '手机号格式错误',
                icon: "none"
            })
            return;
        }
        // 后端验证
        // phone=15711140593&password=123456yzy
        let result = await request('/login/cellphone', {
            phone,
            password
        })
        let title = "";
        let icon = "";
        if (result.code === 200) {
            title = '登录成功'
        } else if (result.code === 400) {
            title = '手机号错误'
            icon = 'none'
        } else if (result.code === 502) {
            title = '密码错误'
            icon = 'none'
        } else {
            title = '登录失败'
            icon = 'none'
        }
        wx.showToast({
            title,
            icon
        })

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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