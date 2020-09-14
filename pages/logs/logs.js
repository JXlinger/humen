//logs.js
const {formatTime} = getApp().Apis

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return formatTime(new Date(log))
      })
    })
  }
})
