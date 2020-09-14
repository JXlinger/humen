//index.js
//获取应用实例
const app = getApp()
const Apis = app.Apis
Page({
	data: {
		writeText: null
	},
	onLoad: function() {
		qq.request({
			url: 'https://api.apiopen.top/getJoke?page=1&count=20&type=video',
			success: res => {
				console.log(res);
			}
		})
		wx.showShareMenu({
		  withShareTicket: true,
		  menus: ['shareAppMessage', 'shareTimeline']
		})
		this.arandomWrite()
	},
	changeTextHandle() {
		this.arandomWrite()
	},
	async arandomWrite() {
		try{
			this.setData({
				writeText: await Apis.indexCont[Math.round(Math.random() * (Apis.indexCont.length- 1))]
			}) 
		}catch(e){
			//TODO handle the exception
			wx.showToast({
				title: '数据出错',
				icon: 'none'
			})
		}
		
	},
	toCreatCanvas(e) {
		let times = Math.floor(1000 + Math.random() * 2000)
		if(e.detail.errMsg === "getUserInfo:fail auth deny") {
			wx.showToast({
				title: '完成授权即可使用完整功能',
				icon: 'none',
				mask: true,
				duration: 2000
			})
			return
		}
		
		if(!wx.getStorageSync('userInfo')) {
			wx.setStorageSync('userInfo', e.detail.userInfo)
		}
		
		wx.showToast({
			title: '努力生成中...',
			icon: 'loading',
			mask: true,
			duration: times
		})
		setTimeout(() => {
			wx.navigateTo({
				url: '../creat/creat'
			})
		}, times)
	},
	onShareAppMessage(){
		return {
			title: `${wx.getStorageSync('userInfo') ? wx.getStorageSync('userInfo').nickName : '微信小程序'}-我在人间凑数的日子`,
			path: '/pages/index/index'
		}
	}
})
