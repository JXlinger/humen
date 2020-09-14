// pages/creat.js
const ctx = wx.createCanvasContext('drawCanvas')
const Apis = getApp().Apis
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		systemInfo: null,
		btnLoading: false,
		mask: true,
		maskLeft: 'translateX(100%)',
		inputValue: null,
		drawFinished: false,
		canvasImagePath: null
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		})
		wx.getSystemInfo({
			success: res => {
				this.setData({
					systemInfo: res,
					maskLeft: `translateX(${res.windowWidth + 20}px)`
				})
			}

		})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {
		this.draw(Apis.indexCont)
	},
	previewImage(path) {
		let arr = []
		if(path) arr.push(path)
		wx.previewImage({
			urls: arr,
			success: res => {
				wx.showToast({
					title: '长按保存收藏或分享给朋友',
					icon: 'none'
				})
			}
		})
	},
	async saveImgToFile() {
		const self = this
		if (!this.data.drawFinished) {
			wx.showToast({
				title: '图片生成中，请稍后再试',
				icon: 'none',
				mask: true
			})
			return
		}
		wx.canvasToTempFilePath({
			canvasId: 'drawCanvas',
			success(res) {
				self.setData({
					canvasImagePath: res.tempFilePath
				})
				wx.saveImageToPhotosAlbum({
					filePath: res.tempFilePath,
				    success(info) {
					  if(info.errMsg === "saveImageToPhotosAlbum:ok") {
						  wx.showModal({
							  title: '图片保存',
							  content: '图片保存成功，是否预览？',
							  confirmText: '预览',
							  success: log => {
								  if(log.cancel) return
								  self.previewImage(res.tempFilePath)
							  }
							  
						  })
					  }
					  
				    },
					fail: err =>{
						if(err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
							wx.showToast({
								title: '请在设置中授权相册功能',
								icon: 'none',
								mask: true
							})
						}
					}
				})
			}
		})
	},
	async draw(content) {
		this.drawBackground()
		this.drawTextTypeOne(content)
		this.drawUserName()
		ctx.draw()
		this.setData({
			drawFinished: true
		})
	},
	changeTextHandle() {
		const self = this
		let times = Math.floor(1000 + Math.random() * 2000);
		wx.showToast({
			title: '请稍等...',
			icon: 'loading',
			mask: true,
			duration: times,
			success() {
				self.setData({
					btnLoading: true
				})
			}
		})
		setTimeout(() => {
			this.draw(Apis.indexCont)
			self.setData({
				btnLoading: false
			})
		}, times)
	},

	printText(filltext) {
		return filltext[Math.round(Math.random() * (Apis.indexCont.length - 1))]
	},
	async drawBackground() {
		ctx.drawImage('../../static/img/card_bg_01-small.jpg', 0, 0, 300, 450)
	},
	async drawTextTypeOne(filltext) {
		let content;
		if (filltext.length <= 1) {
			content = filltext[0]
		} else {
			content = this.printText(filltext)
		}
		ctx.font = '30px 方正清刻本悦宋简体'
		ctx.setFillStyle('#FFFFFF')
		ctx.shadowColor = '#ececec'
		// 设置文字阴影的颜色为黑色，透明度为20% 
		ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
		// 将阴影向右移动15px，向上移动10px    
		ctx.shadowOffsetX = 2;
		ctx.shadowOffsetY = 2;
		// 轻微模糊阴影   
		ctx.shadowBlur = 2;
		ctx.fillText(content.first, 20, 135)
		ctx.font = '15px 方正清刻本悦宋简体'
		this.textDrawLine(content.next, 15, 50, 20)
		console.log(content.next);
	},
	async drawUserName() {
		ctx.setFillStyle('#000000')
		//ctx.setTextAlign('center')
		ctx.shadowColor = '#ececec'
		ctx.font = '12px 方正清刻本悦宋简体'
		ctx.fillText(wx.getStorageSync('userInfo').nickName, 65, 400)
	},
	async textDrawLine(filltext, padding, x, y) {
		console.log(filltext);
		let chr = filltext.split('');
		let temp = '';
		let row = [];
		const ys = 3 * 30 + y;
		for (let a = 0; a < chr.length; a++) {
			if (ctx.measureText(temp).width < 260 - padding * 2 && ctx.measureText(temp + chr[a]).width <= 260 - padding * 2) {
				temp += chr[a];
			} else {
				row.push(temp);
				temp = chr[a];
			}
		}
		row.push(temp);
		for (let b = 0; b < row.length; b++) {
			ctx.fillText(row[b], x, ys + (b + 1) * 25); //每行字体y坐标间隔20
		}
		ctx.font = '13px 方正清刻本悦宋简体'
		ctx.fillText('——我在人间凑数的日子', 120, 140 + row.length * 25)
	},
	customTextHandle() {
		this.setData({
			mask: false,
			maskLeft: 'translateX(0px)'
		})
	},
	closeMaskHandle() {
		this.setData({
			mask: true,
			maskLeft: `translateX(${this.data.systemInfo.windowWidth + 20}px)`
		})
	},
	saveTextObject() {
		if (!this.data.inputValue) {
			wx.showToast({
				title: '你没在人间凑过数？',
				icon: 'none',
				mask: true
			})
			return
		}
		let obj = this.formatTextToObj(this.data.inputValue)
		let times = Math.floor(1000 + Math.random() * 2000)
		console.log(obj);
		wx.showToast({
			title: '请稍后...',
			icon: 'loading',
			mask: true,
			duration: times
		})
		setTimeout(() => {
			this.draw(obj)
			this.setData({
				mask: true,
				maskLeft: `translateX(${this.data.systemInfo.windowWidth + 20}px)`
			})
		}, times)
	},
	bindInputHandle(e) {
		this.setData({
			inputValue: e.detail.value
		})

	},
	formatTextToObj(t) {
		let arr = []
		let obj = new Object()
		obj.first = t.substring(0, 1)
		obj.next = t.substring(1)
		arr.push(obj)
		return arr
	},
	sharePyq() {
		wx.showToast({
			title: '请使用右上角胶囊按钮分享至朋友圈',
			icon: 'none',
			duration: 2000,
			mask: true
		})
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function(res) {
		return {
			title: `${wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').nickName}-我在人间凑数的日子`,
			imageUrl: this.data.canvasImagePath ? this.data.canvasImagePath : null,
			path: '/pages/index/index'
		}
	},
	onShareTimeline: function(res) {
		return {
			title: `${wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').nickName}-我在人间凑数的日子`,
			imageUrl: this.data.canvasImagePath ? this.data.canvasImagePath : null,
		}
	}
})
