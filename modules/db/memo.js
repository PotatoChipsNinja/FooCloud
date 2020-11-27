// modules/db/memo.js 备忘录数据库操作

const db = require('./base.js')

function createNote(username, title, content, callback) {
  let memo = db.gDb.collection('memo')
  let note = { username: username, title: title, content: content, time: new Date().getTime() }
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

function editNote(username, title, content, new_title, new_content, callback) {
  let memo = db.gDb.collection('memo')
  
  memo.find({ username: username }).toArray((err, result) => {
    if (err) {
      callback({ error: 'Internal Error', code: 104 })
      return
    }

    let note = result.find(obj => (obj.title == title && obj.content == content))
    if (!note) {
      callback({ error: 'Note Not Exist', code: 401 })
      return
    }

    if (result.find(obj => (obj.title == new_title))) {
      callback({ error: 'Note Already Exist', code: 402 })
      return
    }

    memo.updateOne(note, { $set: { title: new_title, content: new_content, time: new Date().getTime() } }, (err) => {
      if (err) {
        callback({ error: 'Internal Error', code: 104 })
      } else {
        callback()
      }
    })
  })
}

function deleteNote(username, title, content, callback) {
  let memo = db.gDb.collection('memo')
  
  memo.find({ username: username }).toArray((err, result) => {
    if (err) {
      callback({ error: 'Internal Error', code: 104 })
      return
    }

    let notes = result
    let noteObj = notes.find(obj => (obj.title == title && obj.content == content))
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