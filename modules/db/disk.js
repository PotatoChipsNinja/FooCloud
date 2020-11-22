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

// 创建目录
function createDir(username, name, path, callback) {
  let directory = db.gDb.collection('directory')
  directory.find({ username: username, directory: path }).toArray((err, result) => {
    if (err) {
      callback({ error: 'Internal Error', code: 104 })
      return
    }

    if (result.length == 0) {
      // 不存在父目录
      callback({ error: 'Directory Not Exist', code: 301 })
      return
    }

    if (result[0].items.find(obj => (obj.name == name && obj.type == 'dir'))) {
      // 已经存在该目录
      callback({ error: 'Directory Already Exist', code: 302 })
      return
    }

    let newDirPath = path == '/' ? `/${name}` : `${path}/${name}`
    let newItem = { name: name, type: 'dir', path: path, UUID: '', size: 0, time: new Date().getTime() }
    directory.updateOne({ username: username, directory: path }, { $push: { items: newItem } }, (err, result) => {
      if (err) {
        callback({ error: 'Internal Error', code: 104 })
        return
      }

      directory.insertOne({ username: username, directory: newDirPath, items: [] }, (err, result) => {
        if (err) {
          callback({ error: 'Internal Error', code: 104 })
        } else {
          callback()
        }
      })
    })
  })
}

// 对外部暴露模块
module.exports = {
  directory,
  createDir
}