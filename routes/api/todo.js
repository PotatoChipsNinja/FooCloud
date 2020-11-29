// routes/api/todo.js: 待办事项 API 路由

const express = require('express')
const db = require('../../modules/db/todo')

const router = express.Router()

// 添加待办事项
router.post('/add', express.urlencoded({ extended: false }), (req, res) => {
  let content = req.body.content

  if (!content) {
    // 缺少必要参数
    res.status(400).send({ error: 'Parameter Error', code: 103 })
    return
  }

  db.add(req.username, content, (err) => {
    if (err) {
      res.status(500).send({ error: 'Internal Error', code: 104 })
    } else {
      res.send({ success: true })
    }
  })
})

// 获取待办事项列表
router.get('/list', (req, res) => {
  db.list(req.username, (err, items) => {
    if (err) {
      res.status(500).send({ error: 'Internal Error', code: 104 })
    } else {
      items.forEach(obj => delete(obj.username))
      // 按时间降序排列
      items.sort((a, b) => {
        return b.time - a.time
      })
      let count = items.length
      res.send({ count: count, items: items })
    }
  })
})

// 切换待办事项完成状态
router.post('/switch', express.urlencoded({ extended: false }), (req, res) => {
  let UUID = req.body.UUID

  if (!UUID) {
    // 缺少必要参数
    res.status(400).send({ error: 'Parameter Error', code: 103 })
    return
  }

  db.switchStatus(req.username, UUID, (err) => {
    if (err) {
      res.status(err.code == 104 ? 500 : 403).send(err)
    } else {
      res.send({ success: true })
    }
  })
})

// 删除待办事项
router.post('/delete', express.urlencoded({ extended: false }), (req, res) => {
  let UUID = req.body.UUID

  if (!UUID) {
    // 缺少必要参数
    res.status(400).send({ error: 'Parameter Error', code: 103 })
    return
  }

  db.deleteItem(req.username, UUID, (err) => {
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