// modules/db/base.js: MongoDB 数据库操作接口

const MongoClient = require('mongodb').MongoClient

const url = 'mongodb://localhost:27017'
const dbName = 'FooCloud'

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
      callback(err)
    } else {
      gClient = client
      gDb = client.db(dbName)
      module.exports.gClient = client
      module.exports.gDb = gDb
      callback()
    }
  })
}

// 关闭数据库
function close() {
  if (gClient && gClient.isConnected()) {
    gClient.close()
  }
}

// 对外部暴露模块
module.exports = {
  gClient,
  gDb,
  connect,
  close
}