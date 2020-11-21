// routes/api/index.js: API 主路由

const express = require('express')
const auth = require('../../modules/auth')
const userRouter = require('./user')
const diskRouter = require('./disk')

const router = express.Router()

router.use((req, res, next) => {
  console.log(`API Request: ${req.url}`)
  if (req.url == '/user/login' || req.url == '/user/register') {
    next()  // 登录和注册不需要鉴权
  } else {
    let token

    try {
      token = req.get('Authorization').substr(7)
    } catch {
      // 在请求头中没有找到 Authorization 属性
      res.status(401).send({ error: 'Authentication Failure', code: 101 })
      return
    }

    auth.verify(token, (err, username) => {
      if (err) {
        res.status(401).send({ error: 'Authentication Failure', code: 101 })  // token 无效
      } else {
        next()
      }
    })
  }
})

router.use('/user', userRouter)
router.use('/disk', diskRouter)

router.use((req, res) => {
  res.status(404).send({ error: 'Wrong API URL', code: 102 })  // URL 匹配失败
})

module.exports = router