// modules/db/share.js: 数据库分享操作

const uuid = require('uuid')
const db = require('./base')

// 创建分享
function create(username, name, path, password, callback) {
  let directory = db.gDb.collection('directory')
  directory.find({ username: username, directory: path }).toArray((err, result) => {
    if (err) {
      callback({ error: 'Internal Error', code: 104 })
      return
    }

    if (result.length == 0) {
      // 不存在该目录
      callback({ error: 'Directory Not Exist', code: 301 })
      return
    }

    let fileObj = result[0].items.find(obj => (obj.name == name && obj.type == 'file'))

    if (!fileObj) {
      // 不存在该文件
      callback({ error: 'File Not Exist', code: 304 })
      return
    }

    // 添加分享表项
    let share = db.gDb.collection('share')
    let newShare = { UUID: uuid.v1(), username: username, name: name, realName: fileObj.realName, time: new Date().getTime(), password: password }
    share.insertOne(newShare, (err, result) => {
      if (err) {
        callback({ error: 'Internal Error', code: 104 })
      } else {
        callback(err, newShare.UUID)
      }
    })
  })
}

// 获取分享列表
function list(username, callback) {
  let share = db.gDb.collection('share')
  share.find({ username: username }).toArray((err, result) => {
    callback(err, result)
  })
}

// 取消分享
function cancel(username, UUID, callback) {
  let share = db.gDb.collection('share')
  share.find({ username: username, UUID: UUID }).toArray((err, result) => {
    if (err) {
      callback({ error: 'Internal Error', code: 104 })
      return
    }

    if (result.length == 0) {
      // 不存在该分享
      callback({ error: 'Share Not Exist', code: 305 })
      return
    }

    // 删除表项
    share.deleteOne({ username: username, UUID: UUID }, (err, result) => {
      if (err) {
        callback({ error: 'Internal Error', code: 104 })
      } else {
        callback()
      }
    })
  })
}

// 对外部暴露模块
module.exports = {
  create,
  list,
  cancel
}