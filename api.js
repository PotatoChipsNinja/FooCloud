// api.js: API Handler

const express = require('express')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const db = require('./db')

const router = express.Router()
let privateKey, cert

try {
  privateKey = fs.readFileSync('private.key') // 读取私钥
  cert = fs.readFileSync('public.pem')        // 读取公钥
} catch {
  // 读取密钥对失败
  console.log('Failed to load key pair!')
  process.exit(1)
}

router.use((req, res, next) => {
  console.log(`API Request: ${req.url}`)
  if (req.url == '/login' || req.url == '/register') {
    next()  // 登录和注册不需要鉴权
  } else {
    try {
      jwt.verify(req.get('Authorization').substr(7), cert)  // 鉴权
    } catch {
      // token 过期或被伪造
      res.status(401).send({ error: 'Authentication Failure', code: 101 })
      return
    }
    next()  // token 有效
  }
})

router.post('/user/login', express.urlencoded({ extended: false }), (req, res) => {
  let username = req.body.username
  let password = req.body.password

  if (!username || !password) {
    // 参数错误
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
      let token = jwt.sign({ username: username }, privateKey, { algorithm: 'RS256', expiresIn: '30m' })
      res.send({ token: token })
    }
  })
})

router.post('/user/register', express.urlencoded({ extended: false }), (req, res) => {
  let username = req.body.username
  let password = req.body.password

  if (!username || !password) {
    // 参数错误
    res.status(400).send({ error: 'Parameter Error', code: 103 })
    return
  }

  if (username.length < 5 || username.length > 20) {
    // 非法用户名
    res.status(403).send({ error: 'Illegal Username', code: 301})
    return
  }

  if (password.length < 8 || password.length > 32) {
    // 非法密码
    res.status(403).send({ error: 'Illegal Password', code: 302})
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

router.get('/test', (req, res) => {
  res.send('test')
})

router.use((req, res) => {
  res.status(404).send({ error: 'Wrong API URL', code: 102 })
})

module.exports = router