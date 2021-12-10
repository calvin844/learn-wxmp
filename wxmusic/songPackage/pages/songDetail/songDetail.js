// pages/songDetail/songDetail.js
import PubSub from 'pubsub-js'
import moment from 'moment'
import request from '../../../utils/request'
// 获取全局实例
const appInstance = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentWidth: 0, // 实时进度条宽度
        currentTime: '00:00', // 实时时间
        durationTime: '00:00', // 总时长
        isPlay: false, // 音乐是否播放
        song: {}, //歌曲详情
        musicId: 0, //歌曲ID
        musicLink: '' // 歌曲链接
    },
    // 点击播放/暂停回调
    handleMusicPlay() {
        let isPlay = !this.data.isPlay
        // this.setData({
        //     isPlay: !this.data.isPlay
        // })
        let {
            musicId,
            musicLink
        } = this.data
        this.musicControl(isPlay, musicId, musicLink)
    },
    // 控制音乐播放/暂停的功能函数
    async musicControl(isPlay, musicId, musicLink) {
        if (isPlay) {
            if (!musicLink) {
                let musicLinkData = await request('/song/url', {
                    id: musicId
                })
                musicLink = musicLinkData.data[0].url
                this.setData({
                    musicLink
                })
            }
            this.backgroundAudioManager.src = musicLink
            this.backgroundAudioManager.title = this.data.song.name
        } else {
            this.backgroundAudioManager.pause()
        }
    },
    // 获取音乐详情的功能函数
    async getMusicInfo() {
        let songData = await request('/song/detail', {
            ids: this.data.musicId
        })
        let durationTime = moment(songData.songs[0].dt).format('mm:ss')
        this.setData({
            durationTime,
            song: songData.songs[0]
        })
        wx.setNavigationBarTitle({
            title: this.data.song.name,
        })
    },
    // 修改播放状态的功能函数
    changePlayState(isPlay) {
        // 修改全局播放标识
        appInstance.globalData.isMusicPlay = isPlay
        this.setData({
            isPlay
        })
    },
    // 处理切换歌曲的回调
    handleSwitch(event) {
        // 获取切歌的类型
        let type = event.currentTarget.id
        // 关闭当前音乐播放
        this.backgroundAudioManager.stop()
        // 订阅来自recommendSong页面发布的musicId
        PubSub.subscribe('musicId', (msg, musicId) => {
            this.setData({
                musicId
            })
            // 获取音乐详情信息
            this.getMusicInfo()
            // 自动播放音乐
            this.musicControl(true, musicId)
            // 取消相应的订阅事件，避免重复订阅
            PubSub.unsubscribe('musicId')
        })
        // 发布消息数据给recommendSong
        PubSub.publish('switchType', type)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // options 用于接收路由传参的query参数
        // 原生小程序中路由传参，对参数的长度有限制，如果参数过长会自动截取
        this.setData({
            musicId: options.musicId
        })
        this.getMusicInfo()
        // 判断当前音乐是否在播放
        appInstance.globalData.isMusicPlay &&
            appInstance.globalData.musicId === this.data.musicId && this.setData({
                isPlay: true
            })
        // 创建控制音乐播放的实例
        this.backgroundAudioManager = wx.getBackgroundAudioManager()
        // 监听系统控制音乐播放
        this.backgroundAudioManager.onPlay(() => {
            this.changePlayState(true)
            // 修改全局播放音乐ID
            appInstance.globalData.musicId = this.data.musicId
        })
        // 监听系统控制音乐暂停
        this.backgroundAudioManager.onPause(() => {
            this.changePlayState(false)
        })
        // 监听系统控制音乐停止
        this.backgroundAudioManager.onStop(() => {
            this.changePlayState(false)
        })
        // 监听系统控制音乐结束
        this.backgroundAudioManager.onEnd(() => {
            // 自动切换至下一首音乐，并自动播放
            PubSub.publish('switchType', 'next')
            // 将实时进度条的长度还原成0
            this.setData({
                currentTime: '00:00',
                currentWidth: 0
            })
        })
        // 监听音乐实时播放进度
        this.backgroundAudioManager.onTimeUpdate(() => {
            // this.backgroundAudioManager.currentTime获取单位是秒，需要*1000转为毫秒
            let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss')
            let currentWidth = this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration * 410
            this.setData({
                currentTime,
                currentWidth
            })
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