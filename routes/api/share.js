// routes/api/share.js: 分享操作 API 路由

const express = require('express')
const db = require('../../modules/db/share')

const router = express.Router()

// 创建分享
router.post('/create', express.urlencoded({ extended: false }), (req, res) => {
  let name = req.body.name
  let path = req.body.path
  let password = req.body.password || "";

  if (!name || !path) {
    // 缺少必要参数
    res.status(400).send({ error: 'Parameter Error', code: 103 })
    return
  }

  db.create(req.username, name, path, password, (err, UUID) => {
    if (err) {
      res.status(err.code == 104 ? 500 : 403).send(err)
      return
    }

    // 通过 base64 编码产生 URL
    let url = new Buffer(UUID).toString('base64')
    res.send({ shareURL: `/s/${url}` })
  })
})

// 获取分享列表
router.get('/list', (req, res) => {
  db.list(req.username, (err, items) => {
    if (err) {
      res.status(500).send({ error: 'Internal Error', code: 104 })
    } else {
      let ans = []
      items.forEach(obj => ans.push({
        UUID: obj.UUID,
        name: obj.name,
        time: obj.time,
        password: obj.password,
        link: `/s/${new Buffer(obj.UUID).toString('base64')}`
      }))
      let count = ans.length
      res.send({ count: count, shares: ans })
    }
  })
})

// 取消分享
router.post('/cancel', express.urlencoded({ extended: false }), (req, res) => {
  let UUID = req.body.UUID

  if (!UUID) {
    // 缺少必要参数
    res.status(400).send({ error: 'Parameter Error', code: 103 })
    return
  }

  db.cancel(req.username, UUID, (err) => {
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