// pages/personal/personal.js
import request from '../../utils/request'
let startY = 0; //手指起始的坐标
let moveY = 0; //手指移动的坐标
let moveDistance = 0; //手指移动的距离
Page({

    /**
     * 页面的初始数据
     */
    data: {
        coverTransform: 'translateY(0)',
        coverTransition: '',
        userInfo: {}, //用户信息
        recentPlayList: [], //用户播放记录
    },


    handleTouchStart(event) {
        // 获取手指起始坐标
        startY = event.touches[0].clientY;
        this.setData({
            coverTransition: ''
        })
    },
    handleTouchMove(event) {
        // 获取手指起始坐标
        moveY = event.touches[0].clientY;
        moveDistance = moveY - startY;
        if (moveDistance <= 0) {
            return
        } else if (moveDistance >= 80) {
            moveDistance = 80
        }
        // 动态更新coverTransform
        this.setData({
            coverTransform: `translateY(${moveDistance}rpx)`
        })
    },
    handleTouchEnd() {
        this.setData({
            coverTransform: `translateY(0)`,
            coverTransition: 'transform 1s linear'
        })
    },
    // 跳转至登录login页面的回调
    toLogin() {
        wx.navigateTo({
            url: '/pages/login/login',
        })
    },
    // 获取用户播放记录方法
    async getUserRecentPlayList(uid) {
        let recentPlayListData = await request('/user/record', {
            uid,
            type: 0
        })
        let index = 0
        // 后端返回没有唯一值，这里手动添加id作为唯一值
        let recentPlayList = recentPlayListData.allData.splice(0, 10).map(item => {
            item.id = index++
            return item
        })
        this.setData({
            recentPlayList
        })
        // console.log(recentPlayListData)
    },

    /**
     * 生命周期函数--监听页面加载
     * 这里只执行一次
     */
    onLoad: function () {
        // 用户登录后获取用户数据
        if (wx.getStorageSync('userInfo')) {
            // 读取用户的基本信息
            let userInfo = JSON.parse(wx.getStorageSync('userInfo'))
            if (userInfo) {
                // 更新userInfo的状态
                this.setData({
                    userInfo
                })
                // 获取用户播放记录
                this.getUserRecentPlayList(userInfo.userId)
            }
        }
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