// modules/db/disk.js: 数据库文件操作

var db = require('./base')

// 获取目录信息
function directory(username, path, callback) {
  let directory = db.gDb.collection('directory')
  directory.find({ username: username, directory: path }).toArray((err, result) => {
    if (err) {
      callback({ error: 'Internal Error', code: 104 })
      return
    }

    if (result.length == 0) {
      // 不存在该目录
      callback({ error: 'Directory Not Exist', code: 301 })
    } else {
      callback(err, result[0].items)
    }
  })
}

// 对外部暴露模块
module.exports = {
  directory
}