// routes/api/share.js: 分享操作 API 路由

const express = require('express')
const auth = require('../../modules/auth')
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

// 获取分享信息
router.get('/getInfo', (req, res) => {
  let link = req.query.link
  let password = req.query.password || ''

  if (!link) {
    // 缺少必要参数
    res.status(400).send({ error: 'Parameter Error', code: 103 })
    return
  }

  let UUID = new Buffer(link.substr(3), 'base64').toString()
  db.getInfo(UUID, password, (err, info) => {
    if (err) {
      res.status(err.code == 104 ? 500 : 403).send(err)
    } else {
      res.send(info)
    }
  })
})

// 下载分享文件
router.get('/download', (req, res) => {
  let UUID = req.query.UUID
  let password = req.query.password || ''

  if (!UUID) {
    // 缺少必要参数
    res.status(400).send({ error: 'Parameter Error', code: 103 })
    return
  }

  db.download(UUID, password, (err, name, realName) => {
    if (err) {
      res.status(err.code == 104 ? 500 : 403).send(err)
      return
    }

    // 签发下载 token
    auth.signDL(name, realName, (err, token) => {
      if (err) {
        res.status(500).send({ error: 'Internal Error', code: 104 })
      } else {
        res.send({ url: `/dl/${token}` })
      }
    })
  })
})

router.use((req, res) => {
  res.status(404).send({ error: 'Wrong API URL', code: 102 })
})

module.exports = router