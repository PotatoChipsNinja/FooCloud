// routes/api/index.js: API 主路由

const express = require('express')
const auth = require('../../modules/auth')
const userRouter = require('./user')
const diskRouter = require('./disk')
const shareRouter = require('./share')
const memoRouter = require('./memo')

const router = express.Router()

// 不需要鉴权的 API 列表
const authFreeList = [
  '/user/login',
  '/user/register',
  '/share/getInfo',
  '/share/download'
]

router.use((req, res, next) => {
  console.log(`API Request: ${req.url}`)
  if (authFreeList.indexOf(req.path) >= 0) {
    next()  // 不需要鉴权
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
        req.username = username  // 把用户名加入请求的 username 属性
        next()
      }
    })
  }
})

router.use('/user', userRouter)  // 用户服务 API
router.use('/disk', diskRouter)  // 文件服务 API
router.use('/share', shareRouter)// 分享服务 API
router.use('/memo', memoRouter)  // 备忘录服务 API

router.use((req, res) => {
  res.status(404).send({ error: 'Wrong API URL', code: 102 })  // URL 匹配失败
})

module.exports = router