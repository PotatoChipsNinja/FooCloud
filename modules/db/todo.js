// modules/db/todo.js: 数据库待办事项操作

const uuid = require('uuid')
const db = require('./base')

// 添加待办事项
function add(username, content, callback) {
  let todo = db.gDb.collection('todo')
  let newTodo = { UUID: uuid.v1(), username: username, content: content, time: new Date().getTime(), finished: false }
  todo.insertOne(newTodo, (err, result) => {
    callback(err)
  })
}

// 获取待办事项列表
function list(username, callback) {
  let todo = db.gDb.collection('todo')
  todo.find({ username: username }).toArray((err, result) => {
    callback(err, result)
  })
}

// 切换待办事项完成状态
function switchStatus(username, UUID, callback) {
  let todo = db.gDb.collection('todo')
  todo.find({ username: username, UUID: UUID }).toArray((err, result) => {
    if (err) {
      callback({ error: 'Internal Error', code: 104 })
      return
    }

    if (result.length == 0) {
      // 不存在该待办事项
      callback({ error: 'TODO Not Exist', code: 501 })
      return
    }

    // 修改表项
    todo.updateOne({ username: username, UUID: UUID }, { $set: { finished: !result[0].finished } }, (err, result) => {
      if (err) {
        callback({ error: 'Internal Error', code: 104 })
      } else {
        callback()
      }
    })
  })
}

// 删除待办事项
function deleteItem(username, UUID, callback) {
  let todo = db.gDb.collection('todo')
  todo.find({ username: username, UUID: UUID }).toArray((err, result) => {
    if (err) {
      callback({ error: 'Internal Error', code: 104 })
      return
    }

    if (result.length == 0) {
      // 不存在该待办事项
      callback({ error: 'TODO Not Exist', code: 501 })
      return
    }

    // 删除表项
    todo.deleteOne({ username: username, UUID: UUID }, (err, result) => {
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
  add,
  list,
  switchStatus,
  deleteItem
}