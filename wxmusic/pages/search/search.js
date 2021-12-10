// pages/search/search.js
import request from '../../utils/request'
let timer
Page({

    /**
     * 页面的初始数据
     */
    data: {
        placeholderContent: '', //placeholder的内容
        hotList: [], // 热搜榜数据
        searchContent: '', // 用户输入表单项数据
        searchList: [], // 搜索结果列表
        historyList: [], // 搜索历史
    },
    // 获取初始化数据
    async getInitData() {
        let placeholderData = await request('/search/default')
        let hotListData = await request('/search/hot/detail')
        this.setData({
            placeholderContent: placeholderData.data.showKeyword,
            hotList: hotListData.data
        })
    },
    // 表单项内容发生改变回调
    handleInputChange(event) {
        if (timer) clearTimeout(timer)
        // 防抖
        timer = setTimeout(async () => {
            let {
                searchContent,
                historyList
            } = this.data
            let searchListData
            searchContent = event.detail.value.trim()
            this.setData({
                searchList: []
            })
            if (searchContent) {
                searchListData = await request('/search', {
                    keywords: searchContent,
                    limit: 10
                })
                // 将搜索的关键字添加到搜索历史
                let historyIndex = historyList.indexOf(searchContent)
                if (historyIndex > -1) {
                    historyList.splice(historyIndex, 1)
                }
                historyList.unshift(searchContent)
                wx.setStorageSync('searchHistory', historyList)
                // 更新data数据
                this.setData({
                    searchContent,
                    searchList: searchListData.result.songs,
                    historyList
                })

            }
        }, 500)
    },
    // 清空搜索关键字
    clearSearchHistory() {
        this.setData({
            searchContent: '',
            searchList: []
        })
    },

    // 获取本地历史记录的功能回调
    getSearchHistory() {
        let historyList = wx.getStorageSync('searchHistory')
        // 更新data数据
        this.setData({
            historyList: historyList || [],
        })
    },
    // 删除搜索历史记录
    deleteSearchHistory() {
        wx.showModal({
            content: '确认清空吗？',
            success: (res) => {
                if (res.confirm) {
                    // 清空data中数据
                    this.setData({
                        historyList: []
                    })
                    // 移除本地缓存
                    wx.removeStorageSync('searchHistory')
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 获取初始化数据
        this.getInitData()
        // 获取历史记录
        this.getSearchHistory()
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