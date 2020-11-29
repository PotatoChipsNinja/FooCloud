// routes/api/memo.js: 备忘录操作 API 路由

const express = require('express')
const db = require('../../modules/db/memo')

const router = express.Router()

router.post('/createNote', express.urlencoded({ extended: false }), (req, res) => {
  let title = req.body.title
  let content = req.body.content || ''

  if (!title) {
    // 缺少必要参数
    res.status(400).send({ error: 'Parameter Error', code: 103 })
    return
  }

  db.createNote(req.username, title, content, (err) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.send({ success: true })
    }
  })
})

router.get('/getNotes', (req, res) => {
  let sort = req.query.sort

  sort = sort ? parseInt(sort) : 0
  let sortFunc

  switch (sort) {
    case 0: 
      // 按时间升序
      sortFunc = (a, b) => {
        return a.time < b.time ? 1 : -1
      }
      break;
  
    case 1:
      // 按时间降序
      sortFunc = (a, b) => {
        return a.time > b.time ? 1 : -1
      }
    default:
      res.status(400).send({ error: 'Parameter Error', code: 103 })
      return
  }

  db.getNotes(req.username, (err, notes) => {
    if (err) {
      res.status(500).send(err)
    } else {
      notes.forEach(obj => delete(obj._id))
      notes.forEach(obj => delete(obj.username))
      notes.sort(sortFunc)
      let noteNum = notes.length
      res.send({ noteNum: noteNum, notes: notes })
    }
  })
})

router.post('/editNote', express.urlencoded({ extended: false }), (req, res) => {
  let username = req.username
  let uuid = req.body.uuid
  let title = req.body.title
  let content = req.body.content || ''

  if (!uuid || !title) {
    res.status(400).send({ error: 'Parameter Error', code: 103 })
    return
  }

  db.editNote(username, uuid, title, content, (err) => {
    if (err) {
      res.status(err.code == 104 ? 500 : 403).send(err)
    } else {
      res.send({ success: true })
    }
  })
})

router.post('/deleteNote', express.urlencoded({ extended: false }), (req, res) => {
  let username = req.username
  let uuid = req.body.uuid

  if (!uuid) {
    res.status(400).send({ error: 'Parameter Error', code: 103 })
    return
  }

  db.deleteNote(username, uuid, (err) => {
    if (err) {
      res.status(err.code == 104 ? 500 : 403).send(err)
    } else {
      res.send({ success: true })
    }
  })
})

router.use((req, res) => {
  res.status(404).send({ error: 'Wrong API URL', code: 102 })
})

module.exports = router