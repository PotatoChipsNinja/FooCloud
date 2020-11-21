// db.js: MongoDB数据库操作接口

const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'FooCloud';

var gClient, gDb

// 连接数据库
function connect(callback) {
  if (gDb) {
    callback()
    return
  }
  MongoClient.connect(url, { useUnifiedTopology: true }, function(err, client) {
    if (err) {
      // 数据库连接失败
      callback(true)
      return
    }
    gClient = client
    gDb = client.db(dbName)
    callback()
  })
}

// 关闭数据库
function close() {
  if (gClient && gClient.isConnected()) {
    gClient.close()
  }
}

// 登录
function login(username, password, callback) {
  let user = gDb.collection('user')
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
  let user = gDb.collection('user')
  user.find({ username: username }).toArray((err, result) => {
    if (err) {
      callback({ error: 'Internal Error', code: 104 })
      return
    }

    if (result.length > 0) {
      // 用户名重复
      callback({ error: 'Occupied Username', code: 303 })
      return
    }

    let obj = { username: username, password: password }
    user.insertOne(obj, (err, result) => {
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
  connect,
  close,
  login,
  register
}