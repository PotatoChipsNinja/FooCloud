// modules/db/memo.js 备忘录数据库操作

const db = require('./base.js')
const uuid = require('uuid')

function createNote(username, title, content, callback) {
  let memo = db.gDb.collection('memo')
  let note = { username: username, title: title, content: content, time: new Date().getTime(), uuid: uuid.v1() }
  memo.insertOne(note, (err) => {
    if (err) {
      callback({ error: 'Internal Error', code: 104 })
    } else {
      callback()
    }
  })
}

function getNotes(username, callback) {
  let memo = db.gDb.collection('memo')
  memo.find({ username: username }).toArray((err, result) => {
    if (err) {
      callback({ error: 'Internal Error', code: 104 })
      return
    }

    callback(err, result)
  })
}

function editNote(username, uuid, title, content, callback) {
  let memo = db.gDb.collection('memo')
  
  memo.find({ username: username }).toArray((err, result) => {
    if (err) {
      callback({ error: 'Internal Error', code: 104 })
      return
    }

    let note = result.find(obj => (obj.uuid == uuid))
    if (!note) {
      callback({ error: 'Note Not Exist', code: 401 })
      return
    }

    memo.updateOne(note, { $set: { title: title, content: content, time: new Date().getTime() } }, (err) => {
      if (err) {
        callback({ error: 'Internal Error', code: 104 })
      } else {
        callback()
      }
    })
  })
}

function deleteNote(username, uuid, callback) {
  let memo = db.gDb.collection('memo')
  
  memo.find({ username: username }).toArray((err, result) => {
    if (err) {
      callback({ error: 'Internal Error', code: 104 })
      return
    }

    let notes = result
    let noteObj = notes.find(obj => (obj.uuid == uuid))
    if (!noteObj) {
      callback({ error: 'Note Not Exist', code: 401 })
      return
    }

    memo.deleteOne(noteObj, (err) => {
      if (err) {
        callback({ error: 'Internal Error', code: 104 })
      } else {
        callback()
      }
    })
  })
}

module.exports = {
  createNote,
  getNotes,
  editNote,
  deleteNote,

}