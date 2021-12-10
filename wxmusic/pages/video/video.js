// pages/video/video.js
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        videoGroupList: [], // 导航标签数据
        navId: '', // 导航标识
        videoList: [], // 视频列表数据
        videoId: "", // 视频ID标识
        videoUpdateTime: [], //记录video播放的时长
        isTriggered: false, // 标识下拉刷新是否被触发
    },
    // 获取导航标签数据
    async getVideoGroupListData() {
        let videoGroupListData = await request('/video/group/list')
        this.setData({
            videoGroupList: videoGroupListData.data.slice(0, 14),
            navId: videoGroupListData.data[0].id
        })
        // 获取视频列表数据
        this.getVideoList(this.data.navId)
    },
    // 获取视频列表数据
    async getVideoList(navId) {
        let videoListData = await request('/video/group', {
            id: navId
        })
        // 关闭正在加载提示
        wx.hideLoading()
        let index = 0
        let videoList = videoListData.datas.map(item => {
            item.id = index++
            return item
        })
        this.setData({
            videoList,
            isTriggered: false
        })
    },
    // 点击切换导航的方法
    changeNav(event) {
        let navId = event.currentTarget.id // 通过id向event传参的时候如果传的是number会自动转为string
        // let navId = event.currentTarget.dataset.id // 通过data-的方式传参是不会转变类型
        this.setData({
            navId: navId >>> 0, //右移0位，把非number数据强制转换成number
            videoList: []
        })
        // 显示正在加载
        wx.showLoading({
            title: '正在加载',
        })
        //动态获取当前标签的视频列表数据
        this.getVideoList(navId)
    },
    // 点击播放/继续播放方法
    handlePlay(event) {
        let vid = event.currentTarget.id
        // 判断是否与上次点击是同一个视频，如果不是同一个视频，就停止上一个视频
        // this.vid !== vid && this.videoContext?.stop();
        // this.vid = vid
        this.setData({
            videoId: vid
        })
        // 创建控制video标签的实例对象
        this.videoContext = wx.createVideoContext(vid);
        let {
            videoUpdateTime
        } = this.data
        // 判断当前的视频之前是否有播放记录
        let videoItem = videoUpdateTime.find(item => item.vid == vid)
        if (videoItem) {
            this.videoContext.seek(videoItem.currentTime)
        }
        this.videoContext.play()

    },
    // 视频结束播放时回调
    handleEnd(event) {
        let vid = event.currentTarget.id
        let {
            videoUpdateTime
        } = this.data
        let videoItemIndex = videoUpdateTime.findIndex(item => item.vid == vid)
        videoUpdateTime.splice(videoItemIndex, 1)
        this.setData(
            videoUpdateTime
        )
    },
    // 监听视频播放的回调
    handleTimeUpdate(event) {
        let videoTimeObj = {
            vid: event.currentTarget.id,
            currentTime: event.detail.currentTime
        }
        let {
            videoUpdateTime
        } = this.data
        // 判断数组中是否有当前视频的播放记录
        let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid)
        if (videoItem) {
            videoItem.currentTime = videoTimeObj.currentTime
        } else {
            videoUpdateTime.push(videoTimeObj)
        }
        this.setData({
            videoUpdateTime
        })
    },
    // 下拉刷新回调 (scroll-view)
    handleRefresher() {
        this.getVideoList(this.data.navId)
    },
    // 上拉加载回调 (scroll-view)
    handleTolower() {
        // 网易云音乐接口暂时不支持
    },
    // 跳转至搜索页面
    toSearch() {
        wx.navigateTo({
          url: '/pages/search/search',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 获取导航标签数据
        this.getVideoGroupListData()
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
    onShareAppMessage: function ({
        from
    }) {
        // console.log(from) // 显示触发分享方式button或者menu
        let title = ''
        if (from === 'button') {
            title = '来自点击按钮的转发'
        } else if (from === 'menu') {
            title = '来自右上角菜单的转发'
        }
        return {
            title,
            page: '/pages/video/video',
            imageUrl: '/static/images/nvsheng.jpg'
        }
    }
})