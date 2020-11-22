// routes/api/user.js: 用户操作 API 路由

const express = require('express')
const crypto = require('crypto')
const auth = require('../../modules/auth')
const db = require('../../modules/db/user')

const router = express.Router()

router.post('/login', express.urlencoded({ extended: false }), (req, res) => {
  let username = req.body.username
  let password = req.body.password

  if (!username || !password) {
    // 缺少必要参数
    res.status(400).send({ error: 'Parameter Error', code: 103 })
    return
  }

  // 对密码取 SHA-256 散列
  password = crypto.createHash('SHA256').update(req.body.password).digest('hex')

  db.login(username, password, (err) => {
    if (err) {
      res.status(err.code == 104 ? 500 : 403).send(err)
    } else {
      // 登陆成功，返回 token
      auth.sign(username, (err, token) => {
        if (err) {
            res.status(500).send({ error: 'Internal Error', code: 104 })
        } else {
            res.send({ token: token })
        }
      })
    }
  })
})

router.post('/register', express.urlencoded({ extended: false }), (req, res) => {
  let username = req.body.username
  let password = req.body.password

  if (!username || !password) {
    // 缺少必要参数
    res.status(400).send({ error: 'Parameter Error', code: 103 })
    return
  }

  if (username.length < 5 || username.length > 20) {
    // 非法用户名
    res.status(403).send({ error: 'Illegal Username', code: 203})
    return
  }

  if (password.length < 8 || password.length > 32) {
    // 非法密码
    res.status(403).send({ error: 'Illegal Password', code: 204})
    return
  }

  // 对密码取 SHA-256 散列
  password = crypto.createHash('SHA256').update(req.body.password).digest('hex')

  db.register(username, password, (err) => {
    if (err) {
      res.status(err.code == 104 ? 500 : 403).send(err)
    } else {
      res.send({ success: true })  // 注册成功
    }
  })
})

router.use((req, res) => {
  res.status(404).send({ error: 'Wrong API URL', code: 102 })
})

module.exports = router