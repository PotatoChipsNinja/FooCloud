// modules/db/user.js: 数据库用户操作

var db = require('./base')

// 登录
function login(username, password, callback) {
  let user = db.gDb.collection('user')
  user.find({ username: username }).toArray((err, result) => {
    if (err) {
      callback({ error: 'Internal Error', code: 104 })
      return
    }

    if (result.length == 0) {
      // 没有找到用户
      callback({ error: 'Username Not Exist', code: 201 })
      return
    }

    if (result[0].password != password) {
      callback({ error: 'Wrong Password', code: 202 })  // 密码错误
    } else {
      callback()  // 校验正确
    }
  })
}

// 注册
function register(username, password, callback) {
  let user = db.gDb.collection('user')
  user.find({ username: username }).toArray((err, result) => {
    if (err) {
      callback({ error: 'Internal Error', code: 104 })
      return
    }

    if (result.length > 0) {
      // 用户名重复
      callback({ error: 'Occupied Username', code: 205 })
      return
    }

    let obj = { username: username, password: password }
    user.insertOne(obj, (err, result) => {
      if (err) {
        callback({ error: 'Internal Error', code: 104 })
      } else {
        // 在 directory 表中为新用户建立根目录
        let directory = db.gDb.collection('directory')
        let root = { username: username, directory: '/', items: [] }
        directory.insertOne(root, (err, result) => {
          if (err) {
            callback({ error: 'Internal Error', code: 104 })
          } else {
            callback()
          }
        })
      }
    })
  })
}

// 对外部暴露模块
module.exports = {
  login,
  register
}