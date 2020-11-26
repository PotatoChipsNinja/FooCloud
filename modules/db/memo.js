// modules/db/memo.js 备忘录数据库操作

const db = require('./base.js')

function createNote(username, title, content, callback) {
  let memo = db.gDb.collection('memo')
  memo.find({ username: username }).toArray((err, result) => {
    if (err) {
      callback({ error: 'Internal Error', code: 104 })
      return
    }

    if (result[0].notes.find(obj => (obj.title == title))) {
      callback({ error: 'Note Already Exist', code: 402 })
      return
    }

    let newNote = { title: title, content: content, time: new Date().getTime() }

    memo.updateOne({ username: username }, { $push: { notes: newNote } }, (err) => {
      if (err) {
        callback({ error: 'Internal Error', code: 104 })
      } else {
        callback()
      }
    })
  })
}

function getNotes(username, callback) {
  let memo = db.gDb.collection('memo')
  memo.find({ username: username }).toArray((err, result) => {
    if (err) {
      callback({ error: 'Internal Error', code: 104 })
      return
    }

    callback(err, result[0].notes)
  })
}

function editNote(username, title, content, new_title, new_content, callback) {
  let memo = db.gDb.collection('memo')
  
  memo.find({ username: username }).toArray((err, result) => {
    if (err) {
      callback({ error: 'Internal Error', code: 104 })
      return
    }

    let note = result[0].notes.find(obj => (obj.title == title && obj.content == content))
    if (!note) {
      callback({ error: 'Note Not Exist', code: 401 })
      return
    }

    if (result[0].notes.find(obj => (obj.title == new_title))) {
      callback({ error: 'Note Already Exist', code: 402 })
      return
    }

    memo.updateOne({ username: username }, { $pull: { notes: note } }, (err, result) => {
      if (err) {
        callback({ error: 'Internal Error', code: 104 })
      } else {
        let newNote = { title: new_title, content: new_content, time: new Date().getTime() }
        memo.updateOne({ username: username }, { $push: { notes: newNote }}, (err, result) => {
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

function deleteNote(username, title, content, callback) {
  let memo = db.gDb.collection('memo')
  
  memo.find({ username: username }).toArray((err, result) => {
    if (err) {
      callback({ error: 'Internal Error', code: 104 })
      return
    }

    let note = result[0].notes.find(obj => (obj.title == title && obj.content == content))
    if (!note) {
      callback({ error: 'Note Not Exist', code: 401 })
      return
    }

    memo.updateOne({ username: username }, { $pull: { notes: note } }, (err, result) => {
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